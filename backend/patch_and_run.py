import re
import os

with open("rescue_collect.py", "r") as f:
    content = f.read()

# Replace the fetching matches logic with reading existing players
replacement = """
        existing_df = pd.read_csv(DATASET_FILE)
        new_player_ids = existing_df["account_id"].dropna().astype(int).tolist()
        
        # Effacer le dataset existant pour le recréer proprement
        if os.path.exists(DATASET_FILE):
            os.remove(DATASET_FILE)
            
        max_matches_to_query = 0
        total_discovered_players = len(new_player_ids)
        max_players_to_collect = len(new_player_ids)
"""

# We find the start of ETAPE 1 (around line 170) and end of ETAPE 1 (around line 247)
# But it's easier to use a regex to replace everything between "try:" and "update_status(\n            "in_progress",\n            max_matches_to_query"
start_str = 'try:'
end_str = '        update_status(\n            "in_progress",\n            max_matches_to_query,'

start_idx = content.find(start_str)
end_idx = content.find(end_str)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx + len(start_str)] + replacement + content[end_idx:]
    with open("rescue_collect.py", "w") as f:
        f.write(new_content)
    print("Fichier rescue_collect.py patché avec succès.")
else:
    print("Erreur : impossible de trouver les balises pour patcher le fichier.")
