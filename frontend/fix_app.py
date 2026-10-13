with open("src/App.jsx", "r") as f:
    content = f.read()

# Update chart 1 text
content = content.replace('Taux de Churn vs Déséquilibre (Match T)', 'Taux de Churn vs Efficacité (XPM)')
content = content.replace("Pourcentage d'abandon selon la différence de niveau dans la TOUTE DERNIÈRE partie jouée.", "Pourcentage d'abandon selon l'expérience par minute moyenne (XPM) sur l'historique récent.")

# Update n = X to X joueurs
content = content.replace('n = {item.player_count}', '{item.player_count} joueurs')
content = content.replace('n={item.player_count}', '{item.player_count} joueurs')

with open("src/App.jsx", "w") as f:
    f.write(content)

print("Done")
