/**
 * Bilingual Translation Dictionary & Localization Utilities
 * English (en) and French (fr) with 100% Key Parity
 * Fully sanitized: Zero PII, zero private machine paths
 */

export const translations = {
  fr: {
    // Navigation & Header Shell
    nav: {
      brandTitle: "DOTA 2 CHURN & TILT",
      brandSubtitle: "SHOWCASE ML",
      brandBadge: "V6 XGBOOST",
      links: {
        hero: "Vue d'ensemble",
        kpis: "Indicateurs Clés",
        psychology: "Psychologie",
        benchmark: "Benchmark ML",
        simulator: "Simulateur",
        architecture: "Architecture",
        dictionary: "Dictionnaire"
      },
      status: {
        online: "API En ligne",
        offline: "Démo Interactive",
        checking: "Connexion..."
      },
      langToggle: {
        label: "Langue",
        ariaLabel: "Basculer la langue vers l'Anglais"
      },
      linkedin: {
        label: "Profil LinkedIn (Matthieu Gout)"
      },
      github: {
        label: "Dépôt GitHub"
      },
      menu: {
        open: "Ouvrir le menu",
        close: "Fermer le menu"
      }
    },

    // Hero Section
    hero: {
      badge: "Étude de Machine Learning AAA & Détection Préventive",
      titleMain: "Anticiper l'Abandon & le Tilt des Joueurs de Dota 2",
      titleHighlight: "par Télémétrie Comportementale",
      subtitle: "Modélisation prédictive de l'inactivité à 14 jours sur 16 981 joueurs compétitifs. Détection des points de rupture psychologique (séries de défaites, ragequits, sessions nocturnes) pour guider des interventions bienveillantes de matchmaking sans falsifier l'équité sportive.",
      ctaExplore: "Explorer l'Étude",
      ctaSimulator: "Tester le Simulateur",
      ctaBenchmark: "Benchmark ML & Modèles",
      pillars: {
        churn: {
          title: "Enjeu Économique du Churn 14 Jours",
          desc: "Dans un jeu service compétitif, 14 jours d'inactivité continue constituent le seuil critique d'abandon définitif. Identifier ce décrochage à l'avance préserve la LTV (Lifetime Value) et la santé de l'écosystème classé sans introduire de fuites temporelles de calendrier."
        },
        tilt: {
          title: "Psychologie du Tilt & Spirales de Défaite",
          desc: "Le churn dans les MOBAs n'est pas aléatoire : il résulte de l'accumulation de micro-traumatismes compétitifs (défaites écrasantes en moins de 25 min, séries de 3+ défaites, fatigue nocturne). Notre modèle capture cette vulnérabilité psychologique."
        },
        intervention: {
          title: "Matchmaking Préventif & Éthique",
          desc: "Plutôt que de manipuler artificiellement les victoires (rejet formel de l'EOMM prédateur), l'intervention consiste à atténuer la fatigue : suggérer un cooldown, éviter d'apparier plusieurs joueurs en tilt aigu ensemble, et préserver l'équité sportive 50/50."
        }
      },
      highlights: {
        dataset: "16 981 Profils Analysés",
        recall: "85.0% Rappel Churn",
        leakage: "Zéro Fuite Temporelle"
      }
    },

    // Executive KPIs
    kpis: {
      sectionTitle: "Indicateurs Clés de l'Étude",
      sectionSubtitle: "Métriques macroscopiques extraites du pipeline d'ingestion et du modèle champion V6.",
      cards: {
        datasetSize: {
          value: "16 981",
          label: "Joueurs / Profils Analysés",
          desc: "Dataset extrait via l'API OpenDota avec filtrage d'intégrité"
        },
        windowSize: {
          value: "100",
          label: "Parties par Profil",
          desc: "Fenêtre temporelle glissante pour isoler les tendances réelles"
        },
        featuresCount: {
          value: "45",
          label: "Variables Comportementales",
          desc: "Indicateurs de combat, économie, fatigue nocturne et tilt"
        },
        recall: {
          value: "85.0%",
          label: "Rappel Détection Churn",
          desc: "85 joueurs sur 100 en phase de départ sont interceptés avant l'abandon"
        },
        prAuc: {
          value: "79.3%",
          label: "PR-AUC (Précision-Rappel)",
          desc: "Score de référence au seuil optimal θ* = 0.36 sans fuite de calendrier"
        },
        rocAuc: {
          value: "80.0%",
          label: "ROC-AUC Global",
          desc: "Capacité de discrimination robuste et équilibrée"
        },
        rocPrAuc: {
          value: "80.0% / 79.3%",
          label: "ROC-AUC / PR-AUC",
          desc: "Capacité de discrimination robuste au seuil optimal θ* = 0.36 sans fuite temporelle"
        }
      }
    },

    // Psychological & Behavioral Features
    psychology: {
      sectionTitle: "Psychologie du Joueur & Variables Comportementales",
      sectionSubtitle: "Transformation de télémétrie in-game brute en signaux précurseurs de détresse psychologique.",
      headers: {
        formula: "Formule Mathématique",
        meaning: "Interprétation Gaming",
        impact: "Impact sur l'Abandon"
      },
      cards: {
        tiltIndex: {
          name: "Indice de Tilt (Tilt Index)",
          subtitle: "Mesure de l'accumulation de frustration et de nervosité",
          formula: "tilt_score = (abandons × 2) + max(0, |streak| - 2) + max(0, (25 - dur) × 0.1) + max(0, (dpm - 0.3) × 5)",
          meaning: "Combine les abandons récents, les séries de défaites punitives, les stomps expéditifs (<25 min) et les pics de morts rapides par minute.",
          impact: "Multiplie de façon exponentielle le risque d'abandon immédiat après 3 défaites consécutives."
        },
        nightOwlPct: {
          name: "% Joueur Nocturne (Night Owl)",
          subtitle: "Marqueur de perturbation circadienne & fatigue cognitive",
          formula: "night_owl_pct = matchs_entre_00h_et_06h / total_matchs",
          meaning: "Proportion des parties engagées entre minuit et 6 heures du matin. La fatigue nocturne dégrade la lucidité et amplifie la toxicité.",
          impact: "Fortement corrélé à une vulnérabilité accrue aux séries de défaites et aux ragequits."
        },
        objectiveFocus: {
          name: "Focus Objectifs (Objective Focus)",
          subtitle: "Orientation macro-stratégique vs bagarre désordonnée",
          formula: "objective_focus = avg_tower_damage / (avg_hero_damage + 1)",
          meaning: "Évalue la volonté d'assiéger les structures adverses par rapport aux escarmouches superflues. Une chute brutale indique le désintérêt pour la victoire.",
          impact: "Signal précurseur d'un désengagement passif et d'une résignation en jeu."
        },
        roleConsistency: {
          name: "Cohérence de Rôle (Role Consistency)",
          subtitle: "Stabilité du poste de jeu vs instabilité d'autofill",
          formula: "role_consistency = max_role_frequency / total_games",
          meaning: "Mesure si le joueur maîtrise un poste principal régulier ou subit une instabilité constante de rôle (autofill forcé).",
          impact: "Une spécialisation stable constitue un puissant bouclier de fidélisation (-24% de risque)."
        },
        gpmTrend: {
          name: "Tendance Économique (GPM/XPM Trend)",
          subtitle: "Décroissance des ressources sur les 10 dernières parties",
          formula: "gpm_trend = avg_gpm_recent_10 - avg_gpm_historical",
          meaning: "Chute du rythme de collecte d'or et d'expérience par minute. Témoigne d'une perte d'efficacité ou d'un abandon mental précoce.",
          impact: "Précède généralement l'abandon définitif du jeu de 2 à 4 jours."
        },
        damageTrend: {
          name: "Tendance d'Impact (Damage/KDA Trend)",
          subtitle: "Érosion de l'efficacité décisionnelle en combat",
          formula: "kda_trend = avg_kda_recent_10 - avg_kda_historical",
          meaning: "Chute combinée des dégâts et du ratio KDA, révélant la fatigue nerveuse et l'exaspération collective.",
          impact: "Symptôme clinique de burn-out compétitif menant à la désinstallation."
        },
        kdaTrend: {
          name: "Tendance de Combat KDA (kda_trend)",
          subtitle: "Érosion de l'efficacité décisionnelle et des escarmouches",
          formula: "kda_trend = avg_kda_recent_10 - avg_kda_historical",
          meaning: "Évolution du ratio Kills+Assists/Deaths sur la fenêtre récente. Une baisse brutale reflète une fatigue nerveuse : mauvais positionnements répétés, décisions impulsives et morts inutiles.",
          impact: "Symptôme clinique de burn-out compétitif. Une chute de KDA de plus de 1.0 point est associée à un bond de +28% du risque de churn."
        }
      },
      simulator: {
        badge: "LABORATOIRE INTERACTIF",
        title: "Simulateur Temps Réel du Tilt Index",
        subtitle: "Ajustez les curseurs télémétriques ci-dessous pour observer la formule exacte de backend/main.py:685-693 réagir en direct.",
        scoreLabel: "Score de Tilt",
        abandons: "Abandons Récents",
        lossStreak: "Série de Défaites",
        duration: "Durée Moyenne (min)",
        dpm: "Morts par Minute",
        actionTitle: "Politique de Matchmaking Recommandée"
      }
    },

    // Machine Learning Benchmarks & Explainability
    mlBenchmark: {
      sectionTitle: "Benchmark des Modèles & Explicabilité Machine Learning",
      sectionSubtitle: "Confrontation rigoureuse des architectures sur le dataset sans fuite (N=16 981, test=3 397).",
      table: {
        title: "Comparatif des Modèles Évalués",
        headers: {
          model: "Modèle / Architecture",
          accuracy: "Exactitude",
          precision: "Précision",
          recall: "Rappel",
          f1Score: "Score F1",
          rocAuc: "ROC-AUC",
          prAuc: "PR-AUC",
          threshold: "Seuil θ*",
          status: "Statut"
        },
        rows: {
          xgbSmote: {
            name: "V6 XGBoost + SMOTE (Champion)",
            accuracy: "70.2%",
            precision: "65.4%",
            recall: "85.0%",
            f1Score: "73.9%",
            rocAuc: "80.0%",
            prAuc: "79.3%",
            threshold: "0.36",
            status: "Déployé en Production",
            comment: "Meilleure couverture des joueurs en risque d'abandon sans artefacts de calendrier."
          },
          xgbSpw: {
            name: "V6 XGBoost + ScalePosWeight",
            accuracy: "70.6%",
            precision: "66.0%",
            recall: "84.1%",
            f1Score: "74.0%",
            rocAuc: "80.1%",
            prAuc: "79.3%",
            threshold: "0.37",
            status: "Alternatif Valide",
            comment: "Pondération analytique native des coûts de classe sans génération synthétique."
          },
          rfBaseline: {
            name: "Random Forest Baseline",
            accuracy: "64.8%",
            precision: "61.2%",
            recall: "71.5%",
            f1Score: "66.0%",
            rocAuc: "72.4%",
            prAuc: "69.8%",
            threshold: "0.50",
            status: "Baseline Ensembliste",
            comment: "Robuste au bruit mais manque de sensibilité sur les signaux asymétriques."
          },
          lrBaseline: {
            name: "Régression Logistique Baseline",
            accuracy: "61.3%",
            precision: "58.7%",
            recall: "65.2%",
            f1Score: "61.8%",
            rocAuc: "66.9%",
            prAuc: "63.5%",
            threshold: "0.50",
            status: "Baseline Linéaire",
            comment: "Linéaire, incapable de capturer les seuils non-linéaires de tilt."
          }
        }
      },
      confusionMatrix: {
        title: "Matrice de Confusion au Seuil Optimal (θ* = 0.36)",
        subtitle: "Évaluation sur l'échantillon de test indépendant (N = 3 397 profils)",
        actualHeader: "Réalité (Vraie Classe)",
        predictedHeader: "Prédiction de l'Algorithme",
        tp: {
          label: "Vrais Positifs (TP)",
          count: "1 434",
          desc: "Joueurs en churn correctement interceptés à l'avance"
        },
        fn: {
          label: "Faux Négatifs (FN)",
          count: "253",
          desc: "Abandons non détectés (taux d'échappement maîtrisé à 15%)"
        },
        fp: {
          label: "Faux Positifs (FP)",
          count: "760",
          desc: "Alertes préventives sur des joueurs qui ont finalement continué"
        },
        tn: {
          label: "Vrais Négatifs (TN)",
          count: "950",
          desc: "Joueurs fidélisés correctement identifiés sans fausse alerte"
        },
        classes: {
          churn: "Churn",
          retained: "Actif"
        }
      },
      curves: {
        title: "Courbes ROC & Précision-Rappel Interactives",
        subtitle: "Compromis de sensibilité selon le seuil de décision θ.",
        rocLabel: "Courbe ROC (Sensibilité vs 1 - Spécificité)",
        prLabel: "Courbe Précision-Rappel (PR Curve)",
        optimalCutoff: "Seuil Recommandé Studio : θ* = 0.36"
      },
      featureImportance: {
        title: "Importance Relative des Variables (Top Coefficients)",
        subtitle: "Poids de décision moyen dans les arbres de gradient boosting XGBoost.",
        takeaway: "L'XPM moyen (31.5%) et la durée de session (12.6%) pilotent la décision prédictive."
      }
    },

    // Interactive Simulator & Archetypes
    simulator: {
      sectionTitle: "Simulateur Interactif & Archétypes Joueurs",
      sectionSubtitle: "Évaluez la probabilité de churn en direct via l'API ou explorez instantanément 4 profils types calibrés.",
      query: {
        label: "Interrogation par ID de Compte Dota 2 / Steam (32-bit)",
        placeholder: "Ex: 835397971, 224109642, 175397696, 101438338...",
        btnSubmit: "Analyser le Joueur",
        btnLoading: "Calcul de l'Inférence...",
        clear: "Effacer",
        quickFillLabel: "Suggestions 1-Clic :"
      },
      archetypesTitle: "Ou sélectionnez un Archétype en 1 Clic :",
      archetypes: {
        tilting_player: {
          name: "Le Joueur en Tilt Aigu",
          subtitle: "Série de défaites & frustration toxique",
          riskBadge: "Critique",
          probability: "86.5%",
          rank: "Archon IV",
          verdict: "Ragequit & abandon imminent si nouvelle défaite."
        },
        joueur_en_tilt: {
          name: "Le Joueur en Tilt Aigu",
          subtitle: "Série de défaites & frustration toxique",
          riskBadge: "Critique",
          probability: "86.5%",
          rank: "Archon IV",
          verdict: "Ragequit & abandon imminent si nouvelle défaite."
        },
        burned_out_veteran: {
          name: "Le Vétéran en Burnout",
          subtitle: "Haut niveau, désengagement passif",
          riskBadge: "Élevé",
          probability: "57.7%",
          rank: "Divine IV",
          verdict: "Désaffection progressive du jeu compétitif."
        },
        veteran_epuise: {
          name: "Le Vétéran en Burnout",
          subtitle: "Haut niveau, désengagement passif",
          riskBadge: "Élevé",
          probability: "57.7%",
          rank: "Divine IV",
          verdict: "Désaffection progressive du jeu compétitif."
        },
        consistent_support: {
          name: "Le Support Régulier",
          subtitle: "Rôle stable, résilience collective",
          riskBadge: "Faible",
          probability: "21.8%",
          rank: "Legend V",
          verdict: "Pratique collective saine et résiliente."
        },
        support_passionne: {
          name: "Le Support Régulier",
          subtitle: "Rôle stable, résilience collective",
          riskBadge: "Faible",
          probability: "21.8%",
          rank: "Legend V",
          verdict: "Pratique collective saine et résiliente."
        },
        balanced_player: {
          name: "Le Joueur Équilibré",
          subtitle: "Pratique saine, forte fidélisation",
          riskBadge: "Très Faible",
          probability: "19.6%",
          rank: "Ancient II",
          verdict: "Joueur solidement fidélisé sur le long terme."
        },
        joueur_equilibre: {
          name: "Le Joueur Équilibré",
          subtitle: "Pratique saine, forte fidélisation",
          riskBadge: "Très Faible",
          probability: "19.6%",
          rank: "Ancient II",
          verdict: "Joueur solidement fidélisé sur le long terme."
        }
      },
      gauge: {
        title: "Probabilité Prédite de Churn",
        subtitle: "Inférence en temps réel par le modèle champion V6 XGBoost",
        thresholdMarker: "Seuil d'Intervention θ* = 36%",
        optimalLabel: "Seuil Optimal θ* = 0.36",
        needleAriaLabel: "Jauge de probabilité de churn",
        tiers: {
          low: "Faible (< 36%)",
          moderate: "Modéré (36% - 60%)",
          critical: "Critique (> 60%)"
        },
        status: {
          retained: "Fidélisé — Maintien Standard",
          watchlist: "Vigilance — Risque d'Érosion",
          danger: "Alerte Churn — Intervention Recommandée"
        },
        actions: {
          low: "Engagement optimal. Aucune intervention requise. Maintenir les rotations de match standard.",
          moderate: "Vigilance requise. Suggérer un repos ou privilégier des coéquipiers calmes à haute maîtrise de rôle.",
          critical: "Intervention urgente requise. Proposer un cooldown bienveillant et éviter l'appariement avec d'autres joueurs en tilt."
        }
      },
      attribution: {
        title: "Décomposition des Facteurs Décisionnels",
        subtitle: "Poids relatif de chaque signal comportemental sur la prédiction de churn du modèle XGBoost.",
        aggravatingHeader: "Facteurs Aggravants (Poussant au Churn)",
        protectiveHeader: "Facteurs Protecteurs (Favorisant la Rétention)",
        aggravatingBadge: "Risque Accru",
        protectiveBadge: "Protection Active",
        impactLabel: "Impact",
        neutralText: "Les indicateurs de ce profil sont globalement équilibrés sans anomalie critique.",
        legend: {
          aggravating: "Indicateur aggravant (augmente la probabilité de départ)",
          protective: "Indicateur protecteur (réduit le risque d'abandon)"
        }
      },
      factorAttribution: {
        title: "Décomposition des Facteurs Décisionnels",
        subtitle: "Poids relatif de chaque signal comportemental sur la prédiction de churn du modèle XGBoost.",
        aggravatingHeader: "Facteurs Aggravants (Poussant au Churn)",
        protectiveHeader: "Facteurs Protecteurs (Favorisant la Rétention)",
        aggravatingBadge: "Risque Accru",
        protectiveBadge: "Protection Active",
        impactLabel: "Impact",
        neutralText: "Les indicateurs de ce profil sont globalement équilibrés sans anomalie critique.",
        legend: {
          aggravating: "Indicateur aggravant (augmente la probabilité de départ)",
          protective: "Indicateur protecteur (réduit le risque d'abandon)"
        }
      },
      telemetry: {
        title: "Indicateurs Télémétriques Clés du Profil",
        rank: "Rang Dota 2",
        winRate: "Win Rate Récent",
        kda: "Ratio KDA",
        gpm: "GPM Moyen",
        xpm: "XPM Moyen",
        sessionDuration: "Durée Moyenne Session",
        currentStreak: "Série Active",
        tiltIndex: "Indice de Tilt",
        recentAbandons: "Abandons Récents",
        nightOwl: "Sessions Nocturnes",
        partyPlay: "Parties en Groupe",
        roleConsistency: "Stabilité de Rôle",
        recentDuration: "Durée Récente",
        wins: "victoires",
        losses: "défaites",
        soloQueue: "100% Solo Queue",
        offlineNotice: "Mode Démo Calibré",
        synthesizedNotice: "Profil synthétisé deterministe (backend hors-ligne)"
      }
    },

    // Backend Connectivity & Status Indicator (Feature F10)
    backendStatus: {
      online: "API En ligne",
      onlineSubtitle: "FastAPI connecté et opérationnel",
      offline: "Démo Interactive",
      offlineSubtitle: "Inférence autonome & profils calibrés",
      checking: "Vérification...",
      checkingSubtitle: "Test de la connectivité backend",
      popover: {
        title: "État de la Connexion API",
        statusLabel: "Statut actuel :",
        onlineTitle: "Backend FastAPI Connecté",
        onlineDesc: "Le frontend est connecté avec succès au serveur FastAPI local. L'inférence et les métriques sont exécutées en temps réel.",
        offlineTitle: "Mode Démo Autonome Actif",
        offlineDesc: "Le backend FastAPI est actuellement injoignable ou hors-ligne. L'application bascule automatiquement sur les données de démonstration et les profils calibrés (N = 16 981).",
        portLabel: "Port actif :",
        proxyPort: "Proxy 8001 (Vite)",
        directPort: "Port direct 8000 (FastAPI)",
        fallbackMode: "Repli Démo Local",
        endpointLabel: "Point de terminaison :",
        lastCheckedLabel: "Dernière vérification :",
        justNow: "À l'instant",
        secondsAgo: "Il y a {seconds}s",
        refreshButton: "Tester la connexion",
        refreshingButton: "Vérification en cours...",
        quickstartTitle: "Pour démarrer le backend local :",
        quickstartCmd: "cd backend && uvicorn main:app --port 8000"
      }
    },

    // Architecture & Reproducibility (Feature F10)
    architecture: {
      sectionTitle: "Architecture Technique & Pipeline ML",
      sectionSubtitle: "De l’ingestion asynchrone OpenDota au microservice FastAPI et au calibrage d’intervention non-punitive.",
      pipeline: {
        step1: {
          title: "1. Ingestion & Télémétrie OpenDota",
          desc: "Collecte asynchrone par lots avec contrôle strict de rate-limit (1.05s / req) et validation d'intégrité."
        },
        step2: {
          title: "2. Ingénierie des 45 Features",
          desc: "Extraction normalisée sur 100 parties historiques : indices de tilt, sessions nocturnes et tendances économiques."
        },
        step3: {
          title: "3. Entraînement XGBoost + SMOTE",
          desc: "Classifieur ensembliste calibré sur une probabilité de coupure optimale de 0.36 pour 85% de rappel."
        },
        step4: {
          title: "4. Calibration du Seuil θ* = 0.36",
          desc: "Optimisation de coupure asymétrique minimisant les départs manqués sans pénaliser les joueurs sains."
        },
        step5: {
          title: "5. Microservice FastAPI & Attribution",
          desc: "Serveur asynchrone Python servant l'inférence en <50ms avec décomposition factorielle bilatérale TreeSHAP."
        }
      },
      quickstart: {
        title: "Démarrage Rapide & Reproductibilité",
        subtitle: "Installez et démarrez l'application showcase en seulement deux commandes standards :",
        commandInstall: "npm install",
        commandRun: "npm run dev",
        localNotice: "Le serveur de développement répond instantanément sur http://localhost:5173",
        offlineNotice: "Mode démo autonome intégré : l'application fonctionne immédiatement sans dépendance serveur externe."
      }
    },

    // Footer Shell & Compliance
    footer: {
      projectTitle: "Dota 2 Churn & Tilt Prediction — Showcase Machine Learning",
      projectTagline: "Étude empirique sur la rétention des joueurs et la détection préventive de la frustration dans l'esport compétitif.",
      disclaimers: {
        valve: "Dota 2 est une marque déposée de Valve Corporation. Ce projet est un travail de recherche académique et un démonstrateur de portfolio technique indépendant, sans lien commercial ni affiliation avec Valve.",
        opendota: "Les données de télémétrie sont extraites via l'API publique OpenDota conformément à ses conditions d'utilisation.",
        ethics: "Engagement Éthique : Matchmaking respectueux de l'équité sportive (probabilité de victoire 50/50). Refus formel de toute manipulation de résultat ou de rétention artificielle prédatrice (anti-EOMM).",
        anonymization: "Sécurité & Confidentialité : Code source rigoureusement anonymisé pour partage public sur GitHub (zéro clé d'API, zéro secret, zéro chemin machine local, zéro identifiant personnel)."
      },
      stack: "React 19 • Vite • FastAPI • XGBoost • SMOTE • Pure CSS Tokens",
      license: "Matthieu Gout • Projet personnel 2026"
    },

    // Ranks Dictionary
    ranks: {
      unranked: "Sans Rang",
      Herald: "Héraut",
      Guardian: "Gardien",
      Crusader: "Croisé",
      Archon: "Archonte",
      Legend: "Légende",
      Ancient: "Ancien",
      Divine: "Divin",
      Immortal: "Immortel"
    },

    // All 45 Engineered Feature Names
    features: {
      match_T_won: "Match T Gagné",
      match_T_imbalance: "Déséquilibre Match T",
      match_T_party_size: "Taille Groupe Match T",
      match_T_is_night: "Match T Partie Nocturne",
      match_T_is_ranked: "Match T Partie Classée",
      rank_tier: "Niveau du Rang (MMR)",
      current_streak_at_cutoff: "Série Active au Point T",
      avg_session_games: "Parties par Session (Moy.)",
      avg_rank_imbalance: "Déséquilibre Rang Lobby (Moy.)",
      abandon_rate: "Taux d'Abandons (Ragequits)",
      party_play_pct: "Parties en Groupe (%)",
      ranked_play_pct: "Parties Classées (%)",
      win_rate: "Taux de Victoire Global",
      avg_kills: "Kills Moyens",
      avg_deaths: "Morts Moyennes",
      avg_assists: "Assists Moyennes",
      avg_kda: "Ratio KDA Moyen",
      avg_duration: "Durée Moyenne de Match",
      hero_diversity: "Diversité du Pool de Héros",
      win_rate_trend: "Tendance Win Rate (10 récents)",
      kda_trend: "Tendance KDA (10 récents)",
      deaths_trend: "Tendance Morts",
      kills_trend: "Tendance Kills",
      assists_trend: "Tendance Assists",
      gpm_trend: "Tendance GPM (Or/min)",
      xpm_trend: "Tendance XPM (XP/min)",
      recent_abandons: "Abandons Récents",
      recent_avg_duration: "Durée Moyenne Récente",
      recent_deaths_per_min: "Morts par Minute Récentes",
      tilt_index: "Indice de Frustration (Tilt)",
      objective_focus: "Focus Objectifs (Tours)",
      night_owl_pct: "% Parties Nocturnes (00h-06h)",
      role_consistency: "Cohérence de Rôle Principal",
      is_on_loss_streak: "En Série de Défaites (Bool)",
      loss_streak_length: "Longueur Série de Défaites",
      win_streak_length: "Longueur Série de Victoires",
      kills_to_deaths_ratio: "Ratio Kills / Morts",
      assists_to_deaths_ratio: "Ratio Assists / Morts",
      session_duration_per_game: "Durée par Partie de Session",
      avg_gpm: "GPM Moyen (Or/min)",
      avg_xpm: "XPM Moyen (XP/min)",
      avg_last_hits: "Last Hits Moyens",
      avg_hero_damage: "Dégâts aux Héros Moyens",
      avg_tower_damage: "Dégâts aux Bâtiments Moyens",
      avg_hero_healing: "Soins aux Héros Moyens"
    },

    // User Feedback & Error Messages
    errors: {
      invalidId: "Veuillez saisir un identifiant numérique valide (ID de compte Steam 32-bit).",
      playerNotFound: "Joueur introuvable ou profil d'historique masqué. Essayez l'un des archétypes prédéfinis.",
      notEnoughMatches: "Le profil ne compte pas assez de parties standard récentes (minimum 20 matchs).",
      backendOffline: "Serveur local inaccessible. Chargement automatique du profil représentatif (mode démo).",
      genericError: "Une erreur inattendue est survenue. Veuillez réessayer."
    },

    // Dictionnaire & Lexique interactif
    dictionary: {
      title: "Dictionnaire & Lexique",
      subtitle: "Comprendre les termes gaming, psychologie et machine learning en un coup d'œil.",
      searchPlaceholder: "Rechercher un terme (ex: Tilt, GPM, Churn, Seuil)...",
      allCategories: "Tous",
      catGaming: "Gaming & Dota 2",
      catPsychology: "Psychologie & Tilt",
      catMl: "Machine Learning & Données",
      noResults: "Aucun terme ne correspond à votre recherche.",
      termCount: "{count} termes répertoriés",
      close: "Fermer le dictionnaire",
      openAria: "Ouvrir le panneau du dictionnaire",
      badgeGaming: "Gaming",
      badgePsychology: "Psychologie",
      badgeMl: "Machine Learning",
      clickToExplore: "Cliquer pour voir la définition",
      keyTakeaway: "Impact dans l'étude"
    },

    // Modale Découverte : C'est quoi Dota 2 & à qui sert cet outil
    aboutModal: {
      triggerToast: "🎮 Découvrir Dota 2 & le rôle de l'outil →",
      triggerHero: "🎮 Découvrir Dota 2 & l'utilité du projet",
      triggerBurger: "🎮 C'est quoi Dota 2 & l'outil ?",
      triggerBurgerSub: "Guide express en 1 min pour non-initiés et recruteurs",
      triggerDrawer: "Nouveau sur Dota 2 ?",
      triggerDrawerSub: "Comprendre le jeu, la psychologie et la valeur métier de l'étude",
      triggerDrawerBtn: "Découvrir en 1 min →",
      badge: "GUIDE DÉCOUVERTE • 1 MIN",
      title: "Comprendre Dota 2 & la Raison d'Être du Projet",
      subtitle: "Une synthèse claire pour les recruteurs et les personnes non familières avec le gaming compétitif.",
      closeAria: "Fermer la fenêtre d'information",
      card1Title: "1. Qu'est-ce que Dota 2 ?",
      card1Badge: "Le Jeu & l'Environnement",
      card1P1: "Édité par Valve Corporation, Dota 2 est l'un des piliers mondiaux de l'e-sport (MOBA 5 contre 5). Deux équipes s'affrontent sur une carte fermée pendant 30 à 60 minutes avec pour but ultime de détruire la forteresse adverse (l'Ancien).",
      card1P2: "Avec plus de 120 héros et des milliers de mécaniques, la charge cognitive est immense. La victoire dépend entièrement de 5 joueurs : si un coéquipier lâche prise ou s'énerve, le match devient une épreuve punitive.",
      card2Title: "2. Le Tilt & le Churn expliqués simplement",
      card2Badge: "Mécanismes Psychologiques",
      card2P1: "Le Tilt : État de frustration et d'épuisement émotionnel où le joueur perd sa lucidité (défaites consécutives, toxicité, ragequits). Il continue souvent à jouer compulsivement pour se refaire, aggravant sa spirale négative.",
      card2P2: "Le Churn : Après un match de rupture émotionnelle (notre Match T), le joueur cesse brutalement de jouer pendant au moins 14 jours ou désinstalle le jeu. Notre modèle démontre que ce départ n'est pas aléatoire : il est précédé de signaux télémétriques mesurables.",
      card3Title: "3. À qui s'adresse cet Outil & Pourquoi c'est Vital ?",
      card3Badge: "Valeur Métier & Décisionnaires",
      card3Audience1Title: "Équipes LiveOps & Studios (Rétention AAA)",
      card3Audience1Desc: "Sur un jeu free-to-play, acquérir un joueur coûte cher. Anticiper le churn avant la désinstallation permet de déclencher des interventions bienveillantes (quêtes adaptées, pauses incitatives) sans attendre qu'il soit trop tard.",
      card3Audience2Title: "Systèmes de Matchmaking Éthique (Santé des Joueurs)",
      card3Audience2Desc: "Détecter un joueur en plein épisode de tilt permet d'éviter de l'associer à d'autres joueurs frustrés, protégeant ainsi l'écosystème global de la toxicité et du burn-out compétitif.",
      card3Audience3Title: "Recruteurs & Équipes Data / ML (Cas d'école)",
      card3Audience3Desc: "Une démonstration concrète d'ingénierie ML de bout en bout : télémétrie asynchrone, rééquilibrage SMOTE, explicabilité SHAP et seuil de décision économique asymétrique (θ* = 0.36) pour 85% de rappel.",
      actionLexicon: "Consulter le Dictionnaire (21 termes) →",
      actionSimulator: "Tester le Simulateur Temps Réel →",
      actionClose: "Compris / Fermer"
    },

    // Temporal Dynamics & Trajectory (Simulator)
    simulatorTrajectory: {
      title: "Dynamique Temporelle & Trajectoire",
      subtitle: "Trajectoire séquentielle des 10 matchs précédant le point de rupture T",
      badgeCritical: "Décrochage Rapide (Spirale de Tilt)",
      badgeWarning: "Érosion Lente (Fatigue Latente)",
      badgeStable: "Trajectoire Stable & Rétention Forte",
      velocityLabel: "Vélocité d'Engagement",
      gapLabel: "Espacement Inter-Parties",
      slopeLabel: "Pente de Performance (ΔWR)",
      recentMatchesLabel: "Historique des 10 derniers matchs :",
      win: "V",
      loss: "D",
      cutoffPoint: "Point T (Observation)",
      insightCritical: "Signal de désengagement accéléré : l'écart inter-parties s'est multiplié par 3 consécutivement à 3 défaites toxiques.",
      insightWarning: "Fatigue comportementale mesurable : baisse de régularité et sessions nocturnes de compensation.",
      insightStable: "Rythme de jeu stable et régulier : aucun signe avant-coureur de rupture émotionnelle."
    },

    // Temporal Modeling & R&D Roadmap (Architecture)
    archTemporal: {
      badge: "PERSPECTIVE SÉRIES TEMPORELLES & R&D",
      title: "Au-delà du Snapshot : Dynamique Temporelle & Modèles Séquentiels",
      subtitle: "Comment dépasser la prédiction ponctuelle au Match T pour modéliser la vélocité et l'accélération du désengagement.",
      pillar1Title: "1. Analyse de Survie Dynamique (Time-to-Event)",
      pillar1Badge: "Survie & Taux de Hasard",
      pillar1Desc: "Plutôt qu'une décision binaire (churn oui/non à 14 jours), estimer la courbe de survie conditionnelle S(t | H_t) et le taux de hasard h(t). Cela permet de quantifier avec précision dans combien de jours la rupture aura lieu pour calibrer l'urgence d'intervention.",
      pillar2Title: "2. Transformers Temporels & LSTM Séquentiels",
      pillar2Badge: "Deep Learning Séquentiel",
      pillar2Desc: "Remplacer l'agrégation statique de variables (moyennes glissantes) par des architectures avec attention temporelle (Temporal Fusion Transformers). Le réseau ingère chaque partie séquentiellement, capturant les chocs émotionnels immédiats et la fatigue de fond.",
      pillar3Title: "3. Processus Ponctuels Temporels (Hawkes)",
      pillar3Badge: "Processus Auto-Excitants",
      pillar3Desc: "Modéliser les rafales de parties (bursts) et l'effet de contagion des défaites. Une défaite frustrante génère un pic immédiat de risque de ragequit qui décroît exponentiellement dans le temps si le joueur fait une pause salutaire.",
      formulaNote: "Formulation mathématique de la fonction de risque instantané intégrant l'amortissement temporel des chocs de tilt :"
    }
  },

  en: {
    // Navigation & Header Shell
    nav: {
      brandTitle: "DOTA 2 CHURN & TILT",
      brandSubtitle: "ML SHOWCASE",
      brandBadge: "V6 XGBOOST",
      links: {
        hero: "Overview",
        kpis: "Key Metrics",
        psychology: "Psychology",
        benchmark: "ML Benchmark",
        simulator: "Simulator",
        architecture: "Architecture",
        dictionary: "Dictionary"
      },
      status: {
        online: "API Online",
        offline: "Interactive Demo",
        checking: "Connecting..."
      },
      langToggle: {
        label: "Language",
        ariaLabel: "Switch language to French"
      },
      linkedin: {
        label: "LinkedIn Profile (Matthieu Gout)"
      },
      github: {
        label: "GitHub Repository"
      },
      menu: {
        open: "Open navigation menu",
        close: "Close navigation menu"
      }
    },

    // Hero Section
    hero: {
      badge: "AAA Machine Learning Research & Proactive Detection",
      titleMain: "Predicting Player Churn & Tilt in Dota 2",
      titleHighlight: "via Behavioral Telemetry",
      subtitle: "Predictive modeling of 14-day inactivity across 16,981 competitive players. Detecting psychological breaking points (loss streaks, ragequits, nocturnal sessions) to guide proactive, compassionate matchmaking interventions without compromising competitive integrity.",
      ctaExplore: "Explore Study",
      ctaSimulator: "Test Simulator",
      ctaBenchmark: "ML Benchmark & Models",
      pillars: {
        churn: {
          title: "14-Day Churn Economics",
          desc: "In competitive live-service games, 14 consecutive days of inactivity mark the definitive point of departure. Identifying disengagement early preserves long-term player LTV and ecosystem vitality without calendar-based data leakage."
        },
        tilt: {
          title: "Tilt Dynamics & Loss Spirals",
          desc: "MOBA churn is rarely random: it stems from compounded competitive friction (one-sided stomps under 25 min, 3+ loss streaks, nocturnal fatigue). Our pipeline operationalizes this psychological vulnerability into actionable signals."
        },
        intervention: {
          title: "Proactive & Ethical Matchmaking",
          desc: "Rather than rigging match outcomes (strictly rejecting predatory EOMM traps), proactive intervention stabilizes matchmaking: pairing tilted players with high-composure teammates, recommending cooldowns, while preserving strict 50/50 competitive integrity."
        }
      },
      highlights: {
        dataset: "16,981 Analyzed Profiles",
        recall: "85.0% Churn Recall",
        leakage: "Zero Temporal Leakage"
      }
    },

    // Executive KPIs
    kpis: {
      sectionTitle: "Executive Key Performance Indicators",
      sectionSubtitle: "High-level metrics derived from the data ingestion pipeline and champion V6 model.",
      cards: {
        datasetSize: {
          value: "16,981",
          label: "Analyzed Player Profiles",
          desc: "Curated OpenDota dataset with strict integrity filtering"
        },
        windowSize: {
          value: "100",
          label: "Rolling Matches Analyzed",
          desc: "Rolling temporal baseline capturing genuine player momentum"
        },
        featuresCount: {
          value: "45",
          label: "Engineered Features",
          desc: "Combat economics, nocturnal fatigue, and tilt dynamics"
        },
        recall: {
          value: "85.0%",
          label: "Churn Detection Recall",
          desc: "85 out of 100 at-risk players correctly identified prior to exit"
        },
        prAuc: {
          value: "79.3%",
          label: "PR-AUC (Precision-Recall)",
          desc: "Benchmark metric at calibrated optimal decision threshold θ* = 0.36"
        },
        rocAuc: {
          value: "80.0%",
          label: "Overall ROC-AUC",
          desc: "Clean class separation capacity with zero calendar artifacts"
        },
        rocPrAuc: {
          value: "80.0% / 79.3%",
          label: "ROC-AUC / PR-AUC",
          desc: "Robust discrimination power at optimal threshold θ* = 0.36 with zero temporal leakage"
        }
      }
    },

    // Psychological & Behavioral Features
    psychology: {
      sectionTitle: "Player Psychology & Behavioral Features",
      sectionSubtitle: "Transforming raw in-game match telemetry into psychological distress and disengagement signals.",
      headers: {
        formula: "Mathematical Formula",
        meaning: "Gaming Interpretation",
        impact: "Impact on Churn"
      },
      cards: {
        tiltIndex: {
          name: "Tilt Index",
          subtitle: "Measurement of cumulative frustration and acute toxicity",
          formula: "tilt_score = (abandons × 2) + max(0, |streak| - 2) + max(0, (25 - dur) × 0.1) + max(0, (dpm - 0.3) × 5)",
          meaning: "Combines recent abandons, painful loss streaks, sub-25 min stomp defeats, and rapid death rates per minute.",
          impact: "Exponentially multiplies immediate session termination after 3 consecutive defeats."
        },
        nightOwlPct: {
          name: "Night Owl Ratio (% Nocturnal)",
          subtitle: "Circadian disruption & cognitive fatigue marker",
          formula: "night_owl_pct = games_between_00h_and_06h / total_games",
          meaning: "Proportion of matches initiated between midnight and 6:00 AM. Nocturnal fatigue degrades decision-making and amplifies toxicity.",
          impact: "Strongly correlated with higher susceptibility to devastating tilt streaks and ragequits."
        },
        objectiveFocus: {
          name: "Objective Focus Ratio",
          subtitle: "Strategic macro focus vs chaotic teamfight brawling",
          formula: "objective_focus = avg_tower_damage / (avg_hero_damage + 1)",
          meaning: "Evaluates player dedication to sieging enemy buildings versus aimless fighting. A steep drop indicates loss of competitive will.",
          impact: "Early warning signal of passive demoralization and match surrender."
        },
        roleConsistency: {
          name: "Role Consistency Index",
          subtitle: "Positional stability vs autofill disruption",
          formula: "role_consistency = max_role_frequency / total_games",
          meaning: "Measures whether the player specializes in a primary lane or endures chronic autofill positional swaps.",
          impact: "Positional specialization serves as a strong retention shield (-24% churn risk)."
        },
        gpmTrend: {
          name: "Economic Momentum (GPM/XPM Trend)",
          subtitle: "Resource acquisition drop across the last 10 games",
          formula: "gpm_trend = avg_gpm_recent_10 - avg_gpm_historical",
          meaning: "Sharp collapse in gold and experience velocity. Reflects demoralization, passive farming deficits, and giving up early.",
          impact: "Typically precedes complete game abandonment by 2 to 4 days."
        },
        damageTrend: {
          name: "Combat Impact Trend (Damage/KDA Trend)",
          subtitle: "Decisional fatigue & tactical effectiveness erosion",
          formula: "kda_trend = avg_kda_recent_10 - avg_kda_historical",
          meaning: "Joint drop in damage output and KDA ratio, indicating cognitive exhaustion and teammate exasperation.",
          impact: "Clinical symptom of competitive burnout leading to uninstallation."
        },
        kdaTrend: {
          name: "Combat Impact Trend (kda_trend)",
          subtitle: "Erosion of combat decision-making & skirmish impact",
          formula: "kda_trend = avg_kda_recent_10 - avg_kda_historical",
          meaning: "Shift in combat efficiency (Kills+Assists/Deaths) over the recent window. A sudden collapse reflects decisional fatigue: mispositioning, emotional overextension, and preventable deaths.",
          impact: "Clinical symptom of competitive burnout. A KDA drop exceeding -1.0 is tied to a +28% spike in imminent departure risk."
        }
      },
      simulator: {
        badge: "INTERACTIVE LAB",
        title: "Live Tilt Index Simulator",
        subtitle: "Adjust the telemetry sliders below to watch the verbatim formula from backend/main.py:685-693 react in real time.",
        scoreLabel: "Tilt Score",
        abandons: "Recent Abandons",
        lossStreak: "Consecutive Loss Streak",
        duration: "Avg Duration (min)",
        dpm: "Deaths / Minute",
        actionTitle: "Recommended Matchmaking Policy"
      }
    },

    // Machine Learning Benchmarks & Explainability
    mlBenchmark: {
      sectionTitle: "ML Model Benchmarks & Explainability",
      sectionSubtitle: "Rigorous algorithmic comparison on the zero-leakage benchmark (N=16,981, test=3,397).",
      table: {
        title: "Comparative Algorithm Matrix",
        headers: {
          model: "Model Architecture",
          accuracy: "Accuracy",
          precision: "Precision",
          recall: "Recall",
          f1Score: "F1-Score",
          rocAuc: "ROC-AUC",
          prAuc: "PR-AUC",
          threshold: "Threshold θ*",
          status: "Status"
        },
        rows: {
          xgbSmote: {
            name: "V6 XGBoost + SMOTE (Champion)",
            accuracy: "70.2%",
            precision: "65.4%",
            recall: "85.0%",
            f1Score: "73.9%",
            rocAuc: "80.0%",
            prAuc: "79.3%",
            threshold: "0.36",
            status: "Production Candidate",
            comment: "Highest churn capture rate without any calendar or window artifacts."
          },
          xgbSpw: {
            name: "V6 XGBoost + ScalePosWeight",
            accuracy: "70.6%",
            precision: "66.0%",
            recall: "84.1%",
            f1Score: "74.0%",
            rocAuc: "80.1%",
            prAuc: "79.3%",
            threshold: "0.37",
            status: "Robust Alternative",
            comment: "Native cost-sensitive class balancing avoiding synthetic manifold distortion."
          },
          rfBaseline: {
            name: "Random Forest Baseline",
            accuracy: "64.8%",
            precision: "61.2%",
            recall: "71.5%",
            f1Score: "66.0%",
            rocAuc: "72.4%",
            prAuc: "69.8%",
            threshold: "0.50",
            status: "Ensemble Baseline",
            comment: "Noise-resistant but lacks calibration across asymmetric risk distributions."
          },
          lrBaseline: {
            name: "Logistic Regression Baseline",
            accuracy: "61.3%",
            precision: "58.7%",
            recall: "65.2%",
            f1Score: "61.8%",
            rocAuc: "66.9%",
            prAuc: "63.5%",
            threshold: "0.50",
            status: "Linear Baseline",
            comment: "Pure linear model, unable to capture non-linear tilt thresholds."
          }
        }
      },
      confusionMatrix: {
        title: "Confusion Matrix at Optimal Cutoff (θ* = 0.36)",
        subtitle: "Evaluation on independent test set (N = 3,397 profiles)",
        actualHeader: "Actual Ground Truth",
        predictedHeader: "Algorithm Prediction",
        tp: {
          label: "True Positives (TP)",
          count: "1,434",
          desc: "Churners correctly intercepted before departure"
        },
        fn: {
          label: "False Negatives (FN)",
          count: "253",
          desc: "Missed churners (miss rate constrained to 15%)"
        },
        fp: {
          label: "False Positives (FP)",
          count: "760",
          desc: "Preventative flags on players who ultimately stayed active"
        },
        tn: {
          label: "True Negatives (TN)",
          count: "950",
          desc: "Retained players correctly identified with zero false alarms"
        },
        classes: {
          churn: "Churn",
          retained: "Retained"
        }
      },
      curves: {
        title: "Interactive ROC & Precision-Recall Curves",
        subtitle: "Sensitivity trade-off across decision threshold θ.",
        rocLabel: "ROC Curve (Sensitivity vs 1 - Specificity)",
        prLabel: "Precision-Recall Curve (PR Curve)",
        optimalCutoff: "Studio Recommended Threshold: θ* = 0.36"
      },
      featureImportance: {
        title: "Relative Feature Importance (Top Drivers)",
        subtitle: "Average decision split importance in XGBoost gradient boosting trees.",
        takeaway: "Average XPM (31.5%) and session duration (12.6%) dominate the predictive signal."
      }
    },

    // Interactive Simulator & Archetypes
    simulator: {
      sectionTitle: "Interactive Risk Simulator & Player Archetypes",
      sectionSubtitle: "Evaluate real-time churn probability via live API or test 4 calibrated player archetypes.",
      query: {
        label: "Query by Dota 2 / Steam 32-bit Account ID",
        placeholder: "e.g. 835397971, 224109642, 175397696, 101438338...",
        btnSubmit: "Analyze Player",
        btnLoading: "Running Inference...",
        clear: "Clear",
        quickFillLabel: "1-Click Presets:"
      },
      archetypesTitle: "Or select a 1-Click Player Archetype:",
      archetypes: {
        tilting_player: {
          name: "The Tilting Player",
          subtitle: "Severe loss streak & toxic frustration",
          riskBadge: "Critical",
          probability: "86.5%",
          rank: "Archon IV",
          verdict: "Imminent ragequit and departure if another loss occurs."
        },
        joueur_en_tilt: {
          name: "The Tilting Player",
          subtitle: "Severe loss streak & toxic frustration",
          riskBadge: "Critical",
          probability: "86.5%",
          rank: "Archon IV",
          verdict: "Imminent ragequit and departure if another loss occurs."
        },
        burned_out_veteran: {
          name: "The Burned-out Veteran",
          subtitle: "High rank, passive disengagement",
          riskBadge: "High",
          probability: "57.7%",
          rank: "Divine IV",
          verdict: "Gradual disengagement from competitive play."
        },
        veteran_epuise: {
          name: "The Burned-out Veteran",
          subtitle: "High rank, passive disengagement",
          riskBadge: "High",
          probability: "57.7%",
          rank: "Divine IV",
          verdict: "Gradual disengagement from competitive play."
        },
        consistent_support: {
          name: "The Consistent Support",
          subtitle: "Stable role, high team resilience",
          riskBadge: "Low",
          probability: "21.8%",
          rank: "Legend V",
          verdict: "Healthy, collaborative, and resilient play pattern."
        },
        support_passionne: {
          name: "The Consistent Support",
          subtitle: "Stable role, high team resilience",
          riskBadge: "Low",
          probability: "21.8%",
          rank: "Legend V",
          verdict: "Healthy, collaborative, and resilient play pattern."
        },
        balanced_player: {
          name: "The Balanced Player",
          subtitle: "Healthy play habits, high retention",
          riskBadge: "Very Low",
          probability: "19.6%",
          rank: "Ancient II",
          verdict: "Solidly retained player with long-term engagement."
        },
        joueur_equilibre: {
          name: "The Balanced Player",
          subtitle: "Healthy play habits, high retention",
          riskBadge: "Very Low",
          probability: "19.6%",
          rank: "Ancient II",
          verdict: "Solidly retained player with long-term engagement."
        }
      },
      gauge: {
        title: "Predicted Churn Probability",
        subtitle: "Real-time inference by Champion V6 XGBoost model",
        thresholdMarker: "Intervention Threshold θ* = 36%",
        optimalLabel: "Optimal Threshold θ* = 0.36",
        needleAriaLabel: "Churn probability gauge",
        tiers: {
          low: "Low (< 36%)",
          moderate: "Moderate (36% - 60%)",
          critical: "Critical (> 60%)"
        },
        status: {
          retained: "Retained — Standard Engagement",
          watchlist: "Watchlist — Risk of Disaffection",
          danger: "Churn Alert — Proactive Intervention Recommended"
        },
        actions: {
          low: "Optimal engagement. No intervention required. Maintain standard matchmaking pools.",
          moderate: "Watchlist active. Suggest a short break or prioritize high-composure teammates.",
          critical: "Urgent intervention needed. Recommend compassionate cooldown and prevent pairing with tilted players."
        }
      },
      attribution: {
        title: "Key Factor Attribution Breakdown",
        subtitle: "Relative impact of each behavioral signal on the XGBoost churn prediction.",
        aggravatingHeader: "Aggravating Factors (Driving Churn)",
        protectiveHeader: "Protective Factors (Driving Retention)",
        aggravatingBadge: "Increased Risk",
        protectiveBadge: "Active Protection",
        impactLabel: "Impact",
        neutralText: "Behavioral telemetry indicators are well balanced for this profile.",
        legend: {
          aggravating: "Aggravating indicator (increases departure probability)",
          protective: "Protective indicator (reinforces retention likelihood)"
        }
      },
      factorAttribution: {
        title: "Key Factor Attribution Breakdown",
        subtitle: "Relative impact of each behavioral signal on the XGBoost churn prediction.",
        aggravatingHeader: "Aggravating Factors (Driving Churn)",
        protectiveHeader: "Protective Factors (Driving Retention)",
        aggravatingBadge: "Increased Risk",
        protectiveBadge: "Active Protection",
        impactLabel: "Impact",
        neutralText: "Behavioral telemetry indicators are well balanced for this profile.",
        legend: {
          aggravating: "Aggravating indicator (increases departure probability)",
          protective: "Protective indicator (reinforces retention likelihood)"
        }
      },
      telemetry: {
        title: "Key Profile Telemetry Indicators",
        rank: "Dota 2 Rank",
        winRate: "Recent Win Rate",
        kda: "KDA Ratio",
        gpm: "Average GPM",
        xpm: "Average XPM",
        sessionDuration: "Avg Session Duration",
        currentStreak: "Active Streak",
        tiltIndex: "Tilt Index",
        recentAbandons: "Recent Abandons",
        nightOwl: "Nocturnal Matches",
        partyPlay: "Party Play",
        roleConsistency: "Role Stability",
        recentDuration: "Recent Duration",
        wins: "wins",
        losses: "losses",
        soloQueue: "100% Solo Queue",
        offlineNotice: "Calibrated Demo Mode",
        synthesizedNotice: "Deterministic synthesized profile (offline backend)"
      }
    },

    // Backend Connectivity & Status Indicator (Feature F10)
    backendStatus: {
      online: "API Online",
      onlineSubtitle: "FastAPI connected and operational",
      offline: "Interactive Demo",
      offlineSubtitle: "Autonomous inference & calibrated profiles",
      checking: "Checking...",
      checkingSubtitle: "Testing backend connectivity",
      popover: {
        title: "API Connection Status",
        statusLabel: "Current status:",
        onlineTitle: "FastAPI Backend Connected",
        onlineDesc: "The frontend is connected successfully to the local FastAPI server. Live inference and dataset metrics are active.",
        offlineTitle: "Autonomous Demo Mode Active",
        offlineDesc: "The FastAPI backend is currently unreachable or offline. The application automatically falls back to calibrated demo data and synthetic profiles (N = 16,981).",
        portLabel: "Active port:",
        proxyPort: "Proxy 8001 (Vite)",
        directPort: "Direct Port 8000 (FastAPI)",
        fallbackMode: "Local Demo Fallback",
        endpointLabel: "Endpoint:",
        lastCheckedLabel: "Last checked:",
        justNow: "Just now",
        secondsAgo: "{seconds}s ago",
        refreshButton: "Re-check Connection",
        refreshingButton: "Checking in progress...",
        quickstartTitle: "To start the local backend:",
        quickstartCmd: "cd backend && uvicorn main:app --port 8000"
      }
    },

    // Architecture & Reproducibility (Feature F10)
    architecture: {
      sectionTitle: "Technical Architecture & ML Pipeline",
      sectionSubtitle: "From asynchronous OpenDota ingestion to the FastAPI microservice and non-punitive studio intervention cutoff.",
      pipeline: {
        step1: {
          title: "1. OpenDota Telemetry Ingestion",
          desc: "Batch async extraction with strict rate-limiting (1.05s / req) and data integrity verification."
        },
        step2: {
          title: "2. 45-Feature Behavioral Engineering",
          desc: "Standardized 100-match rolling extraction: tilt index, late-night play, and economic momentum."
        },
        step3: {
          title: "3. XGBoost + SMOTE Training",
          desc: "Ensemble classifier calibrated on optimal 0.36 decision cutoff for 85% churn detection recall."
        },
        step4: {
          title: "4. Cutoff Calibration θ* = 0.36",
          desc: "Asymmetric threshold optimization minimizing lost churners without penalizing composed players."
        },
        step5: {
          title: "5. FastAPI Serving & Attribution",
          desc: "Asynchronous Python server offering <50ms inference with bilateral TreeSHAP factor decomposition."
        }
      },
      quickstart: {
        title: "Quickstart & Reproducibility",
        subtitle: "Install and run the showcase application with just two standard commands:",
        commandInstall: "npm install",
        commandRun: "npm run dev",
        localNotice: "The development server launches immediately at http://localhost:5173",
        offlineNotice: "Autonomous demo mode included: the app functions out of the box with zero external dependencies."
      }
    },

    // Footer Shell & Compliance
    footer: {
      projectTitle: "Dota 2 Churn & Tilt Prediction — Machine Learning Showcase",
      projectTagline: "Empirical study on player retention and proactive frustration detection in competitive esports.",
      disclaimers: {
        valve: "Dota 2 is a registered trademark of Valve Corporation. This project is an independent academic research and portfolio showcase, with no commercial affiliation to Valve.",
        opendota: "Match telemetry is collected via the public OpenDota API in compliance with its terms of service.",
        ethics: "Ethical Standard: Matchmaking honoring competitive integrity (50/50 win expectation). Complete rejection of outcome manipulation or predatory retention mechanisms (anti-EOMM).",
        anonymization: "Security & Privacy: Source code strictly anonymized for public GitHub hosting (zero API keys, zero secrets, zero local machine paths, zero personal identifiers)."
      },
      stack: "React 19 • Vite • FastAPI • XGBoost • SMOTE • Pure CSS Tokens",
      license: "Matthieu Gout • Personal Project 2026"
    },

    // Ranks Dictionary
    ranks: {
      unranked: "Unranked",
      Herald: "Herald",
      Guardian: "Guardian",
      Crusader: "Crusader",
      Archon: "Archon",
      Legend: "Legend",
      Ancient: "Ancient",
      Divine: "Divine",
      Immortal: "Immortal"
    },

    // All 45 Engineered Feature Names
    features: {
      match_T_won: "Match T Won",
      match_T_imbalance: "Match T Imbalance",
      match_T_party_size: "Match T Party Size",
      match_T_is_night: "Match T Night Game",
      match_T_is_ranked: "Match T Ranked",
      rank_tier: "Rank Tier (MMR)",
      current_streak_at_cutoff: "Current Streak at Cutoff",
      avg_session_games: "Avg Games per Session",
      avg_rank_imbalance: "Avg Lobby Rank Imbalance",
      abandon_rate: "Abandon Rate (Ragequits)",
      party_play_pct: "Party Play Ratio (%)",
      ranked_play_pct: "Ranked Play Ratio (%)",
      win_rate: "Overall Win Rate",
      avg_kills: "Average Kills",
      avg_deaths: "Average Deaths",
      avg_assists: "Average Assists",
      avg_kda: "Average KDA Ratio",
      avg_duration: "Average Match Duration",
      hero_diversity: "Hero Pool Diversity",
      win_rate_trend: "Win Rate Trend (Recent 10)",
      kda_trend: "KDA Trend (Recent 10)",
      deaths_trend: "Deaths Trend",
      kills_trend: "Kills Trend",
      assists_trend: "Assists Trend",
      gpm_trend: "GPM Trend (Gold/min)",
      xpm_trend: "XPM Trend (XP/min)",
      recent_abandons: "Recent Abandons",
      recent_avg_duration: "Recent Avg Match Duration",
      recent_deaths_per_min: "Recent Deaths per Minute",
      tilt_index: "Tilt Frustration Index",
      objective_focus: "Objective Focus (Towers)",
      night_owl_pct: "% Nocturnal Matches (00h-06h)",
      role_consistency: "Primary Role Consistency",
      is_on_loss_streak: "On Loss Streak (Flag)",
      loss_streak_length: "Loss Streak Length",
      win_streak_length: "Win Streak Length",
      kills_to_deaths_ratio: "Kills to Deaths Ratio",
      assists_to_deaths_ratio: "Assists to Deaths Ratio",
      session_duration_per_game: "Session Duration per Game",
      avg_gpm: "Average GPM (Gold/min)",
      avg_xpm: "Average XPM (XP/min)",
      avg_last_hits: "Average Last Hits",
      avg_hero_damage: "Average Hero Damage",
      avg_tower_damage: "Average Tower Damage",
      avg_hero_healing: "Average Hero Healing"
    },

    // User Feedback & Error Messages
    errors: {
      invalidId: "Please enter a valid numeric ID (32-bit Steam account ID).",
      playerNotFound: "Player not found or match history is private. Please test one of the predefined archetypes.",
      notEnoughMatches: "The profile does not have enough valid recent matches (minimum 20 games required).",
      backendOffline: "Local backend is unreachable. Automatically loaded representative profile (demo mode).",
      genericError: "An unexpected error occurred. Please try again."
    },

    // Interactive Dictionary & Glossary Drawer
    dictionary: {
      title: "Dictionary & Glossary",
      subtitle: "Demystifying gaming, psychology, and machine learning terms in plain words.",
      searchPlaceholder: "Search a term (e.g. Tilt, GPM, Churn, Threshold)...",
      allCategories: "All",
      catGaming: "Gaming & Dota 2",
      catPsychology: "Psychology & Tilt",
      catMl: "Machine Learning & Data",
      noResults: "No terms match your search query.",
      termCount: "{count} terms cataloged",
      close: "Close dictionary",
      openAria: "Open dictionary panel",
      badgeGaming: "Gaming",
      badgePsychology: "Psychology",
      badgeMl: "Machine Learning",
      clickToExplore: "Click to view definition",
      keyTakeaway: "Study takeaway"
    },

    // Discovery Modal: What is Dota 2 & who is this tool for
    aboutModal: {
      triggerToast: "🎮 Discover Dota 2 & the purpose of this tool →",
      triggerHero: "🎮 Discover Dota 2 & study purpose",
      triggerBurger: "🎮 What is Dota 2 & this tool?",
      triggerBurgerSub: "1-min brief for recruiters & newcomers",
      triggerDrawer: "New to Dota 2?",
      triggerDrawerSub: "Understand the game, psychology & business impact",
      triggerDrawerBtn: "Discover in 1 min →",
      badge: "DISCOVERY BRIEF • 1 MIN",
      title: "Understanding Dota 2 & the Purpose of this Study",
      subtitle: "A concise primer for recruiters and professionals outside the competitive gaming sphere.",
      closeAria: "Close information modal",
      card1Title: "1. What is Dota 2?",
      card1Badge: "The Game & Environment",
      card1P1: "Created by Valve Corporation, Dota 2 is a flagship title of global e-sports (5v5 MOBA). Two teams battle on a closed map for 30 to 60 minutes aiming to destroy the opposing stronghold (the Ancient).",
      card1P2: "With over 120 heroes and thousands of mechanics, cognitive load is extreme. Victory relies entirely on all 5 players: if one teammate tilts or gives up, the match turns into a punishing ordeal.",
      card2Title: "2. Tilt & Churn Explained Simply",
      card2Badge: "Psychological Dynamics",
      card2P1: "Tilt: A state of emotional exhaustion and frustration where a player loses composure (consecutive losses, toxicity, ragequits). Players often keep queuing compulsively to avenge losses, deepening the negative spiral.",
      card2P2: "Churn: Following an emotional breaking-point game (our Match T), the player abruptly stops playing for at least 14 days or uninstalls. Our model proves this departure is never random: it leaves measurable telemetry footprints.",
      card3Title: "3. Who is this Tool for & Why is it Critical?",
      card3Badge: "Business Value & Stakeholders",
      card3Audience1Title: "LiveOps & Studio Teams (AAA Retention)",
      card3Audience1Desc: "In free-to-play ecosystems, acquiring players is expensive. Predicting churn before uninstallation enables benevolent interventions (tailored quests, incentive breaks) before players are lost forever.",
      card3Audience2Title: "Ethical Matchmaking (Player Wellbeing)",
      card3Audience2Desc: "Detecting a player in an active tilt episode prevents matching them with other frustrated players, actively shielding the broader community from toxicity and competitive burn-out.",
      card3Audience3Title: "Recruiters & Data/ML Teams (Production Benchmark)",
      card3Audience3Desc: "A concrete end-to-end production ML benchmark: asynchronous telemetry, SMOTE balancing, SHAP interpretability, and an asymmetric economic decision threshold (θ* = 0.36) securing 85% recall.",
      actionLexicon: "Explore Dictionary (21 terms) →",
      actionSimulator: "Test Live Simulator →",
      actionClose: "Got it / Close"
    },

    // Temporal Dynamics & Trajectory (Simulator)
    simulatorTrajectory: {
      title: "Temporal Dynamics & Trajectory",
      subtitle: "Sequential match-by-match trajectory across the 10 games leading to Cutoff T",
      badgeCritical: "Accelerated Decay (Tilt Spiral)",
      badgeWarning: "Gradual Erosion (Latent Fatigue)",
      badgeStable: "Stable Trajectory & High Retention",
      velocityLabel: "Engagement Velocity",
      gapLabel: "Inter-Match Gap",
      slopeLabel: "Performance Slope (ΔWR)",
      recentMatchesLabel: "Recent 10-match timeline:",
      win: "W",
      loss: "L",
      cutoffPoint: "Cutoff T (Observation)",
      insightCritical: "Accelerated disengagement signal: inter-match interval tripled following consecutive toxic losses.",
      insightWarning: "Measurable behavioral fatigue: dropping regularity accompanied by compensatory late-night sessions.",
      insightStable: "Stable and consistent playing cadence: zero advance indicators of emotional breakdown."
    },

    // Temporal Modeling & R&D Roadmap (Architecture)
    archTemporal: {
      badge: "TIME-SERIES MODELING & R&D ROADMAP",
      title: "Beyond the Snapshot: Temporal Dynamics & Sequential Architectures",
      subtitle: "How to move beyond point predictions at Match T toward modeling velocity and acceleration of player disengagement.",
      pillar1Title: "1. Dynamic Time-to-Event Survival Analysis",
      pillar1Badge: "Survival & Hazard Rates",
      pillar1Desc: "Rather than a binary decision (churn yes/no at 14 days), continuously estimate the conditional survival curve S(t | H_t) and hazard rate h(t). This quantifies exactly in how many days breakdown will occur to calibrate intervention urgency.",
      pillar2Title: "2. Temporal Fusion Transformers & Sequential LSTMs",
      pillar2Badge: "Sequential Deep Learning",
      pillar2Desc: "Replace static summary aggregation (rolling averages) with temporal attention mechanisms (Temporal Fusion Transformers). The network ingests each match chronologically, capturing both acute emotional shocks and baseline fatigue.",
      pillar3Title: "3. Temporal Point Processes (Hawkes Processes)",
      pillar3Badge: "Self-Exciting Processes",
      pillar3Desc: "Model match clustering (bursts) and the contagion dynamics of defeats. A frustrating loss produces an immediate spike in ragequit risk that decays exponentially over time if the player takes a healthy cooldown break.",
      formulaNote: "Mathematical formulation of the instantaneous hazard rate incorporating time-decayed tilt shock responses:"
    }
  }
};

