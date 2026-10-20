import React, { useEffect, useRef } from 'react';
import { useDictionary } from '../context/DictionaryContext';
import GlossaryTerm from './GlossaryTerm';

/**
 * AboutDotaModal Component
 * Editorial article explaining Dota 2 context, tilt/churn mechanics,
 * and project purpose with highlighted orange keywords and visual game figures.
 */
export default function AboutDotaModal({ lang = 'fr', t }) {
  const { isOpen, isAboutOpen, closeAboutModal, openDictionary } = useDictionary();
  const modalRef = useRef(null);
  const isFr = lang === 'fr';

  // Handle ESC key & scroll locking
  useEffect(() => {
    if (!isAboutOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isOpen) {
        closeAboutModal();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Focus on modal
    const focusTimer = setTimeout(() => {
      if (modalRef.current) {
        modalRef.current.focus();
      }
    }, 50);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
      clearTimeout(focusTimer);
    };
  }, [isAboutOpen, isOpen, closeAboutModal]);

  if (!isAboutOpen) return null;

  const handleOpenDict = () => {
    openDictionary('dota2');
  };

  const handleGoSimulator = () => {
    closeAboutModal();
    const el = document.querySelector('#archetypes') || document.querySelector('#simulator');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      className="about-modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget) closeAboutModal();
      }}
      role="presentation"
    >
      <div
        className="about-modal-dialog editorial-modal-dialog"
        role="dialog"
        aria-modal="true"
        aria-labelledby="about-modal-title"
        ref={modalRef}
        tabIndex={-1}
      >
        {/* Header Bar */}
        <div className="editorial-modal-header">
          <div className="editorial-modal-header-left">
            <span className="editorial-modal-eyebrow">
              {t('aboutModal.eyebrow', lang)}
            </span>
            <h2 id="about-modal-title" className="editorial-modal-title">
              <span className="title-light">{t('aboutModal.titleLight', lang)} </span>
              <span className="title-bold">{t('aboutModal.titleBold', lang)}</span>
            </h2>
          </div>
          <button
            type="button"
            className="editorial-modal-close"
            onClick={closeAboutModal}
            aria-label={t('aboutModal.closeAria', lang)}
          >
            ✕
          </button>
        </div>

        {/* Continuous Editorial Essay Body */}
        <div className="editorial-modal-body">
          <p className="editorial-modal-lead">
            {t('aboutModal.lead', lang)}
          </p>

          <div className="editorial-modal-tags" role="list">
            <span className="editorial-tag-pill" role="listitem">{t('aboutModal.tag1', lang)}</span>
            <span className="editorial-tag-pill" role="listitem">{t('aboutModal.tag2', lang)}</span>
            <span className="editorial-tag-pill" role="listitem">{t('aboutModal.tag3', lang)}</span>
            <span className="editorial-tag-pill" role="listitem">{t('aboutModal.tag4', lang)}</span>
          </div>

          <div className="editorial-modal-prose">
            {/* Paragraph 1: Dota 2 & Competitive Context */}
            {isFr ? (
              <p>
                Édité par <strong className="editorial-white">Valve Corporation</strong>, <GlossaryTerm termId="dota2">Dota 2</GlossaryTerm> est un jeu de stratégie d&apos;arène multijoueur (<strong className="editorial-orange">MOBA en 5 contre 5</strong>), considéré comme l&apos;un des titres les plus complexes et impitoyables de l&apos;histoire du jeu vidéo. Chaque partie oppose deux équipes de cinq joueurs sur une carte fermée pendant <strong className="editorial-orange">30 à 60 minutes</strong> avec pour objectif unique de détruire la forteresse ennemie (<strong className="editorial-white">l&apos;Ancien</strong>). Avec <strong className="editorial-orange">plus de 120 héros</strong> uniques, des centaines d&apos;objets et une micro-gestion de chaque seconde, la <strong className="editorial-white">charge cognitive</strong> est permanente. La victoire repose entièrement sur la <strong className="editorial-orange">coordination collective</strong> : si un seul coéquipier perd patience, commet des erreurs critiques ou abandonne en cours de partie, l&apos;expérience bascule rapidement dans une <strong className="editorial-orange">épreuve punitive et frustrante</strong>.
              </p>
            ) : (
              <p>
                Developed by <strong className="editorial-white">Valve Corporation</strong>, <GlossaryTerm termId="dota2">Dota 2</GlossaryTerm> is a competitive <strong className="editorial-orange">5v5 Multiplayer Online Battle Arena (MOBA)</strong>, widely acknowledged as one of the most mechanically demanding and unforgiving games in modern e-sports. Two five-player teams clash on a closed map for <strong className="editorial-orange">30 to 60 minutes</strong> with the sole objective of demolishing the opposing stronghold (<strong className="editorial-white">the Ancient</strong>). With <strong className="editorial-orange">over 120 distinct heroes</strong>, hundreds of items, and split-second tactical calculations, the <strong className="editorial-white">cognitive load</strong> is relentless. Victory relies entirely on <strong className="editorial-orange">team synergy</strong>: if a single teammate tilts, throws, or abandons the match, the game instantly degrades into a <strong className="editorial-orange">frustrating, punitive ordeal</strong>.
              </p>
            )}

            {/* Editorial Visual Figures (Game Artwork & In-Game 5v5 HUD) */}
            <div className="editorial-figures-grid">
              <figure className="editorial-figure">
                <div className="editorial-figure-img-wrap">
                  <img
                    src="./images/dota2_header.jpg"
                    alt={isFr ? "Univers et héros de Dota 2 par Valve" : "Dota 2 Heroes and Universe by Valve"}
                    loading="lazy"
                  />
                  <span className="editorial-figure-tag">FIG. 01 // ROSTER 120+ HÉROS</span>
                </div>
                <figcaption>
                  {isFr
                    ? "L'univers de Dota 2 : plus de 120 héros aux compétences asymétriques où la composition d'équipe dicte l'issue stratégique."
                    : "The Dota 2 universe: over 120 asymmetric heroes where team draft and synergy dictate strategic outcomes."}
                </figcaption>
              </figure>

              <figure className="editorial-figure">
                <div className="editorial-figure-img-wrap">
                  <img
                    src="./images/dota2_gameplay.jpg"
                    alt={isFr ? "Capture d'écran d'un combat d'équipe 5v5 dans Dota 2 avec mini-carte et interface" : "In-game 5v5 teamfight in Dota 2 showing minimap and HUD"}
                    loading="lazy"
                  />
                  <span className="editorial-figure-tag">FIG. 02 // TÉLÉMÉTRIE & HUD 5V5</span>
                </div>
                <figcaption>
                  {isFr
                    ? "Vue d'un affrontement en temps réel : gestion simultanée du positionnement, de l'économie (GPM/XPM), des temps de recharge et de la mini-carte."
                    : "Real-time teamfight view: simultaneous management of positioning, economy (GPM/XPM), spell cooldowns, and minimap vision."}
                </figcaption>
              </figure>
            </div>

            {/* Paragraph 2: Tilt & Churn Dynamics */}
            {isFr ? (
              <p>
                C&apos;est dans cette tension constante que s&apos;installe le <strong className="editorial-orange"><GlossaryTerm termId="tilt_index">tilt</GlossaryTerm></strong> — un état d&apos;<strong className="editorial-white">épuisement émotionnel</strong>, de rancœur et d&apos;agacement où le joueur perd sa lucidité. Après plusieurs <strong className="editorial-orange">défaites consécutives</strong> ou des altercations toxiques, beaucoup s&apos;enferment dans des <strong className="editorial-orange">sessions nocturnes compulsives</strong> dans l&apos;espoir illusoire de se refaire, amplifiant leur spirale négative. Vient alors le <strong className="editorial-white">« match de trop » (notre point d&apos;observation T)</strong> : le joueur quitte brutalement le jeu et n&apos;y revient plus pendant au moins <strong className="editorial-orange">14 jours</strong>, voire désinstalle définitivement son client. Ce départ, couramment appelé <strong className="editorial-orange"><GlossaryTerm termId="churn">churn</GlossaryTerm></strong>, ne survient pourtant jamais par hasard : il est invariablement précédé de <strong className="editorial-orange">signaux faibles télémétriques</strong> mesurables bien avant la rupture.
              </p>
            ) : (
              <p>
                Under this sustained pressure arises <strong className="editorial-orange"><GlossaryTerm termId="tilt_index">tilt</GlossaryTerm></strong> — a psychological state of <strong className="editorial-white">emotional depletion</strong>, frustration, and impaired judgement. Following <strong className="editorial-orange">consecutive loss streaks</strong> or toxic teammates, players frequently descend into <strong className="editorial-orange">compulsive late-night queues</strong> chasing revenge, compounding their negative spiral. Eventually comes the <strong className="editorial-white">breaking-point game (our cutoff observation point T)</strong>: the player abruptly quits and does not return for at least <strong className="editorial-orange">14 days</strong>, or uninstalls altogether. This departure, formally known as <strong className="editorial-orange"><GlossaryTerm termId="churn">churn</GlossaryTerm></strong>, is never random: it leaves distinctive, measurable <strong className="editorial-orange">behavioral telemetry footprints</strong> long before the final break occurs.
              </p>
            )}

            {/* Minimalist Unboxed Sequence Diagram */}
            <div className="editorial-sequence-strip" aria-label={isFr ? "Chaîne causale du décrochage" : "Churn causal sequence"}>
              <div className="seq-step">
                <span className="seq-num">01</span>
                <span className="seq-label">{isFr ? 'Pression 5v5 & Défaites' : '5v5 Pressure & Losses'}</span>
              </div>
              <span className="seq-arrow" aria-hidden="true">→</span>
              <div className="seq-step">
                <span className="seq-num">02</span>
                <span className="seq-label">{isFr ? 'Spirale de Tilt & Fatigue' : 'Tilt Spiral & Fatigue'}</span>
              </div>
              <span className="seq-arrow" aria-hidden="true">→</span>
              <div className="seq-step seq-step-alert">
                <span className="seq-num">03</span>
                <span className="seq-label">{isFr ? 'Point de Rupture (Match T)' : 'Breaking Point (Match T)'}</span>
              </div>
              <span className="seq-arrow" aria-hidden="true">→</span>
              <div className="seq-step seq-step-danger">
                <span className="seq-num">04</span>
                <span className="seq-label">{isFr ? 'Churn (Inactivité ≥ 14j)' : 'Churn (≥ 14d Inactivity)'}</span>
              </div>
            </div>

            {/* Paragraph 3: Business Value & Target Audience */}
            {isFr ? (
              <p>
                Ce projet vise à <strong className="editorial-orange">modéliser et détecter ces trajectoires de rupture</strong> avant qu&apos;elles ne deviennent irréversibles. Pour les <strong className="editorial-orange">éditeurs de jeux et les équipes LiveOps</strong>, anticiper l&apos;attrition permet de <strong className="editorial-white">protéger la rétention</strong> sans attendre la perte définitive de l&apos;utilisateur. Pour les concepteurs de <strong className="editorial-orange">matchmaking éthique</strong>, identifier un joueur en souffrance émotionnelle permet d&apos;éviter de le réinjecter dans des salons à haute tension et de lui proposer une pause ou une expérience adaptée, préservant ainsi la <strong className="editorial-white">santé de la communauté</strong>. Enfin, pour les <strong className="editorial-orange">recruteurs et ingénieurs en Machine Learning</strong>, cette étude constitue un cas d&apos;école de modélisation prédictive sous <strong className="editorial-orange">fort déséquilibre de classes</strong>, alliant télémétrie temps réel, rééquilibrage synthétique (<GlossaryTerm termId="smote">SMOTE</GlossaryTerm>) et explicabilité algorithmique (<GlossaryTerm termId="shap">SHAP</GlossaryTerm>).
              </p>
            ) : (
              <p>
                This project aims to <strong className="editorial-orange">detect and model these emotional inflection points</strong> before abandonment becomes irreversible. For <strong className="editorial-orange">video game studios and LiveOps teams</strong>, predicting disengagement enables <strong className="editorial-white">proactive retention interventions</strong> before customers are permanently lost. For <strong className="editorial-orange">ethical matchmaking architects</strong>, detecting emotional distress prevents queuing tilted players into toxic lobbies, guiding them toward healthy cooldown pauses and safeguarding <strong className="editorial-white">community wellbeing</strong>. Finally, for <strong className="editorial-orange">recruiters and ML practitioners</strong>, this study represents a production-grade benchmark of predictive modeling under <strong className="editorial-orange">severe class imbalance</strong>, combining telemetry pipelines, <GlossaryTerm termId="smote">SMOTE</GlossaryTerm> balancing, and <GlossaryTerm termId="shap">SHAP</GlossaryTerm> interpretability.
              </p>
            )}

            {/* Practical Purpose Section: Concrètement, à quoi ça sert ? */}
            <div className="editorial-purpose-box">
              <div className="editorial-purpose-header">
                <span className="editorial-purpose-badge">VALEUR OPÉRATIONNELLE</span>
                <h3 className="editorial-purpose-title">{t('aboutModal.purposeTitle', lang)}</h3>
              </div>

              <div className="editorial-purpose-grid">
                {/* Pillar 1: F2P Economics */}
                <div className="editorial-purpose-item">
                  <div className="editorial-purpose-bullet">
                    <span className="purpose-num">01</span>
                    <strong className="purpose-item-title">{t('aboutModal.purposePillar1Title', lang)}</strong>
                  </div>
                  <p className="purpose-item-text">{t('aboutModal.purposePillar1Desc', lang)}</p>
                </div>

                {/* Pillar 2: Mental Health & Matchmaking */}
                <div className="editorial-purpose-item">
                  <div className="editorial-purpose-bullet">
                    <span className="purpose-num">02</span>
                    <strong className="purpose-item-title">{t('aboutModal.purposePillar2Title', lang)}</strong>
                  </div>
                  <p className="purpose-item-text">{t('aboutModal.purposePillar2Desc', lang)}</p>
                </div>

                {/* Pillar 3: Applied ML */}
                <div className="editorial-purpose-item">
                  <div className="editorial-purpose-bullet">
                    <span className="purpose-num">03</span>
                    <strong className="purpose-item-title">{t('aboutModal.purposePillar3Title', lang)}</strong>
                  </div>
                  <p className="purpose-item-text">{t('aboutModal.purposePillar3Desc', lang)}</p>
                </div>
              </div>
            </div>
          </div>

          <blockquote className="editorial-modal-quote">
            <p>{t('aboutModal.quote', lang)}</p>
          </blockquote>
        </div>

        {/* Clean Editorial Footer Actions */}
        <div className="editorial-modal-footer">
          <div className="editorial-modal-actions-left">
            <button
              type="button"
              className="editorial-link-btn"
              onClick={handleOpenDict}
            >
              {t('aboutModal.actionLexicon', lang)}
            </button>
            <button
              type="button"
              className="editorial-link-btn"
              onClick={handleGoSimulator}
            >
              {t('aboutModal.actionSimulator', lang)}
            </button>
          </div>
          <button
            type="button"
            className="editorial-close-btn-text"
            onClick={closeAboutModal}
          >
            {t('aboutModal.actionClose', lang)}
          </button>
        </div>
      </div>
    </div>
  );
}
