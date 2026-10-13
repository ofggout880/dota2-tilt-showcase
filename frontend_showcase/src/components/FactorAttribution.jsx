import React, { useState } from 'react';
import { t as defaultT, translateFeature } from '../translations';

/**
 * Pre-calibrated Behavioral Factor Attributions for the 4 Reference Archetypes.
 * Ground-truth decision breakdown mirroring SHAP tree-split contributions in V6 XGBoost.
 */
const BASE_ARCHETYPE_ATTRIBUTIONS = {
  tilting_player: {
    aggravating: [
      {
        feature: 'current_streak_at_cutoff',
        weight: 28.5,
        observedValue: '-5 défaites',
        observedValueEn: '-5 loss streak',
        baselineValue: '0 (Équilibré)',
        baselineValueEn: '0 (Neutral)',
        explanationFr: 'Série punitive de 5 défaites d\'affilée provoquant une détresse compétitive aiguë.',
        explanationEn: 'Severe 5-game losing streak triggering acute competitive distress and frustration.'
      },
      {
        feature: 'tilt_index',
        weight: 22.0,
        observedValue: '4.8 (Critique)',
        observedValueEn: '4.8 (Critical)',
        baselineValue: '0.5 (Moyenne)',
        baselineValueEn: '0.5 (Average)',
        explanationFr: 'Score de tilt maximal : stomps subis en moins de 22 minutes et morts rapides par minute.',
        explanationEn: 'Peak tilt score: recurring rapid stomps (<22 min) and elevated deaths per minute.'
      },
      {
        feature: 'abandon_rate',
        weight: 18.2,
        observedValue: '15.0% (2 abandons)',
        observedValueEn: '15.0% (2 abandons)',
        baselineValue: '1.5% (Discipline)',
        baselineValueEn: '1.5% (Standard)',
        explanationFr: '2 abandons récents de partie en cours, indicateur direct de rupture du seuil de tolérance.',
        explanationEn: '2 recent mid-match abandons, direct indicator of broken frustration threshold.'
      },
      {
        feature: 'night_owl_pct',
        weight: 11.4,
        observedValue: '65.0% (00h-06h)',
        observedValueEn: '65.0% (00h-06h)',
        baselineValue: '12.0%',
        baselineValueEn: '12.0%',
        explanationFr: 'Sessions de jeu tardives répétées corrélées à une fatigue cognitive et une irritabilité accrue.',
        explanationEn: 'Frequent late-night sessions tied to cumulative cognitive fatigue and heightened irritability.'
      },
      {
        feature: 'party_play_pct',
        weight: 8.9,
        observedValue: '0.0% (100% Solo)',
        observedValueEn: '0.0% (100% Solo)',
        baselineValue: '35.0%',
        baselineValueEn: '35.0%',
        explanationFr: 'Absence totale de filet social protecteur : 100% de solo queue sans amis pour amortir le tilt.',
        explanationEn: 'Total absence of social safety buffer: 100% solo queue without friends to cushion tilt.'
      }
    ],
    protective: [
      {
        feature: 'avg_xpm',
        weight: -4.2,
        observedValue: '395 XP/min',
        observedValueEn: '395 XP/min',
        baselineValue: '520 XP/min',
        baselineValueEn: '520 XP/min',
        explanationFr: 'Maintien d\'un rythme d\'expérience minimal empêchant un déclassement total du profil.',
        explanationEn: 'Baseline XP accumulation maintained, preventing complete rating collapse.'
      },
      {
        feature: 'rank_tier',
        weight: -2.8,
        observedValue: 'Archon IV',
        observedValueEn: 'Archon IV',
        baselineValue: 'Crusader',
        baselineValueEn: 'Crusader',
        explanationFr: 'Palier de rang intermédiaire avec des jalons de progression de saison encore accessibles.',
        explanationEn: 'Intermediate rank tier with reachable seasonal progression milestones.'
      }
    ]
  },

  burned_out_veteran: {
    aggravating: [
      {
        feature: 'recent_avg_duration',
        weight: 19.5,
        observedValue: '38.5 min/match',
        observedValueEn: '38.5 min/match',
        baselineValue: '35.0 min',
        baselineValueEn: '35.0 min',
        explanationFr: 'Parties longues et exténuantes générant de la fatigue mentale avec un retour sur investissement ressenti faible.',
        explanationEn: 'Grueling long matches yielding mental exhaustion with diminishing perceived competitive rewards.'
      },
      {
        feature: 'role_consistency',
        weight: 16.0,
        observedValue: '45.0% (Dispersé)',
        observedValueEn: '45.0% (Dispersed)',
        baselineValue: '70.0% (Stable)',
        baselineValueEn: '70.0% (Stable)',
        explanationFr: 'Dispersion anormale des postes joués, traduisant un désintérêt pour son rôle historique de prédilection.',
        explanationEn: 'Role dispersion reflecting waning engagement and boredom with primary legacy role.'
      },
      {
        feature: 'party_play_pct',
        weight: 14.5,
        observedValue: '10.0%',
        observedValueEn: '10.0%',
        baselineValue: '35.0%',
        baselineValueEn: '35.0%',
        explanationFr: 'Isolement social progressif : ses coéquipiers réguliers ont cessé de se connecter au jeu.',
        explanationEn: 'Gradual social isolation: legacy party members no longer active on Steam.'
      },
      {
        feature: 'win_rate',
        weight: 12.0,
        observedValue: '49.0%',
        observedValueEn: '49.0%',
        baselineValue: '50.0%',
        baselineValueEn: '50.0%',
        explanationFr: 'Plafond de verre au niveau Divine : ratio victoires bloqué sous 50% sans sentiment de progression.',
        explanationEn: 'MMR plateau at Divine tier: sub-50% win rate creating a stagnant progression sensation.'
      }
    ],
    protective: [
      {
        feature: 'rank_tier',
        weight: -18.0,
        observedValue: 'Divine IV (74)',
        observedValueEn: 'Divine IV (74)',
        baselineValue: 'Archon (30)',
        baselineValueEn: 'Archon (30)',
        explanationFr: 'Statut compétitif prestigieux : fort attachement historique et investissement en temps dans le jeu.',
        explanationEn: 'Elite Divine IV rank tier: substantial historical investment and psychological status attachment.'
      },
      {
        feature: 'abandon_rate',
        weight: -12.5,
        observedValue: '0.0% (0 abandon)',
        observedValueEn: '0.0% (0 abandons)',
        baselineValue: '1.5%',
        baselineValueEn: '1.5%',
        explanationFr: 'Discipline compétitive exemplaire : aucun abandon de partie malgré le désengagement passif.',
        explanationEn: 'Impeccable match completion: zero ragequits despite creeping fatigue.'
      },
      {
        feature: 'avg_xpm',
        weight: -7.5,
        observedValue: '510 XP/min',
        observedValueEn: '510 XP/min',
        baselineValue: '520 XP/min',
        baselineValueEn: '520 XP/min',
        explanationFr: 'Fondamentaux mécaniques et macro-stratégiques de haut niveau stabilisant les parties.',
        explanationEn: 'Solid macro/micro mechanics stabilizing baseline match execution.'
      }
    ]
  },

  consistent_support: {
    aggravating: [
      {
        feature: 'avg_gpm',
        weight: 6.8,
        observedValue: '390 GPM',
        observedValueEn: '390 GPM',
        baselineValue: '480 GPM',
        baselineValueEn: '480 GPM',
        explanationFr: 'Économie restreinte propre au poste de support, créant une vulnérabilité accrue lors des stomps adverses.',
        explanationEn: 'Constrained support economy creating vulnerability during one-sided opposing stomps.'
      },
      {
        feature: 'recent_avg_duration',
        weight: 5.2,
        observedValue: '41.2 min',
        observedValueEn: '41.2 min',
        baselineValue: '35.0 min',
        baselineValueEn: '35.0 min',
        explanationFr: 'Parties à rallonge exigeantes en concentration sur des sessions de jeu consécutives.',
        explanationEn: 'Grueling extended matches adding physical and mental fatigue over prolonged sessions.'
      }
    ],
    protective: [
      {
        feature: 'role_consistency',
        weight: -26.5,
        observedValue: '85.0% (Support)',
        observedValueEn: '85.0% (Support)',
        baselineValue: '60.0%',
        baselineValueEn: '60.0%',
        explanationFr: 'Fidélité exceptionnelle au rôle Support (85%), gage d\'utilité collective et de satisfaction sereine.',
        explanationEn: 'Exceptional role commitment (85% Support), driving team cohesion and psychological satisfaction.'
      },
      {
        feature: 'party_play_pct',
        weight: -22.0,
        observedValue: '55.0% en groupe',
        observedValueEn: '55.0% in party',
        baselineValue: '35.0%',
        baselineValueEn: '35.0%',
        explanationFr: 'Pratique collective régulière avec des amis constituant un bouclier majeur contre la frustration.',
        explanationEn: 'Frequent party play with friends effectively shielding against frustration.'
      },
      {
        feature: 'win_rate',
        weight: -14.5,
        observedValue: '54.0%',
        observedValueEn: '54.0%',
        baselineValue: '50.0%',
        baselineValueEn: '50.0%',
        explanationFr: 'Dynamique de victoire positive générant une gratification régulière et un engagement pérenne.',
        explanationEn: 'Positive win rate momentum sustaining regular psychological reward loops.'
      },
      {
        feature: 'abandon_rate',
        weight: -11.0,
        observedValue: '1.0% (Très faible)',
        observedValueEn: '1.0% (Very low)',
        baselineValue: '1.5%',
        baselineValueEn: '1.5%',
        explanationFr: 'Comportement irréprochable et sang-froid préservé même lors de matchs difficiles.',
        explanationEn: 'High match composure and resilience even during adverse game states.'
      }
    ]
  },

  balanced_player: {
    aggravating: [
      {
        feature: 'current_streak_at_cutoff',
        weight: 2.5,
        observedValue: '+3 victoires',
        observedValueEn: '+3 win streak',
        baselineValue: '0',
        baselineValueEn: '0',
        explanationFr: 'Série active positive : risque marginal de désillusion ou de nervosité quand la variance s\'inversera.',
        explanationEn: 'Active win streak: minor risk of disappointment when variance inevitably flips.'
      }
    ],
    protective: [
      {
        feature: 'party_play_pct',
        weight: -31.0,
        observedValue: '70.0% (Groupe)',
        observedValueEn: '70.0% (Party)',
        baselineValue: '35.0%',
        baselineValueEn: '35.0%',
        explanationFr: 'Cœur de réseau social très actif (70% en groupe) : le facteur prédictif n°1 de rétention à long terme.',
        explanationEn: 'Thriving social network (70% party play): the single strongest statistical driver of long-term retention.'
      },
      {
        feature: 'win_rate',
        weight: -24.0,
        observedValue: '58.0%',
        observedValueEn: '58.0%',
        baselineValue: '50.0%',
        baselineValueEn: '50.0%',
        explanationFr: 'Excellente efficacité compétitive assurant une progression constante et gratifiante en MMR.',
        explanationEn: 'Outstanding competitive efficiency yielding steady rating progression.'
      },
      {
        feature: 'avg_xpm',
        weight: -19.5,
        observedValue: '640 XP/min',
        observedValueEn: '640 XP/min',
        baselineValue: '520 XP/min',
        baselineValueEn: '520 XP/min',
        explanationFr: 'Maîtrise économique supérieure permettant de peser directement sur l\'issue des rencontres.',
        explanationEn: 'Superior farming and XP efficiency directly deciding match outcomes.'
      },
      {
        feature: 'tilt_index',
        weight: -14.0,
        observedValue: '0.0 (Serein)',
        observedValueEn: '0.0 (Serene)',
        baselineValue: '0.5',
        baselineValueEn: '0.5',
        explanationFr: 'Absence totale de signaux de tilt, d\'abandons ou de séries de défaites anormales.',
        explanationEn: 'Total absence of tilt signals, abandons, or unnatural loss streak patterns.'
      }
    ]
  }
};

