import os

with open("run_rescue.py", "r") as f:
    content = f.read()

# Replace the max_players_to_collect assignment
content = content.replace("max_players_to_collect = total_discovered_players", 
"""
        max_players_to_collect = min(total_discovered_players, 1400)
        player_ids_list = player_ids_list[:1400]
""")

with open("run_rescue.py", "w") as f:
    f.write(content)

print("Limited rescue to 1400 players.")
