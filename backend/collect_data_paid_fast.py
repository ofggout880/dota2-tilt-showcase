import asyncio
import os
import json
import time
import pandas as pd
import numpy as np
from typing import List, Dict, Any, Set
from dotenv import load_dotenv

from opendota_client import OpenDotaClient
from collect_data import update_status, calculate_sessions, get_streak_at_cutoff

load_dotenv()

DATASET_FILE = "data/dota2_players_dataset.csv"
BACKUP_FILE = "data/dota2_players_dataset_old.csv"

async def collect_paid_fast():
    client = OpenDotaClient()
    update_status("in_progress", 0, 0, 0, 10000, "Démarrage de la collecte rapide (Plan Payant)...")
    
    # Backup existing
    old_ids = []
    if os.path.exists(DATASET_FILE):
        df = pd.read_csv(DATASET_FILE)
        old_ids = df["account_id"].dropna().astype(int).tolist()
        os.rename(DATASET_FILE, BACKUP_FILE)
        print(f"Sauvegarde de l'ancien dataset avec {len(old_ids)} IDs.")
    
    # We will track valid processed rows
    valid_rows = []
    processed_count = 0
    target_count = 10000
    
    # Prepare queues
    id_queue = list(set(old_ids))
    discovered_ids = set(id_queue)
    
    less_than_match_id = None
    
    async def discover_more_ids():
        nonlocal less_than_match_id
        params = {}
        if less_than_match_id:
            params["less_than_match_id"] = less_than_match_id
            
        print("Découverte de nouveaux matchs...")
        try:
            matches = await client.get("publicMatches", params=params)
            if not matches:
                return
            
            less_than_match_id = min(m["match_id"] for m in matches)
            
            # Fetch details for top 20 matches to get players
            async def get_match_players(m_id):
                try:
                    details = await client.get_match_details(m_id)
                    return [p["account_id"] for p in details.get("players", []) if p.get("account_id") and p.get("rank_tier")]
                except:
                    return []
                    
            tasks = [get_match_players(m["match_id"]) for m in matches[:20]]
            results = await asyncio.gather(*tasks)
            
            new_added = 0
            for local_ids in results:
                for acc_id in local_ids:
                    if acc_id not in discovered_ids:
                        discovered_ids.add(acc_id)
                        id_queue.append(acc_id)
                        new_added += 1
            print(f"Nouveaux IDs découverts : {new_added}")
        except Exception as e:
            print(f"Erreur lors de la découverte: {e}")

    sem_players = asyncio.Semaphore(20) # 20 concurrent requests
    
    async def process_player(player_id):
        async with sem_players:
            try:
                # Profil joueur
                info = await client.get_player_info(player_id)
                rank_tier = info.get("rank_tier")
                if not rank_tier:
                    return None
                    
                # Historique
                raw_matches = await client.get_player_matches(player_id, limit=100)
                if not raw_matches:
                    return None
                    
                matches = [m for m in raw_matches if m.get("game_mode") != 23]
                if len(matches) < 25:
                    return None
                    
                matches = sorted(matches, key=lambda x: x.get("start_time", 0), reverse=True)
                
                target_matches = matches[:15]
                obs_matches = matches[15:]
                
                last_obs_time = obs_matches[0].get("start_time", 0)
                first_target_time = target_matches[-1].get("start_time", 0)
                
                time_gap_seconds = first_target_time - last_obs_time
                is_churn = 1 if time_gap_seconds > 14 * 86400 else 0
                
                win_count = 0
                kills, deaths, assists = [], [], []
                gpm, xpm, last_hits = [], [], []
                hero_damage, tower_damage, hero_healing = [], [], []
                durations = []
                unique_heroes = set()
                lanes = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
                lane_roles = {1: 0, 2: 0, 3: 0, 4: 0}
                rank_imbalances = []
                
                for m in obs_matches:
                    p_slot = m.get("player_slot", 0)
                    r_win = m.get("radiant_win", False)
                    is_rad = p_slot < 128
                    is_win = (is_rad and r_win) or (not is_rad and not r_win)
                    
                    if is_win: win_count += 1
                    kills.append(m.get("kills", 0))
                    deaths.append(m.get("deaths", 0))
                    assists.append(m.get("assists", 0))
                    gpm.append(m.get("gold_per_min", 0))
                    xpm.append(m.get("xp_per_min", 0))
                    last_hits.append(m.get("last_hits", 0))
                    hero_damage.append(m.get("hero_damage", 0))
                    tower_damage.append(m.get("tower_damage", 0))
                    hero_healing.append(m.get("hero_healing", 0))
                    durations.append(m.get("duration", 0))
                    unique_heroes.add(m.get("hero_id"))
                    
                    lane = m.get("lane")
                    if lane in lanes: lanes[lane] += 1
                    lane_role = m.get("lane_role")
                    if lane_role in lane_roles: lane_roles[lane_role] += 1
                        
                    avg_rank = m.get("average_rank")
                    if avg_rank:
                        rank_imbalances.append(abs(rank_tier - avg_rank))

                num_games = len(obs_matches)
                session_stats = calculate_sessions(obs_matches)
                streak_at_cutoff = get_streak_at_cutoff(obs_matches)
                avg_rank_imbalance = sum(rank_imbalances) / len(rank_imbalances) if rank_imbalances else 0.0
                
                abandons = sum(1 for m in obs_matches if m.get("leaver_status", 0) > 0)
                abandon_rate = abandons / num_games
                party_games = sum(1 for m in obs_matches if m.get("party_size") is not None and m.get("party_size") > 1)
                party_play_pct = party_games / num_games
                ranked_games = sum(1 for m in obs_matches if m.get("lobby_type") == 7)
                ranked_play_pct = ranked_games / num_games
                
                split_idx = min(10, max(3, num_games // 2))
                recent_subset = obs_matches[:split_idx]
                older_subset = obs_matches[split_idx:]
                
                recent_wins = sum(1 for m in recent_subset if ((m.get("player_slot", 0) < 128) == m.get("radiant_win", False)))
                win_rate_recent = recent_wins / split_idx
                older_wins = sum(1 for m in older_subset if ((m.get("player_slot", 0) < 128) == m.get("radiant_win", False)))
                win_rate_older = older_wins / len(older_subset) if older_subset else win_rate_recent
                win_rate_trend = win_rate_recent - win_rate_older
                
                def get_kda_sub(subset):
                    if not subset: return 3.0
                    k = sum(m.get("kills", 0) for m in subset)
                    d = sum(m.get("deaths", 0) for m in subset)
                    a = sum(m.get("assists", 0) for m in subset)
                    return (k + a) / max(1, d)
                kda_trend = get_kda_sub(recent_subset) - get_kda_sub(older_subset)
                
                def get_avg_metric(subset, metric):
                    if not subset: return 0.0
                    return sum(m.get(metric, 0) for m in subset) / len(subset)
                
                gpm_trend = get_avg_metric(recent_subset, "gold_per_min") - get_avg_metric(older_subset, "gold_per_min")
                xpm_trend = get_avg_metric(recent_subset, "xp_per_min") - get_avg_metric(older_subset, "xp_per_min")
                deaths_trend = get_avg_metric(recent_subset, "deaths") - get_avg_metric(older_subset, "deaths")
                kills_trend = get_avg_metric(recent_subset, "kills") - get_avg_metric(older_subset, "kills")
                assists_trend = get_avg_metric(recent_subset, "assists") - get_avg_metric(older_subset, "assists")
                
                player_features = {
                    "account_id": player_id,
                    "personaname": info.get("profile", {}).get("personaname", f"Joueur {player_id}"),
                    "rank_tier": rank_tier,
                    "games_analyzed": num_games,
                    "is_churn": is_churn,
                    "time_gap_days": time_gap_seconds / 86400.0,
                    "current_streak_at_cutoff": streak_at_cutoff,
                    "avg_session_games": session_stats["avg_session_games"],
                    "avg_session_duration": session_stats["avg_session_duration"],
                    "avg_session_gap_days": session_stats["avg_session_gap_days"],
                    "avg_rank_imbalance": avg_rank_imbalance,
                    "abandon_rate": abandon_rate,
                    "party_play_pct": party_play_pct,
                    "ranked_play_pct": ranked_play_pct,
                    "win_rate_trend": win_rate_trend,
                    "kda_trend": kda_trend,
                    "gpm_trend": gpm_trend,
                    "xpm_trend": xpm_trend,
                    "deaths_trend": deaths_trend,
                    "kills_trend": kills_trend,
                    "assists_trend": assists_trend,
                    "win_rate": win_count / num_games,
                    "avg_kills": sum(kills) / num_games,
                    "avg_deaths": sum(deaths) / num_games,
                    "avg_assists": sum(assists) / num_games,
                    "avg_kda": (sum(kills) + sum(assists)) / max(1, sum(deaths)),
                    "avg_gpm": sum(gpm) / num_games,
                    "avg_xpm": sum(xpm) / num_games,
                    "avg_last_hits": sum(last_hits) / num_games,
                    "avg_hero_damage": sum(hero_damage) / num_games,
                    "avg_tower_damage": sum(tower_damage) / num_games,
                    "avg_hero_healing": sum(hero_healing) / num_games,
                    "avg_duration": sum(durations) / num_games,
                    "hero_diversity": len(unique_heroes) / num_games,
                    "lane_top_pct": lanes[1] / num_games,
                    "lane_mid_pct": lanes[2] / num_games,
                    "lane_bot_pct": lanes[3] / num_games,
                    "role_core_pct": lane_roles[1] / num_games,
                    "role_support_pct": lane_roles[2] / num_games,
                    "role_roamer_pct": lane_roles[3] / num_games,
                    "role_jungler_pct": lane_roles[4] / num_games
                }
                return player_features
            except Exception as e:
                # Silently ignore invalid profiles to go faster
                return None

    # Main loop
    batch_size = 50
    
    while processed_count < target_count:
        if len(id_queue) < batch_size:
            await discover_more_ids()
            continue
            
        current_batch_ids = [id_queue.pop(0) for _ in range(min(batch_size, len(id_queue)))]
        
        tasks = [process_player(pid) for pid in current_batch_ids]
        results = await asyncio.gather(*tasks)
        
        valid_results = [r for r in results if r is not None]
        
        if valid_results:
            df = pd.DataFrame(valid_results)
            # Append to dataset
            df.to_csv(DATASET_FILE, mode='a', header=not os.path.exists(DATASET_FILE), index=False)
            
            processed_count += len(valid_results)
            
            update_status(
                "in_progress", 
                0, 0, 
                processed_count, 
                target_count, 
                f"Collecte rapide en cours : {processed_count}/{target_count} profils valides enregistrés..."
            )
            print(f"Progression : {processed_count}/{target_count} ({len(valid_results)} valides dans ce batch de {len(current_batch_ids)}). IDs restants en queue: {len(id_queue)}")
            
        # Optional short sleep to prevent hammering if needed, but semaphores + rate limit handle it
        await asyncio.sleep(0.1)
        
    update_status("completed", 0, 0, processed_count, target_count, f"Collecte payante rapide terminée : {processed_count} profils valides avec toutes les features ! Vous pouvez maintenant relancer l'entraînement.")
    print("Terminé avec succès.")
    await client.close()

if __name__ == "__main__":
    asyncio.run(collect_paid_fast())