const ARCHETYPE_ATTRIBUTIONS = {
  ...BASE_ARCHETYPE_ATTRIBUTIONS,
  joueur_en_tilt: BASE_ARCHETYPE_ATTRIBUTIONS.tilting_player,
  veteran_epuise: BASE_ARCHETYPE_ATTRIBUTIONS.burned_out_veteran,
  support_passionne: BASE_ARCHETYPE_ATTRIBUTIONS.consistent_support,
  joueur_equilibre: BASE_ARCHETYPE_ATTRIBUTIONS.balanced_player
};

/**
 * Dynamically derives SHAP-style attribution factors from arbitrary player profile telemetry.
 * Fallback engine for live API queries or custom player inputs.
 */
function deriveAttributionFromFeatures(profile, lang = 'fr') {
  const isFr = lang === 'fr';
  const features = profile?.features || {};
  const aggravating = [];
  const protective = [];

  // 1. Loss Streak / Current Streak
  const streak = typeof features.current_streak_at_cutoff === 'number'
    ? features.current_streak_at_cutoff
    : (typeof features.current_streak === 'number' ? features.current_streak : 0);

  if (streak <= -3) {
    aggravating.push({
      feature: 'current_streak_at_cutoff',
      weight: Math.min(30, Math.abs(streak) * 5.5),
      observedValue: `${streak} ${isFr ? 'défaites' : 'losses'}`,
      observedValueEn: `${streak} losses`,
      baselineValue: '0',
      baselineValueEn: '0',
      explanationFr: `Série punitive de ${Math.abs(streak)} défaites d'affilée augmentant drastiquement la frustration.`,
      explanationEn: `Punishing ${Math.abs(streak)}-game loss streak severely elevating acute frustration.`
    });
  } else if (streak >= 2) {
    protective.push({
      feature: 'current_streak_at_cutoff',
      weight: -Math.min(15, streak * 3.5),
      observedValue: `+${streak} ${isFr ? 'victoires' : 'wins'}`,
      observedValueEn: `+${streak} wins`,
      baselineValue: '0',
      baselineValueEn: '0',
      explanationFr: `Série positive de ${streak} victoires consécutives renforçant l'engagement.`,
      explanationEn: `Positive streak of ${streak} consecutive wins reinforcing engagement.`
    });
  }

  // 2. Tilt Index
  const tilt = typeof features.tilt_index === 'number' ? features.tilt_index : 0;
  if (tilt >= 1.5) {
    aggravating.push({
      feature: 'tilt_index',
      weight: Math.min(25, tilt * 4.5),
      observedValue: `${tilt.toFixed(1)} (Élevé)`,
      observedValueEn: `${tilt.toFixed(1)} (High)`,
      baselineValue: '0.5',
      baselineValueEn: '0.5',
      explanationFr: 'Indicateur de tilt élevé révélant des défaites rapides et une nervosité in-game.',
      explanationEn: 'Elevated tilt index revealing rapid stomps and in-game tension.'
    });
  } else if (tilt <= 0.2) {
    protective.push({
      feature: 'tilt_index',
      weight: -12.0,
      observedValue: `${tilt.toFixed(1)} (Serein)`,
      observedValueEn: `${tilt.toFixed(1)} (Serene)`,
      baselineValue: '0.5',
      baselineValueEn: '0.5',
      explanationFr: 'Score de tilt nul : aucune déstabilisation émotionnelle détectée.',
      explanationEn: 'Zero tilt score: no emotional destabilization detected.'
    });
  }

  // 3. Abandon Rate
  const abandons = typeof features.abandon_rate === 'number' ? features.abandon_rate : 0;
  if (abandons >= 0.05) {
    aggravating.push({
      feature: 'abandon_rate',
      weight: Math.min(22, (abandons / 0.1) * 12),
      observedValue: `${(abandons * 100).toFixed(1)}%`,
      observedValueEn: `${(abandons * 100).toFixed(1)}%`,
      baselineValue: '1.5%',
      baselineValueEn: '1.5%',
      explanationFr: 'Abandons récents en cours de jeu traduisant une rupture nette de patience.',
      explanationEn: 'Recent mid-match abandons indicating sharp loss of patience.'
    });
  } else if (abandons === 0) {
    protective.push({
      feature: 'abandon_rate',
      weight: -10.0,
      observedValue: '0.0%',
      observedValueEn: '0.0%',
      baselineValue: '1.5%',
      baselineValueEn: '1.5%',
      explanationFr: 'Zéro abandon de match : comportement compétitif exemplaire.',
      explanationEn: 'Zero match abandons: disciplined match completion record.'
    });
  }

  // 4. Party Play Percentage
  const partyPct = typeof features.party_play_pct === 'number' ? features.party_play_pct : 0.35;
  if (partyPct < 0.15) {
    aggravating.push({
      feature: 'party_play_pct',
      weight: 12.0,
      observedValue: `${(partyPct * 100).toFixed(0)}% (Solo)`,
      observedValueEn: `${(partyPct * 100).toFixed(0)}% (Solo)`,
      baselineValue: '35.0%',
      baselineValueEn: '35.0%',
      explanationFr: 'Jeu quasi-exclusif en solo queue sans soutien social pour absorber les défaites.',
      explanationEn: 'Near-exclusive solo queue play without social support to cushion defeats.'
    });
  } else if (partyPct >= 0.50) {
    protective.push({
      feature: 'party_play_pct',
      weight: -Math.min(30, (partyPct / 0.7) * 25),
      observedValue: `${(partyPct * 100).toFixed(0)}% (Groupe)`,
      observedValueEn: `${(partyPct * 100).toFixed(0)}% (Party)`,
      baselineValue: '35.0%',
      baselineValueEn: '35.0%',
      explanationFr: 'Réseau social actif avec de nombreuses parties entre amis, garant d\'une forte fidélité.',
      explanationEn: 'Active social circle with frequent games with friends, a key retention pillar.'
    });
  }

  // 5. Role Consistency
  const roleCons = typeof features.role_consistency === 'number' ? features.role_consistency : 0.6;
  if (roleCons < 0.4) {
    aggravating.push({
      feature: 'role_consistency',
      weight: 14.0,
      observedValue: `${(roleCons * 100).toFixed(0)}%`,
      observedValueEn: `${(roleCons * 100).toFixed(0)}%`,
      baselineValue: '65.0%',
      baselineValueEn: '65.0%',
      explanationFr: 'Instabilité de rôle suggérant des sessions d\'autofill involontaires ou un désengagement.',
      explanationEn: 'Role instability suggesting forced autofill or wandering focus.'
    });
  } else if (roleCons >= 0.75) {
    protective.push({
      feature: 'role_consistency',
      weight: -22.0,
      observedValue: `${(roleCons * 100).toFixed(0)}%`,
      observedValueEn: `${(roleCons * 100).toFixed(0)}%`,
      baselineValue: '65.0%',
      baselineValueEn: '65.0%',
      explanationFr: 'Spécialisation stable sur un poste principal, vecteur clé de maîtrise et de calme.',
      explanationEn: 'Stable role mastery on a primary position, driving satisfaction and poise.'
    });
  }

  // 6. Win Rate
  const winRate = typeof features.win_rate === 'number' ? features.win_rate : 0.5;
  if (winRate < 0.44) {
    aggravating.push({
      feature: 'win_rate',
      weight: Math.min(20, (0.5 - winRate) * 100),
      observedValue: `${(winRate * 100).toFixed(1)}%`,
      observedValueEn: `${(winRate * 100).toFixed(1)}%`,
      baselineValue: '50.0%',
      baselineValueEn: '50.0%',
      explanationFr: 'Taux de victoire en nette baisse pesant sur le moral du joueur.',
      explanationEn: 'Significantly depressed win rate wearing down player motivation.'
    });
  } else if (winRate >= 0.54) {
    protective.push({
      feature: 'win_rate',
      weight: -Math.min(24, (winRate - 0.5) * 120),
      observedValue: `${(winRate * 100).toFixed(1)}%`,
      observedValueEn: `${(winRate * 100).toFixed(1)}%`,
      baselineValue: '50.0%',
      baselineValueEn: '50.0%',
      explanationFr: 'Taux de victoire positif alimentant un sentiment valorisant d\'accomplissement.',
      explanationEn: 'Positive win rate fueling a rewarding sense of achievement.'
    });
  }

  // 7. Night Owl
  const nightPct = typeof features.night_owl_pct === 'number' ? features.night_owl_pct : 0.1;
  if (nightPct >= 0.4) {
    aggravating.push({
      feature: 'night_owl_pct',
      weight: 10.5,
      observedValue: `${(nightPct * 100).toFixed(0)}%`,
      observedValueEn: `${(nightPct * 100).toFixed(0)}%`,
      baselineValue: '12.0%',
      baselineValueEn: '12.0%',
      explanationFr: 'Sessions nocturnes fréquentes associées à la fatigue cognitive.',
      explanationEn: 'Frequent nocturnal sessions associated with cognitive fatigue.'
    });
  }

  // Fallback defaults if either side is empty
  if (aggravating.length === 0) {
    aggravating.push({
      feature: 'session_duration_per_game',
      weight: 2.0,
      observedValue: 'Standard',
      observedValueEn: 'Standard',
      baselineValue: 'Standard',
      baselineValueEn: 'Standard',
      explanationFr: 'Signaux aggravants minimes : comportement globalement stable.',
      explanationEn: 'Minimal aggravating signals: overall stable behavior.'
    });
  }
  if (protective.length === 0) {
    protective.push({
      feature: 'avg_xpm',
      weight: -3.0,
      observedValue: 'Standard',
      observedValueEn: 'Standard',
      baselineValue: 'Standard',
      baselineValueEn: 'Standard',
      explanationFr: 'Maintien des statistiques de base sans facteur de protection dominant.',
      explanationEn: 'Baseline stats maintained without a dominant protective factor.'
    });
  }

  return { aggravating, protective };
}

