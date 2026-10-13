import pandas as pd
import asyncio
from opendota_client import OpenDotaClient
from collect_data import extract_player_features

async def main():
    print("Démarrage du script de sauvetage...")
    # Lire les IDs
    df = pd.read_csv("data/dota2_players_dataset.csv")
    account_ids = df["account_id"].tolist()
    
    print(f"{len(account_ids)} joueurs à réparer.")
    
    client = OpenDotaClient(free_tier=True)
    new_rows = []
    
    for i, acc_id in enumerate(account_ids):
        features = await extract_player_features(client, acc_id)
        if features:
            new_rows.append(features)
        
        if (i + 1) % 50 == 0:
            print(f"Progression : {i + 1} / {len(account_ids)}")
            # Sauvegarde intermédiaire
            pd.DataFrame(new_rows).to_csv("data/dota2_players_dataset.csv", index=False)
            
    # Sauvegarde finale
    pd.DataFrame(new_rows).to_csv("data/dota2_players_dataset.csv", index=False)
    print("Sauvetage terminé avec succès !")
    await client.close()

if __name__ == "__main__":
    asyncio.run(main())