/**
 * Translation Helper with Fallback Mechanism & String Interpolation
 * @param {string} path - Dot-delimited key path (e.g. 'hero.titleMain')
 * @param {string} lang - 'fr' or 'en'
 * @param {Record<string, string|number>} [params] - Optional interpolation parameters {count: 10}
 * @returns {string} - Localized string or graceful fallback
 */
export function t(path, lang = 'fr', params = {}) {
  if (typeof path !== 'string' || !path) return '';
  const currentLang = (lang === 'fr' || lang === 'en') ? lang : 'fr';
  const fallbackLang = currentLang === 'fr' ? 'en' : 'fr';

  const resolve = (dictionary) => {
    if (!dictionary || typeof dictionary !== 'object') return undefined;
    const parts = path.split('.');
    let curr = dictionary;
    for (const part of parts) {
      if (curr == null || typeof curr !== 'object') return undefined;
      if (!Object.prototype.hasOwnProperty.call(curr, part)) return undefined;
      curr = curr[part];
    }
    if (typeof curr === 'function') return undefined;
    return curr;
  };

  let val = resolve(translations[currentLang]);
  if (val === undefined) {
    val = resolve(translations[fallbackLang]);
  }
  if (val === undefined) {
    // Return key string rather than throwing error or rendering undefined
    return path;
  }

  if (typeof val === 'string' && params && typeof params === 'object' && Object.keys(params).length > 0) {
    return val.replace(/\{(\w+)\}/g, (match, paramName) => {
      return params[paramName] !== undefined ? String(params[paramName]) : match;
    });
  }

  return val;
}