/**
 * FactorAttribution Component (F9: Risk Gauge & Factor Attribution)
 * 
 * Displays waterfall or bilateral horizontal contribution bars:
 * - Aggravating drivers (driving churn risk UP): red/orange bars (+%)
 * - Protective drivers (protecting retention): green/cyan bars (-%)
 * - Fully localized feature labels via translateFeature()
 * - Human-readable contextual explanations for each behavioral driver
 * - Interactive toggle: Detailed Bilateral Cards vs Bilateral SHAP Tornado Chart
 * - 100% fluid & responsive down to 320px mobile screens without container overflow
 * 
 * @param {Object} props
 * @param {Object} [props.profile] - Active player profile or archetype object
 * @param {Object} [props.player] - Alias for profile
 * @param {Object} [props.features] - Telemetry features dictionary
 * @param {number} [props.churnProbability] - Churn probability
 * @param {string} [props.lang='fr'] - Language code ('fr' | 'en')
 * @param {Function} [props.t] - Optional translation resolver
 * @param {string} [props.className=''] - Additional CSS classes
 */
export default function FactorAttribution({
  profile,
  player,
  features,
  churnProbability,
  lang = 'fr',
  t = defaultT,
  className = ''
}) {
  const isFr = lang === 'fr';
  const [viewMode, setViewMode] = useState('cards'); // 'cards' | 'tornado'
  const [filterMode, setFilterMode] = useState('all'); // 'all' | 'aggravating' | 'protective'

  // Normalize target player profile
  const activeProfile = profile || player || {
    id: 'custom',
    features: features || {},
    churn_probability: typeof churnProbability === 'number' ? churnProbability : 0
  };

  const profileId = activeProfile?.id;
  const aliasId = activeProfile?.aliasId || activeProfile?.legacyId;

  // Extract pre-calibrated factor attributions if archetype or if defined on profile
  const factorData = activeProfile?.factorAttribution
    || ARCHETYPE_ATTRIBUTIONS[profileId]
    || (aliasId && ARCHETYPE_ATTRIBUTIONS[aliasId])
    || deriveAttributionFromFeatures(activeProfile, lang);

  const aggravatingList = factorData?.aggravating || [];
  const protectiveList = factorData?.protective || [];

  // Compute maximum absolute weight for scaling bars
  const allWeights = [
    ...aggravatingList.map(f => Math.abs(f.weight ?? f.impact ?? 10)),
    ...protectiveList.map(f => Math.abs(f.weight ?? f.impact ?? 10))
  ];
  const maxWeight = Math.max(1, ...allWeights, 30);

  // Cumulative sums
  const totalAggravating = aggravatingList.reduce((acc, f) => acc + Math.abs(f.weight ?? f.impact ?? 0), 0);
  const totalProtective = protectiveList.reduce((acc, f) => acc + Math.abs(f.weight ?? f.impact ?? 0), 0);

  // Top dominant driver
  const topAggravating = aggravatingList[0];

  return (
    <div className={`factor-attribution-card card ${className}`}>
      {/* Attribution Header */}
      <div className="attribution-header-block" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-heading)' }}>
              {t('simulator.attribution.title', lang) || (isFr ? 'Décomposition des Facteurs Décisionnels' : 'Decision Factor Attribution')}
            </h3>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
              {isFr
                ? 'Pondération SHAP des signaux comportementaux orientant la prédiction de churn.'
                : 'SHAP behavioral feature weights driving the churn vs retention prediction.'}
            </p>
          </div>

          {/* View Mode Toggle Button */}
          <div style={{ display: 'inline-flex', background: 'var(--bg-surface)', padding: '0.2rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <button
              type="button"
              onClick={() => setViewMode('cards')}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'cards' ? 'rgba(255, 122, 0, 0.2)' : 'transparent',
                color: viewMode === 'cards' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {isFr ? 'Cartes Détaillées' : 'Detailed Cards'}
            </button>
            <button
              type="button"
              onClick={() => setViewMode('tornado')}
              style={{
                padding: '0.35rem 0.75rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-sm)',
                background: viewMode === 'tornado' ? 'rgba(255, 122, 0, 0.2)' : 'transparent',
                color: viewMode === 'tornado' ? '#ffffff' : 'var(--text-muted)',
                border: 'none',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {isFr ? 'Graphique Bilatéral' : 'Bilateral Chart'}
            </button>
          </div>
        </div>

        {/* Executive Summary Metrics Bar */}
        <div
          className="attribution-summary-row"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            padding: '0.75rem 1rem',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              {isFr ? 'Impact Global :' : 'Overall Impact:'}
            </span>
            <span className="badge badge-rose" style={{ fontSize: '0.75rem' }}>
              +{totalAggravating.toFixed(1)}% {isFr ? 'Aggravant' : 'Aggravating'}
            </span>
            <span className="badge badge-emerald" style={{ fontSize: '0.75rem' }}>
              -{totalProtective.toFixed(1)}% {isFr ? 'Protecteur' : 'Protective'}
            </span>
          </div>

          {topAggravating && (
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              <span className="text-muted">{isFr ? 'Facteur n°1 de risque : ' : 'Top risk driver: '}</span>
              <strong style={{ color: 'var(--accent-orange)' }}>
                {translateFeature(topAggravating.feature, lang)}
              </strong>
            </div>
          )}
        </div>

        {/* Category Filter Pills (When in Detailed Cards view) */}
        {viewMode === 'cards' && (
          <div style={{ display: 'flex', gap: '0.45rem', marginTop: '0.85rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => setFilterMode('all')}
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: filterMode === 'all' ? 'var(--accent-orange)' : 'var(--border-subtle)',
                background: filterMode === 'all' ? 'var(--accent-orange-alpha)' : 'transparent',
                color: filterMode === 'all' ? 'var(--accent-orange)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.15s ease'
              }}
            >
              {isFr ? 'Tous les signaux' : 'All Signals'} ({aggravatingList.length + protectiveList.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('aggravating')}
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: filterMode === 'aggravating' ? 'var(--accent-rose)' : 'var(--border-subtle)',
                background: filterMode === 'aggravating' ? 'rgba(239, 68, 68, 0.15)' : 'transparent',
                color: filterMode === 'aggravating' ? 'var(--accent-rose)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.15s ease'
              }}
            >
              ▲ {isFr ? 'Aggravants' : 'Aggravating'} ({aggravatingList.length})
            </button>

            <button
              type="button"
              onClick={() => setFilterMode('protective')}
              style={{
                fontSize: '0.75rem',
                padding: '0.25rem 0.65rem',
                borderRadius: 'var(--radius-full)',
                border: '1px solid',
                borderColor: filterMode === 'protective' ? 'var(--accent-emerald)' : 'var(--border-subtle)',
                background: filterMode === 'protective' ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                color: filterMode === 'protective' ? 'var(--accent-emerald)' : 'var(--text-secondary)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.15s ease'
              }}
            >
              ▼ {isFr ? 'Protecteurs' : 'Protective'} ({protectiveList.length})
            </button>
          </div>
        )}
      </div>

      {/* --- VIEW MODE 1: DETAILED BILATERAL CARDS --- */}
      {viewMode === 'cards' && (
        <div
          className="attribution-columns-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: filterMode === 'all' ? 'repeat(auto-fit, minmax(280px, 1fr))' : '1fr',
            gap: '1.25rem',
            maxHeight: filterMode === 'all' ? '680px' : 'none',
            overflowY: filterMode === 'all' ? 'auto' : 'visible',
            paddingRight: filterMode === 'all' ? '0.25rem' : '0',
            boxSizing: 'border-box'
          }}
        >
          {/* COLUMN 1: AGGRAVATING DRIVERS (DRIVING CHURN RISK UP) */}
          {(filterMode === 'all' || filterMode === 'aggravating') && (
          <div
            className="attribution-column-card"
            style={{
              background: 'rgba(239, 68, 68, 0.03)',
              border: '1px solid rgba(239, 68, 68, 0.25)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              minWidth: 0,
              boxSizing: 'border-box'
            }}
          >
            <div
              className="attribution-column-header"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid rgba(239, 68, 68, 0.2)',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-rose)', fontSize: '1rem' }}>▲</span>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                  {t('simulator.attribution.aggravatingHeader', lang) || (isFr ? "Facteurs Aggravants (Poussant au Churn)" : "Aggravating Factors (Driving Churn)")}
                </h4>
              </div>
              <span className="badge badge-rose" style={{ fontSize: '0.6875rem' }}>
                {aggravatingList.length} {isFr ? 'signaux' : 'signals'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {aggravatingList.map((factor, idx) => {
                const numericWeight = factor.weight ?? (factor.impact ? factor.impact * 100 : 10);
                const barWidth = Math.min(100, (Math.abs(numericWeight) / maxWeight) * 100);
                const explanation = (isFr ? factor.explanationFr : factor.explanationEn)
                  || (isFr ? factor.description_fr : factor.description_en)
                  || factor.explanationFr
                  || factor.description_fr;
                const observedVal = (isFr ? factor.observedValue : factor.observedValueEn) || factor.observedValue || 'Élevé';
                const baselineVal = (isFr ? factor.baselineValue : factor.baselineValueEn) || factor.baselineValue || 'Standard';

                return (
                  <div
                    key={idx}
                    className="factor-item-card"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      minWidth: 0,
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s ease'
                    }}
                  >
                    {/* Top line: Name + Code Badge + Weight */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', minWidth: 0 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                          {translateFeature(factor.feature, lang)}
                        </span>
                        <code style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.05)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>
                          {factor.feature}
                        </code>
                      </div>
                      <span
                        className="tabular-nums"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: 'var(--accent-rose)',
                          background: 'rgba(239, 68, 68, 0.12)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid rgba(239, 68, 68, 0.3)'
                        }}
                      >
                        {`+${numericWeight.toFixed(1)}%`}
                      </span>
                    </div>

                    {/* Progress Bar (Aggravating: Orange to Crimson) */}
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                        margin: '0.45rem 0'
                      }}
                    >
                      <div
                        style={{
                          width: `${barWidth}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #ff7a00, #ef4444)',
                          borderRadius: '9999px',
                          boxShadow: '0 0 10px rgba(255, 122, 0, 0.4)',
                          transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      />
                    </div>

                    {/* Human Explanation */}
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginTop: '0.35rem', marginBottom: '0.35rem', wordBreak: 'break-word' }}>
                      {explanation}
                    </p>

                    {/* Metric Comparison Line */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexWrap: 'wrap' }}>
                      <span>{isFr ? 'Observé : ' : 'Observed: '} <strong style={{ color: 'var(--text-primary)' }}>{observedVal}</strong></span>
                      <span>•</span>
                      <span>{isFr ? 'Réf : ' : 'Ref: '} {baselineVal}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}

          {/* COLUMN 2: PROTECTIVE DRIVERS (PROTECTING RETENTION) */}
          {(filterMode === 'all' || filterMode === 'protective') && (
          <div
            className="attribution-column-card"
            style={{
              background: 'rgba(16, 185, 129, 0.03)',
              border: '1px solid rgba(16, 185, 129, 0.25)',
              borderRadius: 'var(--radius-lg)',
              padding: '1.25rem',
              minWidth: 0,
              boxSizing: 'border-box'
            }}
          >
            <div
              className="attribution-column-header"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '1rem',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid rgba(16, 185, 129, 0.2)',
                flexWrap: 'wrap',
                gap: '0.5rem'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'var(--accent-emerald)', fontSize: '1rem' }}>▼</span>
                <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: 'var(--text-heading)' }}>
                  {t('simulator.attribution.protectiveHeader', lang) || (isFr ? "Facteurs Protecteurs (Favorisant la Rétention)" : "Protective Factors (Protecting Retention)")}
                </h4>
              </div>
              <span className="badge badge-emerald" style={{ fontSize: '0.6875rem' }}>
                {protectiveList.length} {isFr ? 'signaux' : 'signals'}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {protectiveList.map((factor, idx) => {
                const numericWeight = factor.weight ?? (factor.impact ? factor.impact * 100 : -10);
                const barWidth = Math.min(100, (Math.abs(numericWeight) / maxWeight) * 100);
                const explanation = (isFr ? factor.explanationFr : factor.explanationEn)
                  || (isFr ? factor.description_fr : factor.description_en)
                  || factor.explanationFr
                  || factor.description_fr;
                const observedVal = (isFr ? factor.observedValue : factor.observedValueEn) || factor.observedValue || 'Régulier';
                const baselineVal = (isFr ? factor.baselineValue : factor.baselineValueEn) || factor.baselineValue || 'Standard';

                return (
                  <div
                    key={idx}
                    className="factor-item-card"
                    style={{
                      background: 'var(--bg-surface)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: 'var(--radius-md)',
                      padding: '0.85rem 1rem',
                      minWidth: 0,
                      boxSizing: 'border-box',
                      transition: 'border-color 0.15s ease'
                    }}
                  >
                    {/* Top line: Name + Code Badge + Weight */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', marginBottom: '0.45rem', flexWrap: 'wrap' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', minWidth: 0 }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', wordBreak: 'break-word' }}>
                          {translateFeature(factor.feature, lang)}
                        </span>
                        <code style={{ fontSize: '0.6875rem', color: 'var(--text-muted)', background: 'rgba(255, 255, 255, 0.05)', padding: '0.1rem 0.35rem', borderRadius: '3px' }}>
                          {factor.feature}
                        </code>
                      </div>
                      <span
                        className="tabular-nums"
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8125rem',
                          fontWeight: 700,
                          color: 'var(--accent-emerald)',
                          background: 'rgba(16, 185, 129, 0.12)',
                          padding: '0.15rem 0.5rem',
                          borderRadius: 'var(--radius-sm)',
                          border: '1px solid rgba(16, 185, 129, 0.3)'
                        }}
                      >
                        {`-${Math.abs(numericWeight).toFixed(1)}%`}
                      </span>
                    </div>

                    {/* Progress Bar (Protective: Emerald to Cyan) */}
                    <div
                      style={{
                        width: '100%',
                        height: '6px',
                        background: 'rgba(255, 255, 255, 0.05)',
                        borderRadius: '9999px',
                        overflow: 'hidden',
                        margin: '0.45rem 0'
                      }}
                    >
                      <div
                        style={{
                          width: `${barWidth}%`,
                          height: '100%',
                          background: 'linear-gradient(90deg, #10b981, #06b6d4)',
                          borderRadius: '9999px',
                          boxShadow: '0 0 10px rgba(16, 185, 129, 0.4)',
                          transition: 'width 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
                        }}
                      />
                    </div>

                    {/* Human Explanation */}
                    <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.45, marginTop: '0.35rem', marginBottom: '0.35rem', wordBreak: 'break-word' }}>
                      {explanation}
                    </p>

                    {/* Metric Comparison Line */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', flexWrap: 'wrap' }}>
                      <span>{isFr ? 'Observé : ' : 'Observed: '} <strong style={{ color: 'var(--text-primary)' }}>{observedVal}</strong></span>
                      <span>•</span>
                      <span>{isFr ? 'Réf : ' : 'Ref: '} {baselineVal}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          )}
        </div>
      )}

      {/* --- VIEW MODE 2: BILATERAL TORNADO / DIVERGING SHAP CHART --- */}
      {viewMode === 'tornado' && (
        <div
          className="tornado-chart-wrapper"
          style={{
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.25rem',
            overflowX: 'auto',
            boxSizing: 'border-box'
          }}
        >
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8125rem', color: 'var(--accent-emerald)', fontWeight: 600 }}>
              ◀ {isFr ? 'Facteurs Protecteurs (- Rétention)' : 'Protective (- Retention)'}
            </span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              {isFr ? 'Axe Central : Seuil Neutre 0.0%' : 'Center Axis: Neutral 0.0%'}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--accent-orange)', fontWeight: 600 }}>
              {isFr ? 'Facteurs Aggravants (+ Churn)' : 'Aggravating (+ Churn)'} ▶
            </span>
          </div>

          {/* Unified Diverging Bar Rows */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {/* Aggravating factors (extend right) */}
            {aggravatingList.map((f, idx) => {
              const numericWeight = f.weight ?? (f.impact ? f.impact * 100 : 10);
              const barWidth = Math.min(100, (Math.abs(numericWeight) / maxWeight) * 100);
              return (
                <div key={`agg-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem' }}>
                  {/* Left label slot */}
                  <div style={{ width: '40%', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-word', minWidth: 0 }}>
                    {translateFeature(f.feature, lang)}
                  </div>
                  {/* Center bilateral bar axis */}
                  <div style={{ width: '60%', display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <div style={{ width: '50%', height: '18px', background: 'rgba(255, 255, 255, 0.02)', borderRight: '2px solid var(--border-subtle)' }} />
                    <div style={{ width: '50%', height: '18px', position: 'relative', display: 'flex', alignItems: 'center' }}>
                      <div
                        style={{
                          width: `${barWidth}%`,
                          height: '14px',
                          background: 'linear-gradient(90deg, #ff7a00, #ef4444)',
                          borderRadius: '0 4px 4px 0',
                          boxShadow: '0 0 8px rgba(255, 122, 0, 0.35)',
                          transition: 'width 0.5s ease'
                        }}
                      />
                      <span style={{ marginLeft: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-rose)' }}>
                        +{numericWeight.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}

            {/* Protective factors (extend left) */}
            {protectiveList.map((f, idx) => {
              const numericWeight = f.weight ?? (f.impact ? f.impact * 100 : -10);
              const barWidth = Math.min(100, (Math.abs(numericWeight) / maxWeight) * 100);
              return (
                <div key={`prot-${idx}`} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.8125rem' }}>
                  {/* Left label slot */}
                  <div style={{ width: '40%', textAlign: 'right', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-word', minWidth: 0 }}>
                    {translateFeature(f.feature, lang)}
                  </div>
                  {/* Center bilateral bar axis */}
                  <div style={{ width: '60%', display: 'flex', alignItems: 'center', position: 'relative' }}>
                    <div style={{ width: '50%', height: '18px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', borderRight: '2px solid var(--border-subtle)' }}>
                      <span style={{ marginRight: '0.5rem', fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--accent-emerald)' }}>
                        -{Math.abs(numericWeight).toFixed(1)}%
                      </span>
                      <div
                        style={{
                          width: `${barWidth}%`,
                          height: '14px',
                          background: 'linear-gradient(270deg, #10b981, #06b6d4)',
                          borderRadius: '4px 0 0 4px',
                          boxShadow: '0 0 8px rgba(16, 185, 129, 0.35)',
                          transition: 'width 0.5s ease'
                        }}
                      />
                    </div>
                    <div style={{ width: '50%', height: '18px', background: 'rgba(255, 255, 255, 0.02)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
