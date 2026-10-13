import asyncio
import os
import json
import pandas as pd
import numpy as np
from typing import List, Dict, Any, Set
from dotenv import load_dotenv

from opendota_client import OpenDotaClient

load_dotenv()

STATUS_FILE = "data/collection_status.json"
DATASET_FILE = "data/dota2_players_dataset.csv"

os.makedirs("data", exist_ok=True)

def update_status(status: str, matches_completed: int, matches_total: int, 
                  players_completed: int, players_total: int, log_message: str):
    """Met à jour le statut dans le fichier JSON pour le dashboard frontend."""
    try:
        # Calculer le nombre d'appels API
        total_calls = 15 + matches_completed + (players_completed * 2)
        cost_usd = 0.0 # Plus aucun coût (Plan Gratuit)
        
        data = {
            "status": status,
            "matches_completed": matches_completed,
            "matches_total": matches_total,
            "players_completed": players_completed,
            "players_total": players_total,
            "current_message": log_message,
            "total_api_calls": total_calls,
            "estimated_cost_usd": cost_usd
        }
        
        log_messages = []
        if os.path.exists(STATUS_FILE):
            try:
                with open(STATUS_FILE, "r") as f:
                    old_data = json.load(f)
                    log_messages = old_data.get("log_messages", [])
                    # Préserver le timestamp de la dernière collecte réussie
                    if "last_run_timestamp" in old_data:
                        data["last_run_timestamp"] = old_data["last_run_timestamp"]
            except:
                pass
                
        # Si la collecte est terminée avec succès, on enregistre le timestamp actuel
        if status == "completed":
            import time
            data["last_run_timestamp"] = time.time()
            
        log_messages.append(log_message)
        if len(log_messages) > 15:
            log_messages = log_messages[-15:]
            
        data["log_messages"] = log_messages
        
        with open(STATUS_FILE, "w") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        print(f"Erreur d'écriture du statut: {e}")

def calculate_sessions(matches: List[Dict[str, Any]]) -> Dict[str, float]:
    """
    Reconstitue les sessions de jeu d'un joueur à partir de ses matchs (triés chronologiquement).
    Une session est définie par des matchs consécutifs espacés de moins de 2 heures.
    """
    if not matches:
        return {"avg_session_games": 1.0, "avg_session_duration": 30.0, "avg_session_gap_days": 1.0}
        
    # Trier par start_time croissant
    sorted_m = sorted(matches, key=lambda x: x.get("start_time", 0))
    
    sessions = []
    current_session = []
    
    for m in sorted_m:
        start_time = m.get("start_time")
        duration = m.get("duration", 0)
        if not start_time:
            continue
            
        if not current_session:
            current_session.append(m)
        else:
            prev_m = current_session[-1]
            prev_end = prev_m.get("start_time", 0) + prev_m.get("duration", 0)
            
            # Si l'écart de temps entre la fin du match précédent et le début de celui-ci est < 2 heures (7200 sec)
            if start_time - prev_end < 7200:
                current_session.append(m)
            else:
                sessions.append(current_session)
                current_session = [m]
                
    if current_session:
        sessions.append(current_session)
        
    # Calculer les métriques moyennes des sessions
    session_games = [len(s) for s in sessions]
    
    session_durations = []
    for s in sessions:
        if len(s) == 1:
            session_durations.append(s[0].get("duration", 0) / 60.0) # en minutes
        else:
            start = s[0].get("start_time", 0)
            end = s[-1].get("start_time", 0) + s[-1].get("duration", 0)
            session_durations.append((end - start) / 60.0)
            
    # Écarts entre les sessions (en jours)
    session_gaps = []
    for i in range(1, len(sessions)):
        prev_end = sessions[i-1][-1].get("start_time", 0) + sessions[i-1][-1].get("duration", 0)
        curr_start = sessions[i][0].get("start_time", 0)
        session_gaps.append((curr_start - prev_end) / 86400.0) # en jours
        
    avg_session_games = sum(session_games) / len(sessions) if sessions else 1.0
    avg_session_duration = sum(session_durations) / len(sessions) if sessions else 30.0
    avg_session_gap = sum(session_gaps) / len(session_gaps) if session_gaps else 2.0
    
    return {
        "avg_session_games": avg_session_games,
        "avg_session_duration": avg_session_duration,
        "avg_session_gap_days": avg_session_gap
    }

