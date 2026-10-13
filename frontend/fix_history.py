import re
with open("src/App.jsx", "r") as f:
    content = f.read()

target = """<h5 style={{ color: 'var(--accent-emerald)', fontSize: '0.95rem', marginBottom: '12px', fontWeight: 600 }}>4. La V4.0 (Actuelle) : L'Anticipation et le Passage au Premium</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                      Jusqu'ici, notre IA analysait le passé. Nous avons fait un <strong>pivot total</strong> pour l'orienter vers le futur. <br/><br/>
                      Au lieu de regarder si un joueur a arrêté après sa session, l'algorithme isole désormais un <strong>Match T</strong> précis. Il croise l'historique du joueur (le Passé) avec les conditions exactes du Match T (Déséquilibre MMR, Heure, Solo/Party) pour tester une hypothèse : <strong>"Si le joueur joue cette partie et la perd, va-t-il rage-quit Dota 2 définitivement ?"</strong>. <br/><br/>
                      <strong>🚀 Échelle Supérieure :</strong> Pour entraîner ce modèle ambitieux, la limite gratuite de 600 joueurs par jour nous bloquait. <strong>Nous venons de faire évoluer l'architecture pour exploiter le Plan Premium OpenDota</strong>, nous permettant de télécharger nos 20 000 joueurs cibles en une seule collecte massive. Le robot tourne actuellement à pleine puissance.
                    </p>"""

replacement = """<h5 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '12px', fontWeight: 600 }}>4. La V4.0 : L'Anticipation, le Premium, et le Data Leakage</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                      L'algorithme isole désormais un <strong>Match T</strong> (une partie précise). Mais en laissant une fenêtre d'historique libre pour chaque joueur, nous avons créé un biais massif de Data Leakage où le modèle trichait en divisant par un nombre de matchs variable (les joueurs occasionnels apparaissaient artificiellement toxiques).
                    </p>
                    
                    <h5 style={{ color: 'white', fontSize: '0.95rem', marginBottom: '12px', fontWeight: 600 }}>5. La V5.0 : Le Biais de Tautologie</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                      Le biais mathématique a été corrigé en fixant l'historique strictement à 20 matchs pour tous. Mais nous avons découvert une faille plus subtile : le <strong>Label Tautology</strong>. En donnant au modèle les jours de pause d'un joueur, il se contentait de déduire que les joueurs occasionnels "churn" parce que notre définition de churn est justement un arrêt de plus de 14 jours.
                    </p>

                    <h5 style={{ color: 'var(--accent-emerald)', fontSize: '0.95rem', marginBottom: '12px', fontWeight: 600 }}>6. La V6.0 (Actuelle) : Le Modèle AAA Comportemental</h5>
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)', lineHeight: '1.6', marginBottom: '16px' }}>
                      Toutes les métriques de rythme et de temps de jeu ont été supprimées. L'algorithme a le dos au mur et DOIT analyser le comportement in-game pour faire ses prédictions. Il base maintenant son jugement sur l'<strong>Efficacité (XPM)</strong>, la <strong>durée des sessions</strong>, et le <strong>jeu en groupe</strong>. Les scores (PR-AUC 79.3%) reflètent désormais la stricte réalité. Nous sommes prêts pour la production.
                    </p>"""

content = content.replace(target, replacement)

with open("src/App.jsx", "w") as f:
    f.write(content)

print("Done")
