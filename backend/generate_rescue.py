import os

with open("collect_data.py", "r") as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if "# 1. Paginer pour récupérer" in line:
        skip = True
        new_lines.append("""
        import pandas as pd
        existing_df = pd.read_csv(DATASET_FILE)
        new_player_ids = existing_df["account_id"].dropna().astype(int).tolist()
        player_ids_list = new_player_ids
        total_discovered_players = len(player_ids_list)
        max_players_to_collect = total_discovered_players
        max_matches_to_query = 0
        
        # Effacer le dataset existant pour le recréer
        if os.path.exists(DATASET_FILE):
            os.remove(DATASET_FILE)
""")
    if "# 3. Récupérer l'historique et calculer les features de churn" in line:
        skip = False
    
    if not skip:
        # Also remove the max_players_to_collect limitation just in case
        if "max_players_to_collect = min(" in line:
            pass # We already set it
        else:
            new_lines.append(line)

with open("run_rescue.py", "w") as f:
    f.writelines(new_lines)
    
print("run_rescue.py généré avec succès!")
