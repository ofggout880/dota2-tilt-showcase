/**
 * Comprehensive Bilingual Glossary of Gaming, Psychology & Machine Learning Terms
 * Used for the Dictionary drawer, search, filters, and contextual tooltips/links.
 */

export const DICTIONARY_CATEGORIES = [
  { id: 'all', labelFr: 'Tous', labelEn: 'All' },
  { id: 'gaming', labelFr: 'Gaming & Dota 2', labelEn: 'Gaming & Dota 2' },
  { id: 'psychology', labelFr: 'Psychologie & Tilt', labelEn: 'Psychology & Tilt' },
  { id: 'ml', labelFr: 'Machine Learning & Données', labelEn: 'Machine Learning & Data' }
];

export const DICTIONARY_TERMS = [
  {
    id: 'dota2',
    aliases: ['dota', 'dota 2', 'moba', 'defense of the ancients', 'jeu', 'valve'],
    category: 'gaming',
    badgeClass: 'badge-gaming',
    termFr: "Dota 2 (Le Jeu)",
    termEn: "Dota 2 (The Game)",
    shortDefFr: "Arène de bataille en ligne multijoueur (MOBA 5 contre 5) de Valve Corporation. Deux équipes de 5 héros s'affrontent pour détruire la base ennemie (l'Ancien). Réputé pour sa complexité tactique extrême et son intensité émotionnelle.",
    shortDefEn: "Multiplayer Online Battle Arena (5v5 MOBA) developed by Valve. Two teams clash on a closed map to destroy the enemy Ancient. Renowned for supreme tactical depth and high emotional pressure.",
    takeawayFr: "Parties longues (30-60 min) et dépendance totale envers ses coéquipiers : le terreau idéal pour l'apparition du tilt et du décrochage.",
    takeawayEn: "30-60 min matches and total team reliance create an exceptionally fertile ground for tilt and churn."
  },
  {
    id: 'tilt_index',
    aliases: ['tilt', 'indice de tilt', 'tilt index', 'ragequit', 'frustration'],
    category: 'psychology',
    badgeClass: 'badge-psychology',
    termFr: "Indice de Tilt",
    termEn: "Tilt Index",
    shortDefFr: "Mesure de l'énervement et de la frustration du joueur, calculée à partir des abandons prématurés (ragequits), des séries de défaites et des chutes brutales de performance.",
    shortDefEn: "Composite score estimating emotional distress and frustration based on early abandons (ragequits), loss streaks, and sharp drops in performance.",
    takeawayFr: "3e facteur prédictif le plus puissant du churn dans le modèle champion XGBoost V6.",
    takeawayEn: "3rd most predictive feature of player churn in our champion XGBoost V6 model."
  },
  {
    id: 'loss_streak',
    aliases: ['serie de defaites', 'série au point t', 'loss streak', 'streak de defaites'],
    category: 'psychology',
    badgeClass: 'badge-psychology',
    termFr: "Série au point T (Série de défaites)",
    termEn: "Loss Streak (at Cutoff T)",
    shortDefFr: "Nombre de défaites d'affilée subies juste avant le point d'observation. Plus la série est longue, plus la probabilité de désinstallation immédiate explose.",
    shortDefEn: "Number of consecutive losses suffered right before the observation cutoff. Longer loss streaks exponentially drive immediate churn.",
    takeawayFr: "Une série de 3 défaites consécutives multiplie le risque d'abandon par 2,4.",
    takeawayEn: "A streak of 3 consecutive defeats multiplies churn risk by 2.4x."
  },
  {
    id: 'avg_xpm',
    aliases: ['xpm', 'xp moyen', 'experience per minute', 'avg_xpm'],
    category: 'gaming',
    badgeClass: 'badge-gaming',
    termFr: "XP Moyen (XPM)",
    termEn: "Average XPM",
    shortDefFr: "Points d'expérience récoltés par minute de jeu. Indique la vitesse à laquelle le héros progresse en niveau et débloque ses talents.",
    shortDefEn: "Experience points earned per minute. Reflects the speed at which a player's hero levels up and unlocks talents.",
    takeawayFr: "Un XPM inférieur à 400 traduit une domination adverse et une perte de contrôle frustrante.",
    takeawayEn: "XPM below 400 signals enemy map domination and agonizing loss of game agency."
  },
  {
    id: 'avg_gpm',
    aliases: ['gpm', 'gold per minute', 'or par minute', 'avg_gpm'],
    category: 'gaming',
    badgeClass: 'badge-gaming',
    termFr: "GPM (Gold Per Minute)",
    termEn: "GPM (Gold Per Minute)",
    shortDefFr: "Pièces d'or amassées par minute de jeu. C'est l'indicateur universel de santé économique et d'efficacité de farming d'un joueur.",
    shortDefEn: "Gold earned per minute of play. The universal metric for a player's economic health and farming efficiency.",
    takeawayFr: "Une chute brutale du GPM moyen sur les 10 dernières parties signale souvent un désengagement tactique.",
    takeawayEn: "A sharp decline in average GPM across the last 10 games often flags behavioral disengagement."
  },
  {
    id: 'rank_tier',
    aliases: ['niveau du rang', 'rank tier', 'mmr', 'rang dota', 'herald', 'archon', 'immortal'],
    category: 'gaming',
    badgeClass: 'badge-gaming',
    termFr: "Niveau du rang (MMR / Rank Tier)",
    termEn: "Rank Tier (MMR)",
    shortDefFr: "Échelon dans le classement compétitif officiel de Dota 2 (de Herald 1 à Immortal). Reflète le niveau de maîtrise du joueur.",
    shortDefEn: "Skill bracket tier in the official Dota 2 competitive ladder (from Herald 1 to Immortal). Refers to competitive mastery.",
    takeawayFr: "Les joueurs de rang élevé (Ancient / Divine) tolèrent moins les stomps et réagissent plus vivement aux défaites.",
    takeawayEn: "Higher-ranked players (Ancient / Divine) show lower tolerance for stomps and higher churn sensitivity."
  },
  {
    id: 'kda',
    aliases: ['kda', 'ratio kda', 'kills deaths assists', 'ratio combat'],
    category: 'gaming',
    badgeClass: 'badge-gaming',
    termFr: "Ratio KDA (Kills / Deaths / Assists)",
    termEn: "KDA Ratio",
    shortDefFr: "Ratio de combat calculé par la formule (Éliminations + Assistances) divisé par le nombre de Morts.",
    shortDefEn: "Combat performance ratio calculated as (Kills + Assists) divided by Deaths.",
    takeawayFr: "Un ratio KDA < 1.5 sur plusieurs parties consécutives est un marqueur précoce de découragement.",
    takeawayEn: "Sustained KDA below 1.5 is an early psychological indicator of combat helplessness."
  },
  {
    id: 'cutoff_point',
    aliases: ['point t', 'coupure', 'cutoff', 'point d observation', 'point d observation t'],
    category: 'ml',
    badgeClass: 'badge-ml',
    termFr: "Point T (Coupure d'observation)",
    termEn: "Point T (Observation Cutoff)",
    shortDefFr: "Date ou instant exact où s'arrête l'analyse de l'historique pour prédire les 14 jours suivants sans regarder le futur.",
    shortDefEn: "The exact chronological timestamp where feature observation stops to predict the player's next 14 days without looking ahead.",
    takeawayFr: "Garantie mathématique absolue contre les fuites temporelles de données (data leakage).",
    takeawayEn: "Absolute mathematical guarantee against temporal data contamination."
  },
  {
    id: 'churn',
    aliases: ['churn', 'inactivite 14 jours', 'abandon', 'attrition'],
    category: 'ml',
    badgeClass: 'badge-ml',
    termFr: "Churn (Inactivité 14 jours)",
    termEn: "Churn (14-Day Inactivity)",
    shortDefFr: "Abandon du jeu, défini dans notre étude par 14 jours consécutifs sans disputer la moindre partie sur les serveurs de Valve.",
    shortDefEn: "Complete player drop-off, defined in our study as 14 consecutive calendar days with zero matches logged on Valve servers.",
    takeawayFr: "Variable cible binaire (y = 1 si churn, 0 si rétention) au cœur de tous nos modèles de ML.",
    takeawayEn: "Binary target variable (y = 1 if churned, 0 if retained) at the core of all our ML models."
  },
  {
    id: 'night_owl',
    aliases: ['session nocturne', 'fatigue nocturne', 'night owl', 'circadien', 'fatigue circadienne'],
    category: 'psychology',
    badgeClass: 'badge-psychology',
    termFr: "Session Nocturne (Fatigue circadienne)",
    termEn: "Night Owl Sessions (Circadian Fatigue)",
    shortDefFr: "Proportion de parties disputées tard la nuit (entre 00h00 et 06h00). Jouer la nuit altère les réflexes et décuple le tilt.",
    shortDefEn: "Share of games played late at night (midnight to 6:00 AM). Nocturnal play impairs reflexes and sharply increases tilt vulnerability.",
    takeawayFr: "Les profils avec > 40% de sessions de nuit présentent un taux d'abandon 1,8 fois supérieur à la moyenne.",
    takeawayEn: "Night-heavy profiles (>40% nocturnal games) experience a 1.8x higher churn rate than average."
  },
  {
    id: 'party_size',
    aliases: ['bouclier de groupe', 'party size', 'escouade', 'amis', 'social shield'],
    category: 'gaming',
    badgeClass: 'badge-gaming',
    termFr: "Bouclier de Groupe (Jeu en escouade)",
    termEn: "Party Size (Social Shield)",
    shortDefFr: "Fait de jouer en groupe d'amis (de 2 à 5 joueurs) plutôt que seul en solo queue.",
    shortDefEn: "Queuing with premade friends (stacks of 2 to 5 players) rather than queuing alone.",
    takeawayFr: "Le plus puissant facteur protecteur : le lien social atténue l'impact émotionnel négatif des défaites.",
    takeawayEn: "The single most protective retention factor: social bonds soften the emotional sting of defeat."
  },
  {
    id: 'threshold',
    aliases: ['seuil theta', 'seuil de decision', 'threshold', 'seuil optimal', 'theta'],
    category: 'ml',
    badgeClass: 'badge-ml',
    termFr: "Seuil de décision optimal (θ* = 0.36)",
    termEn: "Optimal Decision Threshold (θ* = 0.36)",
    shortDefFr: "Seuil de probabilité calibré à 0.36 (plutôt que 0.50) pour maximiser le rappel et intercepter 85% des joueurs en phase d'abandon.",
    shortDefEn: "Probability cutoff tuned to 0.36 (instead of 0.50) to catch 85% of churning players before they leave.",
    takeawayFr: "Permet d'atteindre 85,0% de rappel tout en maintenant une excellente précision globale.",
    takeawayEn: "Unlocks 85.0% recall while preserving robust overall precision."
  },
  {
    id: 'buyback',
    aliases: ['buyback', 'rachat', 'rachat immediat'],
    category: 'gaming',
    badgeClass: 'badge-gaming',
    termFr: "Buyback (Rachat immédiat)",
    termEn: "Buyback",
    shortDefFr: "Mécanique permettant de dépenser une grande quantité d'or pour ressusciter instantanément au lieu d'attendre sa réapparition.",
    shortDefEn: "Dota 2 mechanic allowing players to spend gold to instantly respawn instead of waiting out the death timer.",
    takeawayFr: "Un buyback impulsif déclenché sous la colère (tilt buyback) suivi d'une nouvelle mort est un signe avant-coureur de ragequit.",
    takeawayEn: "An impulsive tilt buyback followed by immediate re-death is the classic precursor to a ragequit."
  },
  {
    id: 'stomp',
    aliases: ['stomp', 'defaite eclair', 'ecrasante', 'stomp < 25 min'],
    category: 'gaming',
    badgeClass: 'badge-gaming',
    termFr: "Stomp (Défaite écrasante < 25 min)",
    termEn: "Stomp (Crushing Defeat < 25 min)",
    shortDefFr: "Partie totalement à sens unique perdue en moins de 25 minutes sans aucune chance de retour.",
    shortDefEn: "Severely one-sided match lost in under 25 minutes where the losing team had zero comeback agency.",
    takeawayFr: "Deux stomps consécutifs suffisent à induire un état de fatigue psychologique aiguë chez 68% des joueurs.",
    takeawayEn: "Two consecutive stomps are enough to induce acute cognitive disengagement in 68% of players."
  },
  {
    id: 'smote',
    aliases: ['smote', 'sur-echantillonnage', 'synthetic oversampling', 'reequilibrage'],
    category: 'ml',
    badgeClass: 'badge-ml',
    termFr: "SMOTE (Sur-échantillonnage synthétique)",
    termEn: "SMOTE (Synthetic Oversampling)",
    shortDefFr: "Algorithme générant des profils synthétiques réalistes de churners pour équilibrer le jeu d'entraînement sans dupliquer de lignes.",
    shortDefEn: "Technique creating synthetic training examples of churning players to balance rare classes without naive duplication.",
    takeawayFr: "Corrige le déséquilibre naturel sans créer de surapprentissage par copie brute.",
    takeawayEn: "Counters natural class imbalance without simplistic row duplication."
  },
  {
    id: 'treeshap',
    aliases: ['treeshap', 'shap', 'shapley', 'explicabilite', 'attribution des facteurs'],
    category: 'ml',
    badgeClass: 'badge-ml',
    termFr: "TreeSHAP (Explicabilité locale)",
    termEn: "TreeSHAP (Local Explainability)",
    shortDefFr: "Méthode issue de la théorie des jeux expliquant exactement comment chaque variable a pesé dans la prédiction pour un joueur donné.",
    shortDefEn: "Algorithm rooted in cooperative game theory explaining exactly how each behavioral feature swayed a player's risk score.",
    takeawayFr: "Pilote les barres d'attribution (vertes et rouges) dans notre simulateur interactif.",
    takeawayEn: "Powers the dynamic factor attribution bars (red vs green) in our interactive simulator."
  },
  {
    id: 'rolling_window',
    aliases: ['fenetre glissante', '100 matchs', 'rolling window', 'historique recent'],
    category: 'ml',
    badgeClass: 'badge-ml',
    termFr: "Fenêtre glissante (100 matchs)",
    termEn: "Rolling Window (100 matches)",
    shortDefFr: "Période d'observation calée sur les 100 dernières parties d'un joueur pour lisser le bruit ponctuel et isoler les vraies tendances.",
    shortDefEn: "Analytical window capturing each player's 100 most recent matches to isolate contemporary habits from outdated historical noise.",
    takeawayFr: "Offre le compromis idéal entre stabilité mathématique et détection rapide des signaux de crise.",
    takeawayEn: "Strikes the ideal statistical balance between estimator stability and responsiveness to recent crisis signals."
  },
  {
    id: 'last_hits',
    aliases: ['last hits', 'denies', 'creeps', 'cs', 'coup fatal'],
    category: 'gaming',
    badgeClass: 'badge-gaming',
    termFr: "Last Hits & Denies",
    termEn: "Last Hits & Denies",
    shortDefFr: "Donner le coup fatal à un monstre adverse pour l'or (Last Hit) ou à un monstre allié pour priver l'ennemi d'or et d'XP (Deny).",
    shortDefEn: "Landing the killing blow on an enemy creep for gold (Last Hit) or an allied creep to deny enemies XP and gold (Deny).",
    takeawayFr: "Une chute anormale des Last Hits en cours de partie trahit une baisse de concentration ou une résignation mentale.",
    takeawayEn: "A sharp drop in Last Hits signals waning focus or mid-game psychological resignation."
  },
  {
    id: 'net_worth',
    aliases: ['net worth', 'richesse', 'or accumule', 'valeur nette'],
    category: 'gaming',
    badgeClass: 'badge-gaming',
    termFr: "Net Worth (Valeur nette)",
    termEn: "Net Worth",
    shortDefFr: "Richesse totale accumulée par un joueur : or disponible en poche plus valeur marchande de tous ses objets d'inventaire.",
    shortDefEn: "Total wealth accumulated by a player, combining current unspent gold and the full shop value of all owned inventory items.",
    takeawayFr: "L'écart de Net Worth entre les deux équipes prédit l'issue de la partie avec 88% de fiabilité dès 20 minutes.",
    takeawayEn: "Team net worth disparity predicts game outcome with 88% accuracy as early as the 20-minute mark."
  },
  {
    id: 'data_leakage',
    aliases: ['fuite temporelle', 'data leakage', 'fuite de donnees', 'fuite'],
    category: 'ml',
    badgeClass: 'badge-ml',
    termFr: "Fuite temporelle (Data Leakage)",
    termEn: "Temporal Data Leakage",
    shortDefFr: "Erreur méthodologique où des données du futur sont accidentellement injectées dans l'entraînement, faussant artificiellement les résultats.",
    shortDefEn: "Critical modeling flaw where future information unintentionally contaminates training features, creating illusions of high accuracy.",
    takeawayFr: "Notre pipeline est certifié à 0 fuite temporelle grâce au strict cloisonnement au point de coupure T.",
    takeawayEn: "Our pipeline is audited at zero temporal leakage via strict cutoffs at observation point T."
  },
  {
    id: 'pr_auc',
    aliases: ['pr-auc', 'precision rappel', 'precision-recall', 'auc-pr'],
    category: 'ml',
    badgeClass: 'badge-ml',
    termFr: "PR-AUC (Précision-Rappel)",
    termEn: "PR-AUC (Precision-Recall AUC)",
    shortDefFr: "Métrique clé en déséquilibre de classe qui mesure la pertinence et la précision des alertes de churn sans faux positifs excessifs.",
    shortDefEn: "Area under the Precision-Recall curve evaluating how reliably the model detects rare positive cases without false alarm spam.",
    takeawayFr: "XGBoost V6 atteint 79,3% de PR-AUC, surpassant la régression logistique de plus de 15 points.",
    takeawayEn: "XGBoost V6 scores 79.3% PR-AUC, outperforming baseline logistic regression by more than 15 percentage points."
  },
  {
    id: 'eomm',
    aliases: ['eomm', 'matchmaking predateur', 'truquage', 'matchmaking engageant'],
    category: 'psychology',
    badgeClass: 'badge-psychology',
    termFr: "EOMM (Matchmaking prédateur)",
    termEn: "EOMM (Predatory Matchmaking)",
    shortDefFr: "Système controversé qui manipule artificiellement les victoires et défaites pour créer de la dépendance au détriment de l'équité sportive.",
    shortDefEn: "Controversial matchmaking algorithm that rigs win/loss streaks to maximize compulsive player engagement and addiction.",
    takeawayFr: "Formellement rejeté dans notre étude au nom de la bienveillance éthique et du respect des joueurs.",
    takeawayEn: "Strictly rejected in our research in favor of ethical matchmaking and genuine competitive fairness."
  }
];

/**
 * Find a dictionary term by its ID or alias
 */
export function findDictionaryTerm(termIdOrAlias) {
  if (!termIdOrAlias) return null;
  const normalized = String(termIdOrAlias).trim().toLowerCase();
  return (
    DICTIONARY_TERMS.find(
      (item) =>
        item.id.toLowerCase() === normalized ||
        item.aliases.some((alias) => alias.toLowerCase() === normalized)
    ) || null
  );
}