/**
 * Translates an engineered feature key (e.g., 'avg_xpm')
 */
export function translateFeature(featureKey, lang = 'fr') {
  if (featureKey === undefined || featureKey === null) return '';
  const activeLang = (lang === 'fr' || lang === 'en') ? lang : 'fr';
  const dict = translations[activeLang]?.features;
  const fallbackDict = translations.en?.features;

  if (dict && Object.prototype.hasOwnProperty.call(dict, featureKey) && typeof dict[featureKey] === 'string') {
    return dict[featureKey];
  }
  if (fallbackDict && Object.prototype.hasOwnProperty.call(fallbackDict, featureKey) && typeof fallbackDict[featureKey] === 'string') {
    return fallbackDict[featureKey];
  }
  return String(featureKey);
}

/**
 * Translates a Dota 2 Rank Tier number (e.g., 34 -> 'Archon 4')
 */
export function translateRank(rankTier, lang = 'fr') {
  if (!rankTier) return t('ranks.unranked', lang);
  const ranksKey = ['Herald', 'Guardian', 'Crusader', 'Archon', 'Legend', 'Ancient', 'Divine', 'Immortal'];
  const rankIndex = Math.floor(rankTier / 10) - 1;
  const stars = rankTier % 10;

  if (rankIndex >= 7) return t('ranks.Immortal', lang);
  if (rankIndex >= 0 && rankIndex < ranksKey.length) {
    const key = ranksKey[rankIndex];
    const name = t(`ranks.${key}`, lang);
    return `${name} ${stars > 0 ? stars : ''}`.trim();
  }
  return t('ranks.unranked', lang);
}

/**
 * Returns localized risk badge based on probability
 */
export function translateRiskLevel(probability, lang = 'fr') {
  if (probability >= 0.60) {
    return {
      level: 'critical',
      label: t('simulator.gauge.tiers.critical', lang),
      status: t('simulator.gauge.status.danger', lang),
      color: 'var(--accent-rose, #ef4444)'
    };
  }
  if (probability >= 0.36) {
    return {
      level: 'moderate',
      label: t('simulator.gauge.tiers.moderate', lang),
      status: t('simulator.gauge.status.watchlist', lang),
      color: 'var(--accent-amber, #f59e0b)'
    };
  }
  return {
    level: 'low',
    label: t('simulator.gauge.tiers.low', lang),
    status: t('simulator.gauge.status.retained', lang),
    color: 'var(--accent-emerald, #10b981)'
  };
}