def get_streak_at_cutoff(matches: List[Dict[str, Any]]) -> int:
    """
    Calcule la série de victoires (nombre positif) ou défaites (nombre négatif) 
    qui s'est terminée juste au cutoff (matches[0] étant le plus récent de la fenêtre d'observation).
    """
    if not matches:
        return 0
        
    # matches[0] est le match le plus récent avant le cutoff
    first_match = matches[0]
    player_slot = first_match.get("player_slot", 0)
    radiant_win = first_match.get("radiant_win", False)
    is_radiant = player_slot < 128
    first_win = (is_radiant and radiant_win) or (not is_radiant and not radiant_win)
    
    streak = 1 if first_win else -1
    
    for m in matches[1:]:
        p_slot = m.get("player_slot", 0)
        r_win = m.get("radiant_win", False)
        is_rad = p_slot < 128
        win = (is_rad and r_win) or (not is_rad and not r_win)
        
        if win == first_win:
            if first_win:
                streak += 1
            else:
                streak -= 1
        else:
            break
            
    return streak

async def collect_data():
    free_tier = os.getenv("OPENDOTA_FREE_TIER", "True").lower() == "true"
    client = OpenDotaClient(free_tier=free_tier)
    
    plan_name = "Plan Gratuit" if free_tier else "Plan Premium"
    update_status("in_progress", 0, 0, 0, 0, f"Démarrage de la collecte ({plan_name}) pour la prédiction de Churn...")
    
    try:

        import pandas as pd
        existing_df = pd.read_csv(DATASET_FILE)
        new_player_ids = existing_df["account_id"].dropna().astype(int).tolist()
        player_ids_list = new_player_ids
        total_discovered_players = len(player_ids_list)
        
        max_players_to_collect = min(total_discovered_players, 1400)
        player_ids_list = player_ids_list[:1400]

        max_matches_to_query = 0
        
        # Effacer le dataset existant pour le recréer
        if os.path.exists(DATASET_FILE):
            os.remove(DATASET_FILE)
        # 3. Récupérer l'historique et calculer les features de churn
        completed_players = 0
        sem_players = asyncio.Semaphore(15)
        
        async def process_player(player_id):
            nonlocal completed_players
            async with sem_players:
                try:
                    # Profil joueur (rang)
                    info = await client.get_player_info(player_id)
                    rank_tier = info.get("rank_tier")
                    if not rank_tier:
                        return None
                        
                    # Historique (jusqu'à 100 derniers matchs)
                    raw_matches = await client.get_player_matches(player_id, limit=100)
                    if not raw_matches:
                        return None
                        
                    # Exclure le mode Turbo
                    matches = [m for m in raw_matches if m.get("game_mode") != 23]
                    
                    # Il nous faut au moins 25 matchs standard pour avoir un cutoff propre et de bonnes stats historiques
                    if len(matches) < 25:
                        return None
                        
                    # Trier du plus récent au plus ancien (index 0 = match le plus récent)
                    matches = sorted(matches, key=lambda x: x.get("start_time", 0), reverse=True)
                    
                    # Fixer le cutoff à l'index 15 (les 15 matchs les plus récents servent de cible futur)
                    # La fenêtre d'observation est matches[15:] (les plus anciens)
                    target_matches = matches[:15]
                    obs_matches = matches[15:]
                    
                    # --- Cible de Churn (Label is_churn) ---
                    # On évalue si le joueur a fait une pause de plus de 14 jours entre son dernier match d'observation
                    # et son match suivant (le premier de la fenêtre cible)
                    last_obs_time = obs_matches[0].get("start_time", 0)
                    first_target_time = target_matches[-1].get("start_time", 0) # Le plus ancien des récents
                    
                    time_gap_seconds = first_target_time - last_obs_time
                    # Churn = plus de 14 jours sans jouer (14 * 86400 secondes)
                    is_churn = 1 if time_gap_seconds > 14 * 86400 else 0
                    
                    # --- Features calculées sur la fenêtre d'observation obs_matches ---
                    win_count = 0
                    kills = []
                    deaths = []
                    assists = []
                    gpm = []
                    xpm = []
                    last_hits = []
                    hero_damage = []
                    tower_damage = []
                    hero_healing = []
                    durations = []
                    unique_heroes = set()
                    
                    # Lignes géographiques (1: Top, 2: Mid, 3: Bot, 4+5: Autre)
                    lanes = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
                    # Rôles (1: Core, 2: Support, 3: Roamer, 4: Jungler)
                    lane_roles = {1: 0, 2: 0, 3: 0, 4: 0}
                    
                    # Déséquilibre de lobby MMR
                    rank_imbalances = []
                    
                    for m in obs_matches:
                        p_slot = m.get("player_slot", 0)
                        r_win = m.get("radiant_win", False)
                        is_rad = p_slot < 128
                        is_win = (is_rad and r_win) or (not is_rad and not r_win)
                        
                        if is_win:
                            win_count += 1
                            
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
                        if lane in lanes:
                            lanes[lane] += 1
                        lane_role = m.get("lane_role")
                        if lane_role in lane_roles:
                            lane_roles[lane_role] += 1
                            
                        # Calculer l'écart avec la moyenne du lobby (si rank moyen dispo)
                        avg_rank = m.get("average_rank")
                        if avg_rank:
                            rank_imbalances.append(abs(rank_tier - avg_rank))

                    num_games = len(obs_matches)
                    
                    # Analyse des sessions sur la fenêtre d'observation
                    session_stats = calculate_sessions(obs_matches)
                    
                    # Série de victoires/défaites en cours juste avant le cutoff (au matches[15])
                    streak_at_cutoff = get_streak_at_cutoff(obs_matches)
                    
                    # Déséquilibre de rang moyen du lobby
                    avg_rank_imbalance = sum(rank_imbalances) / len(rank_imbalances) if rank_imbalances else 0.0
                    
                    # --- NOUVELLES FEATURES ---
                    # 1. Abandons, Groupes, Matchs classés
                    abandons = sum(1 for m in obs_matches if m.get("leaver_status", 0) > 0)
                    abandon_rate = abandons / num_games
                    
                    party_games = sum(1 for m in obs_matches if m.get("party_size") is not None and m.get("party_size") > 1)
                    party_play_pct = party_games / num_games
                    
                    ranked_games = sum(1 for m in obs_matches if m.get("lobby_type") == 7)
                    ranked_play_pct = ranked_games / num_games
                    
                    # 2. Séparation Récent vs Ancien (Trend)
                    split_idx = min(10, max(3, num_games // 2))
                    recent_subset = obs_matches[:split_idx]
                    older_subset = obs_matches[split_idx:]
                    
                    # Win rate trend
                    recent_wins = sum(1 for m in recent_subset if ((m.get("player_slot", 0) < 128) == m.get("radiant_win", False)))
                    win_rate_recent = recent_wins / split_idx
                    older_wins = sum(1 for m in older_subset if ((m.get("player_slot", 0) < 128) == m.get("radiant_win", False)))
                    win_rate_older = older_wins / len(older_subset) if older_subset else win_rate_recent
                    win_rate_trend = win_rate_recent - win_rate_older
                    
                    # KDA trend
                    def get_kda_sub(subset):
                        if not subset: return 3.0
                        k = sum(m.get("kills", 0) for m in subset)
                        d = sum(m.get("deaths", 0) for m in subset)
                        a = sum(m.get("assists", 0) for m in subset)
                        return (k + a) / max(1, d)
                    kda_recent = get_kda_sub(recent_subset)
                    kda_older = get_kda_sub(older_subset)
                    kda_trend = kda_recent - kda_older
                    
                    # GPM/XPM/Kills/Deaths/Assists trends
                    def get_avg_metric(subset, metric):
                        if not subset: return 0.0
                        return sum(m.get(metric, 0) for m in subset) / len(subset)
                    gpm_recent = get_avg_metric(recent_subset, "gold_per_min")
                    gpm_older = get_avg_metric(older_subset, "gold_per_min")
                    gpm_trend = gpm_recent - gpm_older
                    
                    xpm_recent = get_avg_metric(recent_subset, "xp_per_min")
                    xpm_older = get_avg_metric(older_subset, "xp_per_min")
                    xpm_trend = xpm_recent - xpm_older
                    
                    deaths_recent = get_avg_metric(recent_subset, "deaths")
                    deaths_older = get_avg_metric(older_subset, "deaths")
                    deaths_trend = deaths_recent - deaths_older
                    
                    kills_recent = get_avg_metric(recent_subset, "kills")
                    kills_older = get_avg_metric(older_subset, "kills")
                    kills_trend = kills_recent - kills_older
                    
                    assists_recent = get_avg_metric(recent_subset, "assists")
                    assists_older = get_avg_metric(older_subset, "assists")
                    assists_trend = assists_recent - assists_older
                    
                    # --- NOUVELLES FEATURES (TILT / RAGE QUIT) ---
                    recent_abandons = sum(1 for m in recent_subset if m.get("leaver_status", 0) > 0)
                    
                    recent_durations = [m.get("duration", 0) for m in recent_subset]
                    recent_avg_duration = (sum(recent_durations) / len(recent_durations) / 60.0) if recent_durations else 35.0
                    
                    recent_deaths = sum(m.get("deaths", 0) for m in recent_subset)
                    recent_total_duration_min = sum(recent_durations) / 60.0
                    recent_deaths_per_min = recent_deaths / recent_total_duration_min if recent_total_duration_min > 0 else 0.0
                    
                    # Tilt Index: 
                    # Augmente si leaver_status > 0, si streak < -3, si duration est courte, si deaths_per_min élevé
                    tilt_score = 0.0
                    tilt_score += recent_abandons * 2.0
                    if streak_at_cutoff <= -3:
                        tilt_score += abs(streak_at_cutoff) - 2.0
                    if recent_avg_duration < 25.0:
                        tilt_score += (25.0 - recent_avg_duration) * 0.1
                    if recent_deaths_per_min > 0.3:
                        tilt_score += (recent_deaths_per_min - 0.3) * 5.0
                    tilt_index = tilt_score
                    
                    # Profils Psychologiques
                    avg_hero_damage_val = sum(hero_damage) / max(1, num_games)
                    avg_tower_damage_val = sum(tower_damage) / max(1, num_games)
                    objective_focus = avg_tower_damage_val / (avg_hero_damage_val + 1)
                    
                    night_games = 0
                    from datetime import datetime
                    for m in obs_matches:
                        try:
                            dt = datetime.fromtimestamp(m.get("start_time", 0))
                            if 0 <= dt.hour < 6:
                                night_games += 1
                        except:
                            pass
                    night_owl_pct = night_games / max(1, num_games)
                    
                    dominant_role_pct = max(lane_roles.values()) / max(1, num_games) if lane_roles else 0
                    role_consistency = dominant_role_pct
                                        
                    player_features = {
                        "account_id": player_id,
                        "personaname": info.get("profile", {}).get("personaname", f"Joueur {player_id}"),
                        "rank_tier": rank_tier,
                        "games_analyzed": num_games,
                        
                        # Target label
                        "is_churn": is_churn,
                        "time_gap_days": time_gap_seconds / 86400.0,
                        
                        # Churn Features
                        "current_streak_at_cutoff": streak_at_cutoff,
                        "avg_session_games": session_stats["avg_session_games"],
                        "avg_session_duration": session_stats["avg_session_duration"],
                        "avg_session_gap_days": session_stats["avg_session_gap_days"],
                        "avg_rank_imbalance": avg_rank_imbalance,
                        
                        # Nouvelles Churn Features
                        "abandon_rate": abandon_rate,
                        "party_play_pct": party_play_pct,
                        "ranked_play_pct": ranked_play_pct,
                        
                        # Trends
                        "win_rate_trend": win_rate_trend,
                        "kda_trend": kda_trend,
                        "gpm_trend": gpm_trend,
                        "xpm_trend": xpm_trend,
                        "deaths_trend": deaths_trend,
                        "kills_trend": kills_trend,
                        "assists_trend": assists_trend,
                        
                        # Tilt & Rage-Quit Features
                        "recent_abandons": recent_abandons,
                        "recent_avg_duration": recent_avg_duration,
                        "recent_deaths_per_min": recent_deaths_per_min,
                        "tilt_index": tilt_index,
                        
                        # Profils psychologiques
                        "objective_focus": objective_focus,
                        "night_owl_pct": night_owl_pct,
                        "role_consistency": role_consistency,
                        
                        # Performance Features
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
                        
                        # Lignes & Rôles
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
                    return None
                finally:
                    completed_players += 1
                    if completed_players % 50 == 0 or completed_players == 1:
                        update_status(
                            "in_progress",
                            max_matches_to_query,
                            max_matches_to_query,
                            completed_players,
                            max_players_to_collect,
                            f"Récupération des profils en cours ({completed_players}/{max_players_to_collect})..."
                        )

        player_tasks = [process_player(pid) for pid in player_ids_list[:max_players_to_collect]]
        player_results = await asyncio.gather(*player_tasks)
        players_data = [p for p in player_results if p is not None]
                
        # Sauvegarder dans le CSV (mode append avec dédoublonnage)
        if len(players_data) > 0:
            new_df = pd.DataFrame(players_data)
            if os.path.exists(DATASET_FILE):
                try:
                    existing_df = pd.read_csv(DATASET_FILE)
                    combined_df = pd.concat([existing_df, new_df], ignore_index=True)
                    # Dédoublonner sur account_id en gardant la version la plus récente
                    combined_df = combined_df.drop_duplicates(subset=["account_id"], keep="last")
                    
                    # Remplir les valeurs par défaut si des colonnes manquent pour les anciens
                    default_fills = {
                        "abandon_rate": 0.01,
                        "party_play_pct": 0.25,
                        "ranked_play_pct": 0.60,
                        "win_rate_trend": 0.0,
                        "kda_trend": 0.0,
                        "gpm_trend": 0.0,
                        "xpm_trend": 0.0,
                        "deaths_trend": 0.0,
                        "kills_trend": 0.0,
                        "assists_trend": 0.0,
                        "recent_abandons": 0,
                        "recent_avg_duration": 35.0,
                        "recent_deaths_per_min": 0.2,
                        "tilt_index": 0.0,
                        "objective_focus": 0.0,
                        "night_owl_pct": 0.0,
                        "role_consistency": 0.25
                    }
                    for col, val in default_fills.items():
                        if col in combined_df.columns:
                            combined_df[col] = combined_df[col].fillna(val)
                            
                    combined_df.to_csv(DATASET_FILE, index=False)
                    print(f"Dataset mis à jour : {len(combined_df)} joueurs au total (+{len(players_data)} nouveaux).")
                except Exception as e:
                    print(f"Erreur d'append : {e}. Sauvegarde brute du nouveau lot.")
                    new_df.to_csv(DATASET_FILE, index=False)
            else:
                new_df.to_csv(DATASET_FILE, index=False)
        else:
            print("Aucun nouveau joueur collecté lors de ce run.")
        
        # On ne lance plus le ML automatiquement tant qu'on n'a pas 10 000 lignes
        msg = f"Collecte terminée avec succès ! {len(players_data)} profils de joueurs ajoutés (ML en attente des 10k)."
        update_status("completed", max_matches_to_query, max_matches_to_query, len(players_data), max_players_to_collect, msg)
        print(msg)
        
    except Exception as e:
        msg = f"Une erreur critique est survenue: {e}"
        update_status("failed", 0, 0, 0, 0, msg)
        print(msg)
    finally:
        await client.close()

if __name__ == "__main__":
    asyncio.run(collect_data())
