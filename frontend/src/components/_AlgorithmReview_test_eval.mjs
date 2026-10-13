import { useState } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export default function AlgorithmReview({ lang = "fr", t = {}, mlStatus = null }) {
	const ar = t?.algorithm_review || {};
	// État du widget comparatif interactif
	const [selectedParadigm, setSelectedParadigm] = useState("xgboost");
	const [activeMetricTab, setActiveMetricTab] = useState("all");
	// Données multidimensionnelles pour les architectures comparées
	const paradigmData = {
		xgboost: {
			id: "xgboost",
			name: ar.comparisonWidget?.tabXgboost || (lang === "fr" ? "XGBoost Comportemental (V6 Notre Candidat)" : "Behavioral XGBoost (V6 Candidate)"),
			tag: ar.comparisonWidget?.badgeCurrent || (lang === "fr" ? "CANDIDAT ACTUEL" : "CURRENT CANDIDATE"),
			tagColor: "#10b981",
			target: lang === "fr" ? "Cible binaire fixe : Inactivité > 14 jours" : "Fixed binary label: Inactivity > 14 days",
			censoring: lang === "fr" ? "Ignorée / Tronquée (Biais de censure)" : "Ignored / Filtered at cutoff (Censoring bias)",
			latency: "< 5 ms (Inférence tabulaire ultra-rapide)",
			infra: lang === "fr" ? "Modérée (Nécessite un Feature Store Redis)" : "Moderate (Requires Redis Feature Store)",
			fairness: lang === "fr" ? "Totale (Outil diagnostic, zéro trucage)" : "Clean (Diagnostic only, zero rigging)",
			scores: {
				signalRigor: 78,
				inferenceSpeed: 95,
				fairnessScore: 92,
				pipelineComplexity: 80,
				actionability: 88
			},
			formula: "P(y = 1 | x) = σ( ∑_{m=1}^M f_m(x) )  avec seuil optimisé θ* = 0.36",
			summary: lang === "fr" ? "Notre modèle V6 actuel s'appuie sur des arbres boostés par gradient (HistGradientBoosting) entraînés sur 45 variables comportementales rigoureusement purgées. Il fournit une inférence tabulaire instantanée (< 5 ms) et un excellent rappel de 85%, mais demeure prisonnier d'un horizon binaire rigide de 14 jours." : "Our current V6 model uses gradient-boosted decision trees (HistGradientBoosting) trained on 45 purged behavioral features. It provides ultra-fast tabular inference (< 5 ms) and 85% recall, but remains constrained by an arbitrary 14-day binary horizon."
		},
		survival: {
			id: "survival",
			name: ar.comparisonWidget?.tabSurvival || (lang === "fr" ? "Analyse de Survie (DeepSurv / Cox PH)" : "Survival Analysis (DeepSurv / Cox PH)"),
			tag: ar.comparisonWidget?.badgeWinner || (lang === "fr" ? "RECOMMANDÉ STUDIO" : "STUDIO RECOMMENDED"),
			tagColor: "#06b6d4",
			target: lang === "fr" ? "Temps continu jusqu’au retour T ∈ [0, ∞)" : "Continuous time-to-event T ∈ [0, ∞)",
			censoring: lang === "fr" ? "Modélisée rigoureusement par vraisemblance partielle" : "Mathematically modeled via Partial Likelihood",
			latency: "< 10 ms (Évaluation du risque instantané)",
			infra: lang === "fr" ? "Élevée (Pipeline continu temps-événement)" : "High (Continuous time-to-event pipeline)",
			fairness: lang === "fr" ? "Inattaquable (Estimation non-biaisée de la LTV)" : "Clean (Unbiased LTV & retention curves)",
			scores: {
				signalRigor: 96,
				inferenceSpeed: 88,
				fairnessScore: 95,
				pipelineComplexity: 65,
				actionability: 94
			},
			formula: "h(t | x) = h_0(t) · exp( g_θ(x) )  ⟹  S(t | x) = exp( - ∫_0^t h(u|x) du )",
			summary: lang === "fr" ? "Le standard d'or de l'industrie du jeu vidéo (King, EA, Tencent). En intégrant les données censurées à droite via le modèle de Cox ou des réseaux profonds DeepSurv, cette approche prédit la probabilité continue de survie à tout horizon (3j, 7j, 30j, 90j) et permet le calcul direct de la Valeur Vie Joueur (LTV)." : "The industry gold standard (King, EA, Tencent). By incorporating right-censored players mathematically via Cox models or DeepSurv neural networks, this approach predicts continuous survival curves S(t) across all horizons (3d, 7d, 30d, 90d) and estimates expected Player Lifetime Value."
		},
		eomm: {
			id: "eomm",
			name: ar.comparisonWidget?.tabEomm || "EA EOMM (Chen et al. 2017)",
			tag: ar.comparisonWidget?.badgeWarning || (lang === "fr" ? "DANGER ÉTHIQUE" : "ETHICAL HAZARD"),
			tagColor: "#ef4444",
			target: lang === "fr" ? "P(Churn | Issue du match {Victoire, Défaite})" : "P(Churn | Match outcome {Win, Loss})",
			censoring: lang === "fr" ? "Court terme (abandon immédiat après session)" : "Short-term (Immediate post-session drop)",
			latency: "35 - 120 ms (Optimisation de graphe biparti)",
			infra: lang === "fr" ? "Très complexe (Couplage direct matchmaker)" : "Highly complex (Direct matchmaker graph solver)",
			fairness: lang === "fr" ? "Prédatrice (Trucage actif des victoires/défaites)" : "Predatory (Actively rigs match outcomes)",
			scores: {
				signalRigor: 85,
				inferenceSpeed: 55,
				fairnessScore: 20,
				pipelineComplexity: 40,
				actionability: 92
			},
			formula: "min_X ∑_{m ∈ M} ∑_{i ∈ m} ∑_{o} P(m → o) · P(Churn_i | s_i, o)",
			summary: lang === "fr" ? "Le framework d'Electronic Arts maximise la rétention globale en sacrifiant délibérément l'équité compétitive. Le système offre des victoires garanties aux joueurs en détresse et pénalise les joueurs sereins. Rejeté par notre étude en raison du risque moral et de la destruction de l'intégrité sportive." : "Electronic Arts' retention framework maximizes engagement by explicitly abandoning 50/50 competitive fairness. The matchmaker pairs tilted players into artificially favored matches while burdening resilient players. Strictly rejected in our studio roadmap due to moral hazard and destruction of competitive trust."
		},
		sequential: {
			id: "sequential",
			name: ar.comparisonWidget?.tabSequential || (lang === "fr" ? "Télémétrie Séquentielle (LSTM / Transformers)" : "Sequential Telemetry (LSTM / Transformers)"),
			tag: lang === "fr" ? "RECHERCHE AVANCÉE" : "ADVANCED R&D",
			tagColor: "#a855f7",
			target: lang === "fr" ? "Trajectoire séquentielle d’événements en jeu" : "Sequential event trajectory over time",
			censoring: lang === "fr" ? "Masquage séquentiel / Perte temporelle" : "Sequence masking / Dynamic hazard loss",
			latency: "25 - 80 ms (Dépendance forte GPU)",
			infra: lang === "fr" ? "Très lourde (Cluster d’inférence PyTorch/Triton)" : "Heavy (Requires GPU Triton inference servers)",
			fairness: lang === "fr" ? "Saine (Détection micro-patterns sans trucage)" : "Clean (Early micro-pattern detection)",
			scores: {
				signalRigor: 94,
				inferenceSpeed: 45,
				fairnessScore: 92,
				pipelineComplexity: 35,
				actionability: 82
			},
			formula: "h_t = LSTM(x_t, h_{t-1}),  c = ∑_t α_t h_t,  ŷ = Softmax(W c + b)",
			summary: lang === "fr" ? "Modélisation séquentielle sur flux de combat brut (Kim et al. 2017). Analyse la trajectoire match par match sans agrégation manuelle et repère les micro-ralentissements de rythme 3 à 5 sessions avant l'abandon. Cependant, le coût d'inférence GPU est trop lourd pour le matchmaking en temps réel." : "Sequential deep learning on raw telemetry event logs (Kim et al. 2017). Analyzes intra-match sequences without manual rolling windows, capturing micro-inflections 3-5 sessions prior to departure. However, GPU inference overhead is too high for sub-100ms matchmaking SLAs."
		}
	};
	const currentParadigm = paradigmData[selectedParadigm] || paradigmData.xgboost;
	// Données de la table de comparaison de la littérature
	const literatureRows = [
		{
			model: "EA EOMM",
			source: "Chen et al. (ACM WWW 2017)",
			doi: "10.1145/3038912.3052559",
			paradigm: lang === "fr" ? "Optimisation de graphe biparti de rétention" : "Bipartite graph retention optimization",
			strengths: lang === "fr" ? "Preuve mathématique de maximisation de l'engagement" : "Mathematical proof of engagement maximization",
			limitations: lang === "fr" ? "Brise l'intégrité compétitive, crée la paranoïa 'loser's queue'" : "Destroys competitive trust, creates 'loser's queue' paranoia",
			verdict: lang === "fr" ? "REJETÉ (Danger éthique)" : "REJECTED (Ethical hazard)",
			badgeClass: "badge-glow-red"
		},
		{
			model: "Valve TrueSkill & MMR",
			source: "Herbrich et al. (NIPS 2006)",
			doi: "NIPS 2006 (Valve Dev Blogs)",
			paradigm: lang === "fr" ? "Inférence bayésienne gaussienne (μ, σ²)" : "Bayesian Gaussian skill inference (μ, σ²)",
			strengths: lang === "fr" ? "Équité 50/50 incorruptible, isolation orthogonale du comportement" : "Strict 50/50 fairness, orthogonal conduct isolation",
			limitations: lang === "fr" ? "Ne réagit pas au tilt individuel ou aux séries de défaites" : "Blind to tilt escalation or consecutive defeat spirals",
			verdict: lang === "fr" ? "STANDARD INDUSTRIEL" : "INDUSTRY BENCHMARK",
			badgeClass: "badge-glow-green"
		},
		{
			model: "Riot Tilt Dynamics",
			source: "Lin et al. (GDC 2013-2015)",
			doi: "GDC Player Dynamics Series",
			paradigm: lang === "fr" ? "Télémétrie comportementale & analyse de séries" : "Behavioral telemetry & streak analytics",
			strengths: lang === "fr" ? "Validation empirique du churn exponentiel après 3 défaites (>65%)" : "Empirical proof of exponential loss-streak churn (>65%)",
			limitations: lang === "fr" ? "Étude centrée sur l'analyse sans moteur de matchmaking unifié" : "Focused on reporting rather than unified matchmaker engine",
			verdict: lang === "fr" ? "BASE DE NOS POLITIQUES" : "POLICY FOUNDATION",
			badgeClass: "badge-glow-cyan"
		},
		{
			model: "Survival Ensembles",
			source: "Periáñez et al. (IEEE CIG 2016)",
			doi: "10.1109/CIG.2016.7860434",
			paradigm: lang === "fr" ? "Forêts de survie & temps-événement continu" : "Random Survival Forests & continuous time-to-event",
			strengths: lang === "fr" ? "Intégration rigoureuse de la censure à droite, estimation continue LTV" : "Rigorous right-censoring handling, continuous LTV estimation",
			limitations: lang === "fr" ? "Complexité d'entraînement supérieure aux arbres standards" : "Higher training complexity than standard boosted trees",
			verdict: lang === "fr" ? "PROCHAINE ÉVOLUTION (P2)" : "NEXT MILESTONE (P2)",
			badgeClass: "badge-glow-green"
		},
		{
			model: "Sequential Deep Learning",
			source: "Kim et al. (PLOS ONE 2017)",
			doi: "10.1371/journal.pone.0180735",
			paradigm: lang === "fr" ? "LSTM séquentiel sur flux de combat" : "Sequential LSTM on match combat logs",
			strengths: lang === "fr" ? "Détection fine des micro-ralentissements 3 à 5 sessions avant départ" : "Detects subtle activity drops 3-5 sessions before churning",
			limitations: lang === "fr" ? "Inférence GPU trop lourde pour le SLA sub-200ms du matchmaker" : "Heavy GPU inference overhead incompatible with <200ms SLA",
			verdict: lang === "fr" ? "R&D LONG TERME" : "LONG-TERM R&D",
			badgeClass: "badge-glow-cyan"
		},
		{
			model: "V6 XGBoost (Candidat)",
			source: "Notre Équipe (Octobre 2026)",
			doi: "Dota 2 Churn Lab",
			paradigm: lang === "fr" ? "HistGradientBoosting tabulaire sur 45 variables purgées" : "Tabular HistGradientBoosting on 45 purged features",
			strengths: lang === "fr" ? "PR-AUC 79.3%, rappel 85%, inférence tabulaire < 5 ms, zéro fuite" : "PR-AUC 79.3%, recall 85%, <5ms inference, zero leaks",
			limitations: lang === "fr" ? "Seuil binaire 14j rigide, angle mort cold-start (N < 20)" : "Rigid 14-day cutoff, cold-start blind spot (N < 20)",
			verdict: lang === "fr" ? "CANDIDAT ACTUEL PROD" : "CURRENT PROD CANDIDATE",
			badgeClass: "badge-glow-green"
		}
	];
	return /* @__PURE__ */ _jsxs("div", {
		className: "academic-report-container",
		style: {
			padding: "8px 0",
			animation: "fadeIn 0.3s ease-in"
		},
		children: [
			/* @__PURE__ */ _jsxs("div", {
				className: "report-section-card",
				style: {
					background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(6, 8, 13, 0.95) 100%)",
					borderColor: "rgba(16, 185, 129, 0.25)"
				},
				children: [
					/* @__PURE__ */ _jsx("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-start",
							flexWrap: "wrap",
							gap: "16px",
							marginBottom: "16px"
						},
						children: /* @__PURE__ */ _jsxs("div", { children: [
							/* @__PURE__ */ _jsxs("div", {
								style: {
									display: "inline-flex",
									alignItems: "center",
									gap: "8px",
									marginBottom: "10px"
								},
								children: [/* @__PURE__ */ _jsx("span", {
									className: "badge-glow-green",
									style: {
										fontSize: "0.8rem",
										fontWeight: "700",
										letterSpacing: "0.05em"
									},
									children: ar.header?.badge || "AUDIT OFFICIEL V6.0 — GRADE B+"
								}), /* @__PURE__ */ _jsx("span", {
									style: {
										fontSize: "0.8rem",
										color: "var(--color-text-secondary)"
									},
									children: lang === "fr" ? "• Évaluation Senior Data Science & Systèmes" : "• Senior Data Science & Systems Audit"
								})]
							}),
							/* @__PURE__ */ _jsx("h2", {
								className: "glow-text-green",
								style: {
									fontSize: "1.85rem",
									margin: "0 0 10px 0",
									fontFamily: "var(--font-heading)"
								},
								children: ar.header?.title || (lang === "fr" ? "Revue Critique & Audit Académique de l'Algorithme" : "Critical Review & Academic Audit")
							}),
							/* @__PURE__ */ _jsx("p", {
								className: "report-para",
								style: {
									maxWidth: "1000px",
									margin: 0
								},
								children: ar.header?.subtitle || (lang === "fr" ? "Audit approfondi de niveau Lead Data Scientist & Game Systems évaluant la validité méthodologique du modèle V6 face à l'état de l'art (EA EOMM, Valve TrueSkill, Riot Games), les contraintes de déploiement en studio AAA, et formulation de politiques d'équilibrage non-prédatrices." : "In-depth Lead Data Scientist & Game Systems audit evaluating the methodological validity of the V6 model against SOTA benchmarks (EA EOMM, Valve TrueSkill, Riot Games), AAA studio deployment bottlenecks, and formulation of non-punitive rebalancing policies.")
							})
						] })
					}),
					/* @__PURE__ */ _jsxs("div", {
						className: "report-meta-box",
						style: {
							marginTop: "20px",
							borderColor: "rgba(16, 185, 129, 0.15)"
						},
						children: [
							/* @__PURE__ */ _jsxs("div", {
								className: "meta-field",
								children: [/* @__PURE__ */ _jsx("span", {
									className: "meta-label",
									children: lang === "fr" ? "Date d’Audit" : "Audit Date"
								}), /* @__PURE__ */ _jsx("span", {
									className: "meta-value",
									children: ar.header?.metaAuditDate || "8 Octobre 2026"
								})]
							}),
							/* @__PURE__ */ _jsxs("div", {
								className: "meta-field",
								children: [/* @__PURE__ */ _jsx("span", {
									className: "meta-label",
									children: lang === "fr" ? "Modèle Candidat" : "Production Candidate"
								}), /* @__PURE__ */ _jsx("span", {
									className: "meta-value",
									style: { color: "var(--accent-emerald)" },
									children: mlStatus?.best_model_name ? `${mlStatus.best_model_name} (V6)` : ar.header?.metaCandidate || "HistGradientBoosting + SMOTE"
								})]
							}),
							/* @__PURE__ */ _jsxs("div", {
								className: "meta-field",
								children: [/* @__PURE__ */ _jsx("span", {
									className: "meta-label",
									children: lang === "fr" ? "Échantillon Filtré" : "Analysis Sample"
								}), /* @__PURE__ */ _jsx("span", {
									className: "meta-value",
									children: mlStatus?.dataset_size ? `${mlStatus.dataset_size.toLocaleString()} ${lang === "fr" ? "joueurs" : "players"}` : ar.header?.metaDataset || "16 981 joueurs (N=20)"
								})]
							}),
							/* @__PURE__ */ _jsxs("div", {
								className: "meta-field",
								children: [/* @__PURE__ */ _jsx("span", {
									className: "meta-label",
									children: lang === "fr" ? "PR-AUC Validé" : "Verified PR-AUC"
								}), /* @__PURE__ */ _jsx("span", {
									className: "meta-value glow-text-green",
									children: mlStatus?.pr_auc ? `${(mlStatus.pr_auc * 100).toFixed(2)}%` : ar.header?.metaPrAuc || "79.31% (θ* = 0.36)"
								})]
							}),
							/* @__PURE__ */ _jsxs("div", {
								className: "meta-field",
								children: [/* @__PURE__ */ _jsx("span", {
									className: "meta-label",
									children: lang === "fr" ? "Rappel Churners" : "Churner Recall"
								}), /* @__PURE__ */ _jsx("span", {
									className: "meta-value glow-text-cyan",
									children: mlStatus?.recall ? `${(mlStatus.recall * 100).toFixed(1)}%` : ar.header?.metaRecall || "85.00%"
								})]
							})
						]
					}),
					/* @__PURE__ */ _jsxs("div", {
						style: { marginTop: "28px" },
						children: [/* @__PURE__ */ _jsxs("h3", {
							style: {
								fontSize: "1.15rem",
								color: "white",
								marginBottom: "16px",
								display: "flex",
								alignItems: "center",
								gap: "8px"
							},
							children: [
								/* @__PURE__ */ _jsx("span", { children: "📊" }),
								" ",
								ar.scorecard?.title || (lang === "fr" ? "Grille d’Évaluation Multicritère du Studio" : "Studio Multicriteria Scorecard")
							]
						}), /* @__PURE__ */ _jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
								gap: "16px"
							},
							children: [
								/* @__PURE__ */ _jsxs("div", {
									className: "glass-card",
									style: {
										padding: "20px",
										borderLeft: "4px solid var(--accent-emerald)",
										position: "relative"
									},
									children: [
										/* @__PURE__ */ _jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												marginBottom: "12px"
											},
											children: [/* @__PURE__ */ _jsx("span", {
												style: {
													fontSize: "0.85rem",
													fontWeight: "700",
													color: "var(--color-text-secondary)",
													textTransform: "uppercase"
												},
												children: ar.scorecard?.validityTitle || (lang === "fr" ? "Validité Algorithmique" : "Algorithmic Validity")
											}), /* @__PURE__ */ _jsx("span", {
												className: "badge-glow-green",
												style: {
													fontSize: "1.15rem",
													fontWeight: "800",
													padding: "2px 10px"
												},
												children: ar.scorecard?.validityGrade || "B+"
											})]
										}),
										/* @__PURE__ */ _jsx("div", {
											style: {
												fontSize: "1.3rem",
												fontWeight: "800",
												color: "white",
												marginBottom: "6px"
											},
											children: ar.scorecard?.validityScore || "84 / 100"
										}),
										/* @__PURE__ */ _jsx("p", {
											style: {
												fontSize: "0.85rem",
												color: "var(--color-text-secondary)",
												lineHeight: "1.45",
												margin: "0 0 12px 0"
											},
											children: ar.scorecard?.validityDesc
										}),
										/* @__PURE__ */ _jsx("div", {
											style: {
												fontSize: "0.75rem",
												fontWeight: "600",
												color: "var(--accent-emerald)",
												background: "rgba(16, 185, 129, 0.08)",
												padding: "6px 10px",
												borderRadius: "6px"
											},
											children: ar.scorecard?.validityKeyMetric
										})
									]
								}),
								/* @__PURE__ */ _jsxs("div", {
									className: "glass-card",
									style: {
										padding: "20px",
										borderLeft: "4px solid var(--accent-cyan)",
										position: "relative"
									},
									children: [
										/* @__PURE__ */ _jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												marginBottom: "12px"
											},
											children: [/* @__PURE__ */ _jsx("span", {
												style: {
													fontSize: "0.85rem",
													fontWeight: "700",
													color: "var(--color-text-secondary)",
													textTransform: "uppercase"
												},
												children: ar.scorecard?.readinessTitle || (lang === "fr" ? "Maturité Production" : "Production Readiness")
											}), /* @__PURE__ */ _jsx("span", {
												className: "badge-glow-cyan",
												style: {
													fontSize: "1.15rem",
													fontWeight: "800",
													padding: "2px 10px"
												},
												children: ar.scorecard?.readinessGrade || "C+"
											})]
										}),
										/* @__PURE__ */ _jsx("div", {
											style: {
												fontSize: "1.3rem",
												fontWeight: "800",
												color: "white",
												marginBottom: "6px"
											},
											children: ar.scorecard?.readinessScore || "62 / 100"
										}),
										/* @__PURE__ */ _jsx("p", {
											style: {
												fontSize: "0.85rem",
												color: "var(--color-text-secondary)",
												lineHeight: "1.45",
												margin: "0 0 12px 0"
											},
											children: ar.scorecard?.readinessDesc
										}),
										/* @__PURE__ */ _jsx("div", {
											style: {
												fontSize: "0.75rem",
												fontWeight: "600",
												color: "var(--accent-cyan)",
												background: "rgba(6, 182, 212, 0.08)",
												padding: "6px 10px",
												borderRadius: "6px"
											},
											children: ar.scorecard?.readinessKeyMetric
										})
									]
								}),
								/* @__PURE__ */ _jsxs("div", {
									className: "glass-card",
									style: {
										padding: "20px",
										borderLeft: "4px solid #3b82f6",
										position: "relative"
									},
									children: [
										/* @__PURE__ */ _jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												marginBottom: "12px"
											},
											children: [/* @__PURE__ */ _jsx("span", {
												style: {
													fontSize: "0.85rem",
													fontWeight: "700",
													color: "var(--color-text-secondary)",
													textTransform: "uppercase"
												},
												children: ar.scorecard?.actionabilityTitle || (lang === "fr" ? "Utilité Game Design" : "Game Design Utility")
											}), /* @__PURE__ */ _jsx("span", {
												className: "badge-glow-green",
												style: {
													fontSize: "1.15rem",
													fontWeight: "800",
													padding: "2px 10px",
													borderColor: "#3b82f6",
													color: "#60a5fa"
												},
												children: ar.scorecard?.actionabilityGrade || "A-"
											})]
										}),
										/* @__PURE__ */ _jsx("div", {
											style: {
												fontSize: "1.3rem",
												fontWeight: "800",
												color: "white",
												marginBottom: "6px"
											},
											children: ar.scorecard?.actionabilityScore || "90 / 100"
										}),
										/* @__PURE__ */ _jsx("p", {
											style: {
												fontSize: "0.85rem",
												color: "var(--color-text-secondary)",
												lineHeight: "1.45",
												margin: "0 0 12px 0"
											},
											children: ar.scorecard?.actionabilityDesc
										}),
										/* @__PURE__ */ _jsx("div", {
											style: {
												fontSize: "0.75rem",
												fontWeight: "600",
												color: "#60a5fa",
												background: "rgba(59, 130, 246, 0.08)",
												padding: "6px 10px",
												borderRadius: "6px"
											},
											children: ar.scorecard?.actionabilityKeyMetric
										})
									]
								}),
								/* @__PURE__ */ _jsxs("div", {
									className: "glass-card",
									style: {
										padding: "20px",
										borderLeft: "4px solid #10b981",
										position: "relative"
									},
									children: [
										/* @__PURE__ */ _jsxs("div", {
											style: {
												display: "flex",
												justifyContent: "space-between",
												alignItems: "center",
												marginBottom: "12px"
											},
											children: [/* @__PURE__ */ _jsx("span", {
												style: {
													fontSize: "0.85rem",
													fontWeight: "700",
													color: "var(--color-text-secondary)",
													textTransform: "uppercase"
												},
												children: ar.scorecard?.ethicsTitle || (lang === "fr" ? "Intégrité Éthique" : "Ethical Integrity")
											}), /* @__PURE__ */ _jsx("span", {
												className: "badge-glow-green",
												style: {
													fontSize: "1.15rem",
													fontWeight: "800",
													padding: "2px 10px"
												},
												children: ar.scorecard?.ethicsGrade || "A"
											})]
										}),
										/* @__PURE__ */ _jsx("div", {
											style: {
												fontSize: "1.3rem",
												fontWeight: "800",
												color: "white",
												marginBottom: "6px"
											},
											children: ar.scorecard?.ethicsScore || "95 / 100"
										}),
										/* @__PURE__ */ _jsx("p", {
											style: {
												fontSize: "0.85rem",
												color: "var(--color-text-secondary)",
												lineHeight: "1.45",
												margin: "0 0 12px 0"
											},
											children: ar.scorecard?.ethicsDesc
										}),
										/* @__PURE__ */ _jsx("div", {
											style: {
												fontSize: "0.75rem",
												fontWeight: "600",
												color: "var(--accent-emerald)",
												background: "rgba(16, 185, 129, 0.08)",
												padding: "6px 10px",
												borderRadius: "6px"
											},
											children: ar.scorecard?.ethicsKeyMetric
										})
									]
								})
							]
						})]
					})
				]
			}),
			/* @__PURE__ */ _jsxs("div", {
				className: "report-section-card",
				children: [
					/* @__PURE__ */ _jsxs("h3", {
						className: "report-section-title",
						children: [
							/* @__PURE__ */ _jsx("span", { children: "R1" }),
							" ",
							ar.literature?.title || (lang === "fr" ? "Confrontation à l’État de l’Art & Benchmarks Académiques" : "Literature Benchmarks")
						]
					}),
					/* @__PURE__ */ _jsx("p", {
						className: "report-para",
						children: ar.literature?.intro
					}),
					/* @__PURE__ */ _jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "20px",
							marginTop: "16px"
						},
						children: [
							/* @__PURE__ */ _jsxs("div", {
								style: {
									background: "rgba(239, 68, 68, 0.03)",
									border: "1px solid rgba(239, 68, 68, 0.15)",
									borderRadius: "12px",
									padding: "20px"
								},
								children: [
									/* @__PURE__ */ _jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "flex-start",
											flexWrap: "wrap",
											gap: "10px",
											marginBottom: "8px"
										},
										children: [/* @__PURE__ */ _jsx("h4", {
											style: {
												color: "#f87171",
												margin: 0,
												fontSize: "1.1rem"
											},
											children: ar.literature?.eaTitle
										}), /* @__PURE__ */ _jsx("span", {
											className: "badge-glow-red",
											style: { fontSize: "0.75rem" },
											children: ar.literature?.eaDoi
										})]
									}),
									/* @__PURE__ */ _jsx("div", {
										style: {
											fontSize: "0.85rem",
											color: "#cbd5e1",
											fontStyle: "italic",
											marginBottom: "10px"
										},
										children: ar.literature?.eaCitation
									}),
									/* @__PURE__ */ _jsx("p", {
										className: "report-para",
										style: { marginBottom: "12px" },
										children: ar.literature?.eaSummary
									}),
									/* @__PURE__ */ _jsx("div", {
										className: "math-formula",
										style: { borderLeftColor: "#ef4444" },
										children: /* @__PURE__ */ _jsx("code", { children: ar.literature?.eaFormula })
									}),
									/* @__PURE__ */ _jsxs("div", {
										className: "highlight-note warning",
										style: { margin: "12px 0 0 0" },
										children: [
											/* @__PURE__ */ _jsx("strong", { children: lang === "fr" ? "Avertissement Éthique :" : "Ethical Warning:" }),
											" ",
											ar.literature?.eaCritique
										]
									})
								]
							}),
							/* @__PURE__ */ _jsxs("div", {
								style: {
									background: "rgba(16, 185, 129, 0.03)",
									border: "1px solid rgba(16, 185, 129, 0.15)",
									borderRadius: "12px",
									padding: "20px"
								},
								children: [
									/* @__PURE__ */ _jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "flex-start",
											flexWrap: "wrap",
											gap: "10px",
											marginBottom: "8px"
										},
										children: [/* @__PURE__ */ _jsx("h4", {
											style: {
												color: "#34d399",
												margin: 0,
												fontSize: "1.1rem"
											},
											children: ar.literature?.valveTitle
										}), /* @__PURE__ */ _jsx("span", {
											className: "badge-glow-green",
											style: { fontSize: "0.75rem" },
											children: "NIPS 2006 & Valve Engineering"
										})]
									}),
									/* @__PURE__ */ _jsx("div", {
										style: {
											fontSize: "0.85rem",
											color: "#cbd5e1",
											fontStyle: "italic",
											marginBottom: "10px"
										},
										children: ar.literature?.valveCitation
									}),
									/* @__PURE__ */ _jsx("p", {
										className: "report-para",
										style: { marginBottom: "12px" },
										children: ar.literature?.valveSummary
									}),
									/* @__PURE__ */ _jsx("div", {
										className: "math-formula",
										style: { borderLeftColor: "#10b981" },
										children: /* @__PURE__ */ _jsx("code", { children: ar.literature?.valveFormula })
									}),
									/* @__PURE__ */ _jsxs("div", {
										className: "highlight-note",
										style: { margin: "12px 0 0 0" },
										children: [
											/* @__PURE__ */ _jsx("strong", { children: lang === "fr" ? "Standard Industriel :" : "Industry Standard:" }),
											" ",
											ar.literature?.valveCritique
										]
									})
								]
							}),
							/* @__PURE__ */ _jsxs("div", {
								style: {
									background: "rgba(6, 182, 212, 0.03)",
									border: "1px solid rgba(6, 182, 212, 0.15)",
									borderRadius: "12px",
									padding: "20px"
								},
								children: [
									/* @__PURE__ */ _jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "flex-start",
											flexWrap: "wrap",
											gap: "10px",
											marginBottom: "8px"
										},
										children: [/* @__PURE__ */ _jsx("h4", {
											style: {
												color: "#38bdf8",
												margin: 0,
												fontSize: "1.1rem"
											},
											children: ar.literature?.riotTitle
										}), /* @__PURE__ */ _jsx("span", {
											className: "badge-glow-cyan",
											style: { fontSize: "0.75rem" },
											children: "GDC Player Dynamics Research"
										})]
									}),
									/* @__PURE__ */ _jsx("div", {
										style: {
											fontSize: "0.85rem",
											color: "#cbd5e1",
											fontStyle: "italic",
											marginBottom: "10px"
										},
										children: ar.literature?.riotCitation
									}),
									/* @__PURE__ */ _jsx("p", {
										className: "report-para",
										style: { marginBottom: "12px" },
										children: ar.literature?.riotSummary
									}),
									/* @__PURE__ */ _jsxs("div", {
										className: "highlight-note",
										style: {
											margin: "12px 0 0 0",
											borderLeftColor: "#06b6d4"
										},
										children: [
											/* @__PURE__ */ _jsx("strong", { children: lang === "fr" ? "Alignement Télémetrique :" : "Telemetry Alignment:" }),
											" ",
											ar.literature?.riotCritique
										]
									})
								]
							}),
							/* @__PURE__ */ _jsxs("div", {
								style: {
									background: "rgba(168, 85, 247, 0.03)",
									border: "1px solid rgba(168, 85, 247, 0.15)",
									borderRadius: "12px",
									padding: "20px"
								},
								children: [
									/* @__PURE__ */ _jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "flex-start",
											flexWrap: "wrap",
											gap: "10px",
											marginBottom: "8px"
										},
										children: [/* @__PURE__ */ _jsx("h4", {
											style: {
												color: "#c084fc",
												margin: 0,
												fontSize: "1.1rem"
											},
											children: ar.literature?.ieeeTitle
										}), /* @__PURE__ */ _jsx("span", {
											className: "badge-glow-cyan",
											style: {
												fontSize: "0.75rem",
												borderColor: "#a855f7",
												color: "#c084fc"
											},
											children: "IEEE CIG / Big Data / PLOS ONE"
										})]
									}),
									/* @__PURE__ */ _jsx("div", {
										style: {
											fontSize: "0.85rem",
											color: "#cbd5e1",
											fontStyle: "italic",
											marginBottom: "10px"
										},
										children: ar.literature?.ieeeCitation
									}),
									/* @__PURE__ */ _jsx("p", {
										className: "report-para",
										style: { marginBottom: "12px" },
										children: ar.literature?.ieeeSummary
									}),
									/* @__PURE__ */ _jsxs("div", {
										className: "highlight-note",
										style: {
											margin: "12px 0 0 0",
											borderLeftColor: "#a855f7"
										},
										children: [
											/* @__PURE__ */ _jsx("strong", { children: lang === "fr" ? "Feuille de Route R&D :" : "R&D Direction:" }),
											" ",
											ar.literature?.ieeeCritique
										]
									})
								]
							})
						]
					}),
					/* @__PURE__ */ _jsxs("div", {
						style: { marginTop: "30px" },
						children: [/* @__PURE__ */ _jsxs("h4", {
							className: "report-subtitle",
							children: [
								/* @__PURE__ */ _jsx("span", { children: "📑" }),
								" ",
								lang === "fr" ? "Tableau Comparatif des Paradigmes de Matchmaking & Rétention" : "Comparative Matchmaking & Retention Matrix"
							]
						}), /* @__PURE__ */ _jsx("div", {
							className: "preview-table-container",
							children: /* @__PURE__ */ _jsxs("table", {
								className: "preview-table",
								children: [/* @__PURE__ */ _jsx("thead", { children: /* @__PURE__ */ _jsxs("tr", { children: [
									/* @__PURE__ */ _jsx("th", { children: ar.literature?.tableHeaders?.model || "Modèle" }),
									/* @__PURE__ */ _jsx("th", { children: ar.literature?.tableHeaders?.source || "Source" }),
									/* @__PURE__ */ _jsx("th", { children: ar.literature?.tableHeaders?.paradigm || "Paradigme" }),
									/* @__PURE__ */ _jsx("th", { children: ar.literature?.tableHeaders?.strengths || "Forces" }),
									/* @__PURE__ */ _jsx("th", { children: ar.literature?.tableHeaders?.limitations || "Limites" }),
									/* @__PURE__ */ _jsx("th", { children: ar.literature?.tableHeaders?.verdict || "Verdict" })
								] }) }), /* @__PURE__ */ _jsx("tbody", { children: literatureRows.map((row, idx) => /* @__PURE__ */ _jsxs("tr", { children: [
									/* @__PURE__ */ _jsx("td", {
										style: {
											fontWeight: "700",
											color: "white"
										},
										children: row.model
									}),
									/* @__PURE__ */ _jsxs("td", {
										style: {
											fontSize: "0.8rem",
											color: "#94a3b8"
										},
										children: [
											row.source,
											/* @__PURE__ */ _jsx("br", {}),
											/* @__PURE__ */ _jsx("span", {
												style: {
													fontSize: "0.72rem",
													color: "#64748b"
												},
												children: row.doi
											})
										]
									}),
									/* @__PURE__ */ _jsx("td", {
										style: { fontSize: "0.85rem" },
										children: row.paradigm
									}),
									/* @__PURE__ */ _jsx("td", {
										style: {
											fontSize: "0.85rem",
											color: "#a7f3d0"
										},
										children: row.strengths
									}),
									/* @__PURE__ */ _jsx("td", {
										style: {
											fontSize: "0.85rem",
											color: "#fca5a5"
										},
										children: row.limitations
									}),
									/* @__PURE__ */ _jsx("td", { children: /* @__PURE__ */ _jsx("span", {
										className: row.badgeClass,
										style: {
											fontSize: "0.72rem",
											whiteSpace: "nowrap"
										},
										children: row.verdict
									}) })
								] }, idx)) })]
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ _jsxs("div", {
				className: "report-section-card",
				children: [
					/* @__PURE__ */ _jsxs("h3", {
						className: "report-section-title",
						children: [
							/* @__PURE__ */ _jsx("span", { children: "R2" }),
							" ",
							ar.viability?.title || (lang === "fr" ? "Diagnostic de Viabilité Industrielle & Modélisation de Survie" : "Industrial Viability Diagnosis")
						]
					}),
					/* @__PURE__ */ _jsxs("div", {
						style: { marginBottom: "24px" },
						children: [
							/* @__PURE__ */ _jsxs("h4", {
								className: "report-subtitle glow-text-green",
								children: [
									/* @__PURE__ */ _jsx("span", { children: "🔍" }),
									" ",
									ar.viability?.veracityTitle
								]
							}),
							/* @__PURE__ */ _jsx("p", {
								className: "report-para",
								children: ar.viability?.veracityText
							}),
							/* @__PURE__ */ _jsx("div", {
								className: "math-formula",
								style: { borderLeftColor: "var(--accent-emerald)" },
								children: /* @__PURE__ */ _jsx("code", { children: ar.viability?.veracityFormula })
							}),
							/* @__PURE__ */ _jsxs("div", {
								className: "highlight-note warning",
								children: [
									/* @__PURE__ */ _jsx("strong", { children: lang === "fr" ? "Conséquence Opérationnelle :" : "Operational Impact:" }),
									" ",
									ar.viability?.veracityPrevalenceNote
								]
							}),
							/* @__PURE__ */ _jsxs("div", {
								style: {
									marginTop: "16px",
									padding: "16px",
									background: "rgba(255, 255, 255, 0.02)",
									borderRadius: "8px",
									border: "1px solid rgba(255, 255, 255, 0.05)"
								},
								children: [/* @__PURE__ */ _jsxs("h5", {
									style: {
										color: "white",
										margin: "0 0 8px 0",
										fontSize: "0.95rem"
									},
									children: ["⚖️ ", ar.viability?.confoundingTitle]
								}), /* @__PURE__ */ _jsx("p", {
									style: {
										fontSize: "0.85rem",
										color: "var(--color-text-secondary)",
										margin: 0,
										lineHeight: "1.5"
									},
									children: ar.viability?.confoundingText
								})]
							})
						]
					}),
					/* @__PURE__ */ _jsxs("div", {
						style: {
							marginTop: "30px",
							marginBottom: "30px"
						},
						children: [/* @__PURE__ */ _jsxs("h4", {
							className: "report-subtitle",
							children: [
								/* @__PURE__ */ _jsx("span", { children: "⚡" }),
								" ",
								ar.viability?.bottlenecksTitle
							]
						}), /* @__PURE__ */ _jsxs("div", {
							className: "feature-family-grid",
							children: [
								/* @__PURE__ */ _jsxs("div", {
									className: "feature-family-card",
									style: { borderTop: "3px solid #ef4444" },
									children: [/* @__PURE__ */ _jsxs("h4", { children: ["⏱️ ", ar.viability?.bottleneck1Title] }), /* @__PURE__ */ _jsx("p", {
										style: {
											fontSize: "0.85rem",
											color: "var(--color-text-secondary)",
											lineHeight: "1.5",
											margin: 0
										},
										children: ar.viability?.bottleneck1Text
									})]
								}),
								/* @__PURE__ */ _jsxs("div", {
									className: "feature-family-card",
									style: { borderTop: "3px solid #f59e0b" },
									children: [/* @__PURE__ */ _jsxs("h4", { children: ["📡 ", ar.viability?.bottleneck2Title] }), /* @__PURE__ */ _jsx("p", {
										style: {
											fontSize: "0.85rem",
											color: "var(--color-text-secondary)",
											lineHeight: "1.5",
											margin: 0
										},
										children: ar.viability?.bottleneck2Text
									})]
								}),
								/* @__PURE__ */ _jsxs("div", {
									className: "feature-family-card",
									style: { borderTop: "3px solid #3b82f6" },
									children: [/* @__PURE__ */ _jsxs("h4", { children: ["👶 ", ar.viability?.bottleneck3Title] }), /* @__PURE__ */ _jsx("p", {
										style: {
											fontSize: "0.85rem",
											color: "var(--color-text-secondary)",
											lineHeight: "1.5",
											margin: 0
										},
										children: ar.viability?.bottleneck3Text
									})]
								}),
								/* @__PURE__ */ _jsxs("div", {
									className: "feature-family-card",
									style: { borderTop: "3px solid #10b981" },
									children: [/* @__PURE__ */ _jsxs("h4", { children: ["🔄 ", ar.viability?.bottleneck4Title] }), /* @__PURE__ */ _jsx("p", {
										style: {
											fontSize: "0.85rem",
											color: "var(--color-text-secondary)",
											lineHeight: "1.5",
											margin: 0
										},
										children: ar.viability?.bottleneck4Text
									})]
								})
							]
						})]
					}),
					/* @__PURE__ */ _jsxs("div", {
						style: { marginTop: "30px" },
						children: [
							/* @__PURE__ */ _jsxs("h4", {
								className: "report-subtitle glow-text-cyan",
								children: [
									/* @__PURE__ */ _jsx("span", { children: "⏳" }),
									" ",
									ar.viability?.survivalTitle
								]
							}),
							/* @__PURE__ */ _jsx("p", {
								className: "report-para",
								children: ar.viability?.survivalText
							}),
							/* @__PURE__ */ _jsxs("div", {
								style: {
									display: "grid",
									gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
									gap: "16px",
									margin: "16px 0"
								},
								children: [/* @__PURE__ */ _jsx("div", {
									className: "math-formula",
									style: {
										margin: 0,
										borderLeftColor: "#06b6d4",
										fontSize: "0.9rem"
									},
									children: /* @__PURE__ */ _jsx("code", { children: ar.viability?.survivalFormulaKm })
								}), /* @__PURE__ */ _jsx("div", {
									className: "math-formula",
									style: {
										margin: 0,
										borderLeftColor: "#10b981",
										fontSize: "0.9rem"
									},
									children: /* @__PURE__ */ _jsx("code", { children: ar.viability?.survivalFormulaCox })
								})]
							}),
							/* @__PURE__ */ _jsxs("div", {
								className: "highlight-note",
								style: { borderLeftColor: "#06b6d4" },
								children: [
									/* @__PURE__ */ _jsxs("strong", { children: [ar.viability?.survivalComparisonTitle, " :"] }),
									" ",
									ar.viability?.survivalComparisonText
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ _jsxs("div", {
				className: "report-section-card",
				style: {
					background: "rgba(13, 20, 35, 0.85)",
					border: "1px solid rgba(6, 182, 212, 0.25)"
				},
				children: [
					/* @__PURE__ */ _jsxs("div", {
						style: {
							display: "flex",
							justifyContent: "space-between",
							alignItems: "flex-start",
							flexWrap: "wrap",
							gap: "12px",
							marginBottom: "16px"
						},
						children: [/* @__PURE__ */ _jsxs("div", { children: [/* @__PURE__ */ _jsxs("h3", {
							className: "report-section-title",
							style: {
								margin: 0,
								border: "none",
								padding: 0
							},
							children: [
								/* @__PURE__ */ _jsx("span", { children: "🎮" }),
								" ",
								ar.comparisonWidget?.title
							]
						}), /* @__PURE__ */ _jsx("p", {
							className: "report-para",
							style: { margin: "8px 0 0 0" },
							children: ar.comparisonWidget?.subtitle
						})] }), /* @__PURE__ */ _jsx("div", {
							style: {
								display: "flex",
								gap: "6px",
								flexWrap: "wrap"
							},
							children: [
								"all",
								"signal",
								"speed",
								"fairness"
							].map((tab) => /* @__PURE__ */ _jsxs("button", {
								onClick: () => setActiveMetricTab(tab),
								style: {
									background: activeMetricTab === tab ? "var(--accent-cyan)" : "rgba(255, 255, 255, 0.05)",
									color: activeMetricTab === tab ? "#06080d" : "var(--color-text-secondary)",
									border: "1px solid rgba(255, 255, 255, 0.1)",
									borderRadius: "6px",
									padding: "4px 10px",
									fontSize: "0.75rem",
									fontWeight: "600",
									cursor: "pointer",
									transition: "all 0.2s ease"
								},
								children: [
									tab === "all" && (lang === "fr" ? "Toutes les Métriques" : "All Metrics"),
									tab === "signal" && (lang === "fr" ? "Rigueur Signal" : "Signal Rigor"),
									tab === "speed" && (lang === "fr" ? "Vitesse Live" : "Live Speed"),
									tab === "fairness" && (lang === "fr" ? "Équité Éthique" : "Fairness")
								]
							}, tab))
						})]
					}),
					/* @__PURE__ */ _jsx("div", {
						style: {
							display: "flex",
							gap: "10px",
							flexWrap: "wrap",
							marginBottom: "24px"
						},
						children: Object.values(paradigmData).map((p) => {
							const isSelected = selectedParadigm === p.id;
							return /* @__PURE__ */ _jsxs("button", {
								onClick: () => setSelectedParadigm(p.id),
								style: {
									flex: "1 1 200px",
									display: "flex",
									flexDirection: "column",
									alignItems: "flex-start",
									padding: "14px 18px",
									borderRadius: "10px",
									background: isSelected ? "rgba(6, 182, 212, 0.12)" : "rgba(255, 255, 255, 0.02)",
									border: `1px solid ${isSelected ? "var(--accent-cyan)" : "rgba(255, 255, 255, 0.06)"}`,
									cursor: "pointer",
									transition: "all 0.2s ease",
									textAlign: "left"
								},
								children: [/* @__PURE__ */ _jsxs("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										width: "100%",
										alignItems: "center",
										marginBottom: "6px"
									},
									children: [/* @__PURE__ */ _jsx("span", {
										style: {
											fontSize: "0.7rem",
											fontWeight: "800",
											color: p.tagColor,
											letterSpacing: "0.05em"
										},
										children: p.tag
									}), isSelected && /* @__PURE__ */ _jsx("span", {
										style: {
											fontSize: "0.8rem",
											color: "var(--accent-cyan)"
										},
										children: "● Actif"
									})]
								}), /* @__PURE__ */ _jsx("span", {
									style: {
										fontSize: "0.95rem",
										fontWeight: "700",
										color: isSelected ? "white" : "var(--color-text-secondary)"
									},
									children: p.name
								})]
							}, p.id);
						})
					}),
					/* @__PURE__ */ _jsx("div", {
						style: {
							background: "rgba(0, 0, 0, 0.35)",
							border: "1px solid rgba(255, 255, 255, 0.05)",
							borderRadius: "12px",
							padding: "24px",
							marginBottom: "20px"
						},
						children: /* @__PURE__ */ _jsxs("div", {
							style: {
								display: "grid",
								gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
								gap: "24px",
								alignItems: "center"
							},
							children: [/* @__PURE__ */ _jsxs("div", { children: [/* @__PURE__ */ _jsx("h4", {
								style: {
									fontSize: "0.9rem",
									color: "var(--accent-cyan)",
									textTransform: "uppercase",
									letterSpacing: "0.08em",
									marginBottom: "16px"
								},
								children: ar.comparisonWidget?.metricsLabel || "Indicateurs Multidimensionnels du Paradigme"
							}), /* @__PURE__ */ _jsx("div", {
								style: {
									display: "flex",
									flexDirection: "column",
									gap: "14px"
								},
								children: [
									{
										key: "signalRigor",
										label: ar.comparisonWidget?.metrics?.signalRigor || "Rigueur Scientifique",
										val: currentParadigm.scores.signalRigor,
										color: "#10b981"
									},
									{
										key: "inferenceSpeed",
										label: ar.comparisonWidget?.metrics?.inferenceSpeed || "Vitesse d’Inférence",
										val: currentParadigm.scores.inferenceSpeed,
										color: "#06b6d4"
									},
									{
										key: "fairnessScore",
										label: ar.comparisonWidget?.metrics?.fairnessScore || "Équité & Éthique",
										val: currentParadigm.scores.fairnessScore,
										color: currentParadigm.scores.fairnessScore < 50 ? "#ef4444" : "#10b981"
									},
									{
										key: "pipelineComplexity",
										label: ar.comparisonWidget?.metrics?.pipelineComplexity || "Simplicité Pipeline",
										val: currentParadigm.scores.pipelineComplexity,
										color: "#3b82f6"
									},
									{
										key: "actionability",
										label: ar.comparisonWidget?.metrics?.actionability || "Actionabilité Game Design",
										val: currentParadigm.scores.actionability,
										color: "#a855f7"
									}
								].filter((m) => activeMetricTab === "all" || activeMetricTab === "signal" && m.key === "signalRigor" || activeMetricTab === "speed" && m.key === "inferenceSpeed" || activeMetricTab === "fairness" && m.key === "fairnessScore").map((metric) => /* @__PURE__ */ _jsxs("div", { children: [/* @__PURE__ */ _jsxs("div", {
									style: {
										display: "flex",
										justifyContent: "space-between",
										fontSize: "0.8rem",
										marginBottom: "4px"
									},
									children: [/* @__PURE__ */ _jsx("span", {
										style: { color: "#cbd5e1" },
										children: metric.label
									}), /* @__PURE__ */ _jsxs("span", {
										style: {
											fontWeight: "700",
											color: metric.color
										},
										children: [metric.val, " / 100"]
									})]
								}), /* @__PURE__ */ _jsx("div", {
									style: {
										height: "8px",
										background: "rgba(255, 255, 255, 0.06)",
										borderRadius: "4px",
										overflow: "hidden"
									},
									children: /* @__PURE__ */ _jsx("div", { style: {
										height: "100%",
										width: `${metric.val}%`,
										background: metric.color,
										borderRadius: "4px",
										transition: "width 0.4s ease-out"
									} })
								})] }, metric.key))
							})] }), /* @__PURE__ */ _jsxs("div", {
								style: {
									background: "rgba(255, 255, 255, 0.02)",
									border: "1px solid rgba(255, 255, 255, 0.06)",
									borderRadius: "10px",
									padding: "18px"
								},
								children: [
									/* @__PURE__ */ _jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: "10px"
										},
										children: [/* @__PURE__ */ _jsx("span", {
											style: {
												fontSize: "0.95rem",
												fontWeight: "800",
												color: "white"
											},
											children: currentParadigm.name
										}), /* @__PURE__ */ _jsx("span", {
											style: {
												fontSize: "0.75rem",
												fontWeight: "700",
												color: currentParadigm.tagColor
											},
											children: currentParadigm.tag
										})]
									}),
									/* @__PURE__ */ _jsx("p", {
										style: {
											fontSize: "0.825rem",
											color: "var(--color-text-secondary)",
											lineHeight: "1.45",
											margin: "0 0 12px 0"
										},
										children: currentParadigm.summary
									}),
									/* @__PURE__ */ _jsxs("div", {
										style: {
											display: "flex",
											flexDirection: "column",
											gap: "6px",
											fontSize: "0.78rem"
										},
										children: [
											/* @__PURE__ */ _jsxs("div", { children: [
												/* @__PURE__ */ _jsx("strong", {
													style: { color: "#94a3b8" },
													children: lang === "fr" ? "Formulation de Cible :" : "Target Formulation:"
												}),
												" ",
												/* @__PURE__ */ _jsx("span", {
													style: { color: "white" },
													children: currentParadigm.target
												})
											] }),
											/* @__PURE__ */ _jsxs("div", { children: [
												/* @__PURE__ */ _jsx("strong", {
													style: { color: "#94a3b8" },
													children: lang === "fr" ? "Censure à Droite :" : "Right-Censoring:"
												}),
												" ",
												/* @__PURE__ */ _jsx("span", {
													style: { color: "#cbd5e1" },
													children: currentParadigm.censoring
												})
											] }),
											/* @__PURE__ */ _jsxs("div", { children: [
												/* @__PURE__ */ _jsx("strong", {
													style: { color: "#94a3b8" },
													children: lang === "fr" ? "Latence d’Inférence :" : "Inference Latency:"
												}),
												" ",
												/* @__PURE__ */ _jsx("span", {
													style: { color: "var(--accent-emerald)" },
													children: currentParadigm.latency
												})
											] }),
											/* @__PURE__ */ _jsxs("div", { children: [
												/* @__PURE__ */ _jsx("strong", {
													style: { color: "#94a3b8" },
													children: lang === "fr" ? "Infrastructure Studio :" : "Studio Infrastructure:"
												}),
												" ",
												/* @__PURE__ */ _jsx("span", {
													style: { color: "#cbd5e1" },
													children: currentParadigm.infra
												})
											] }),
											/* @__PURE__ */ _jsxs("div", { children: [
												/* @__PURE__ */ _jsx("strong", {
													style: { color: "#94a3b8" },
													children: lang === "fr" ? "Posture Éthique :" : "Ethical Posture:"
												}),
												" ",
												/* @__PURE__ */ _jsx("span", {
													style: { color: currentParadigm.scores.fairnessScore < 50 ? "#ef4444" : "var(--accent-emerald)" },
													children: currentParadigm.fairness
												})
											] })
										]
									}),
									/* @__PURE__ */ _jsx("div", {
										style: {
											marginTop: "12px",
											background: "rgba(0,0,0,0.4)",
											padding: "8px 12px",
											borderRadius: "6px",
											borderLeft: `3px solid ${currentParadigm.tagColor}`,
											fontFamily: "monospace",
											fontSize: "0.75rem",
											color: "#f1f5f9"
										},
										children: currentParadigm.formula
									})
								]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ _jsxs("div", {
				className: "report-section-card",
				children: [
					/* @__PURE__ */ _jsxs("h3", {
						className: "report-section-title",
						children: [
							/* @__PURE__ */ _jsx("span", { children: "R1" }),
							" ",
							ar.postMortem?.title || (lang === "fr" ? "Rétrospective Méthodologique : Le Post-Mortem V1 à V5" : "Methodological Post-Mortem")
						]
					}),
					/* @__PURE__ */ _jsx("p", {
						className: "report-para",
						children: ar.postMortem?.intro
					}),
					/* @__PURE__ */ _jsxs("div", {
						style: {
							display: "flex",
							flexDirection: "column",
							gap: "20px",
							marginTop: "20px"
						},
						children: [
							/* @__PURE__ */ _jsxs("div", {
								style: {
									background: "rgba(239, 68, 68, 0.03)",
									border: "1px solid rgba(239, 68, 68, 0.15)",
									borderRadius: "12px",
									padding: "20px"
								},
								children: [
									/* @__PURE__ */ _jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: "8px"
										},
										children: [/* @__PURE__ */ _jsx("h4", {
											style: {
												color: "#f87171",
												margin: 0,
												fontSize: "1.05rem"
											},
											children: ar.postMortem?.v1Title
										}), /* @__PURE__ */ _jsx("span", {
											className: "badge-glow-red",
											style: { fontSize: "0.72rem" },
											children: "ACCURACY PARADOX"
										})]
									}),
									/* @__PURE__ */ _jsx("div", {
										style: {
											fontSize: "0.8rem",
											color: "#94a3b8",
											fontStyle: "italic",
											marginBottom: "10px"
										},
										children: ar.postMortem?.v1Metrics
									}),
									/* @__PURE__ */ _jsx("p", {
										className: "report-para",
										style: { marginBottom: "8px" },
										children: ar.postMortem?.v1Analysis
									}),
									/* @__PURE__ */ _jsxs("div", {
										style: {
											fontSize: "0.825rem",
											fontWeight: "600",
											color: "#fca5a5"
										},
										children: ["💡 ", ar.postMortem?.v1Lesson]
									})
								]
							}),
							/* @__PURE__ */ _jsxs("div", {
								style: {
									background: "rgba(245, 158, 11, 0.03)",
									border: "1px solid rgba(245, 158, 11, 0.15)",
									borderRadius: "12px",
									padding: "20px"
								},
								children: [
									/* @__PURE__ */ _jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: "8px"
										},
										children: [/* @__PURE__ */ _jsx("h4", {
											style: {
												color: "#fbbf24",
												margin: 0,
												fontSize: "1.05rem"
											},
											children: ar.postMortem?.v2Title
										}), /* @__PURE__ */ _jsx("span", {
											className: "badge-glow-cyan",
											style: {
												fontSize: "0.72rem",
												borderColor: "#f59e0b",
												color: "#fbbf24"
											},
											children: "SMOTE MANIFOLD DISTORTION"
										})]
									}),
									/* @__PURE__ */ _jsx("div", {
										style: {
											fontSize: "0.8rem",
											color: "#94a3b8",
											fontStyle: "italic",
											marginBottom: "10px"
										},
										children: ar.postMortem?.v2Metrics
									}),
									/* @__PURE__ */ _jsx("p", {
										className: "report-para",
										style: { marginBottom: "8px" },
										children: ar.postMortem?.v2Analysis
									}),
									/* @__PURE__ */ _jsxs("div", {
										style: {
											fontSize: "0.825rem",
											fontWeight: "600",
											color: "#fde68a"
										},
										children: ["💡 ", ar.postMortem?.v2Lesson]
									})
								]
							}),
							/* @__PURE__ */ _jsxs("div", {
								style: {
									background: "rgba(59, 130, 246, 0.03)",
									border: "1px solid rgba(59, 130, 246, 0.15)",
									borderRadius: "12px",
									padding: "20px"
								},
								children: [
									/* @__PURE__ */ _jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: "8px"
										},
										children: [/* @__PURE__ */ _jsx("h4", {
											style: {
												color: "#60a5fa",
												margin: 0,
												fontSize: "1.05rem"
											},
											children: ar.postMortem?.v3Title
										}), /* @__PURE__ */ _jsx("span", {
											className: "badge-glow-cyan",
											style: { fontSize: "0.72rem" },
											children: "TEMPORAL ANCHORING DEFICIT"
										})]
									}),
									/* @__PURE__ */ _jsx("div", {
										style: {
											fontSize: "0.8rem",
											color: "#94a3b8",
											fontStyle: "italic",
											marginBottom: "10px"
										},
										children: ar.postMortem?.v3Metrics
									}),
									/* @__PURE__ */ _jsx("p", {
										className: "report-para",
										style: { marginBottom: "8px" },
										children: ar.postMortem?.v3Analysis
									}),
									/* @__PURE__ */ _jsxs("div", {
										style: {
											fontSize: "0.825rem",
											fontWeight: "600",
											color: "#93c5fd"
										},
										children: ["💡 ", ar.postMortem?.v3Lesson]
									})
								]
							}),
							/* @__PURE__ */ _jsxs("div", {
								style: {
									background: "rgba(239, 68, 68, 0.04)",
									border: "1px solid rgba(239, 68, 68, 0.25)",
									borderRadius: "12px",
									padding: "20px"
								},
								children: [
									/* @__PURE__ */ _jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: "8px"
										},
										children: [/* @__PURE__ */ _jsx("h4", {
											style: {
												color: "#f87171",
												margin: 0,
												fontSize: "1.05rem"
											},
											children: ar.postMortem?.v4Title
										}), /* @__PURE__ */ _jsx("span", {
											className: "badge-glow-red",
											style: { fontSize: "0.72rem" },
											children: "DENOMINATOR LEAKAGE (96.3% TRAP)"
										})]
									}),
									/* @__PURE__ */ _jsx("div", {
										style: {
											fontSize: "0.8rem",
											color: "#fca5a5",
											fontStyle: "italic",
											marginBottom: "10px"
										},
										children: ar.postMortem?.v4Metrics
									}),
									/* @__PURE__ */ _jsx("p", {
										className: "report-para",
										style: { marginBottom: "8px" },
										children: ar.postMortem?.v4Analysis
									}),
									/* @__PURE__ */ _jsx("div", {
										className: "math-formula",
										style: {
											borderLeftColor: "#ef4444",
											margin: "10px 0"
										},
										children: /* @__PURE__ */ _jsx("code", { children: ar.postMortem?.v4Formula })
									}),
									/* @__PURE__ */ _jsxs("div", {
										style: {
											fontSize: "0.825rem",
											fontWeight: "600",
											color: "#fca5a5"
										},
										children: ["💡 ", ar.postMortem?.v4Lesson]
									})
								]
							}),
							/* @__PURE__ */ _jsxs("div", {
								style: {
									background: "rgba(245, 158, 11, 0.04)",
									border: "1px solid rgba(245, 158, 11, 0.2)",
									borderRadius: "12px",
									padding: "20px"
								},
								children: [
									/* @__PURE__ */ _jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: "8px"
										},
										children: [/* @__PURE__ */ _jsx("h4", {
											style: {
												color: "#fbbf24",
												margin: 0,
												fontSize: "1.05rem"
											},
											children: ar.postMortem?.v5Title
										}), /* @__PURE__ */ _jsx("span", {
											className: "badge-glow-cyan",
											style: {
												fontSize: "0.72rem",
												borderColor: "#f59e0b",
												color: "#fbbf24"
											},
											children: "LABEL TAUTOLOGY"
										})]
									}),
									/* @__PURE__ */ _jsx("div", {
										style: {
											fontSize: "0.8rem",
											color: "#fde68a",
											fontStyle: "italic",
											marginBottom: "10px"
										},
										children: ar.postMortem?.v5Metrics
									}),
									/* @__PURE__ */ _jsx("p", {
										className: "report-para",
										style: { marginBottom: "8px" },
										children: ar.postMortem?.v5Analysis
									}),
									/* @__PURE__ */ _jsx("div", {
										className: "math-formula",
										style: {
											borderLeftColor: "#f59e0b",
											margin: "10px 0"
										},
										children: /* @__PURE__ */ _jsx("code", { children: ar.postMortem?.v5Formula })
									}),
									/* @__PURE__ */ _jsxs("div", {
										style: {
											fontSize: "0.825rem",
											fontWeight: "600",
											color: "#fde68a"
										},
										children: ["💡 ", ar.postMortem?.v5Lesson]
									})
								]
							}),
							/* @__PURE__ */ _jsxs("div", {
								style: {
									background: "rgba(16, 185, 129, 0.05)",
									border: "1px solid rgba(16, 185, 129, 0.25)",
									borderRadius: "12px",
									padding: "20px"
								},
								children: [
									/* @__PURE__ */ _jsxs("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: "8px"
										},
										children: [/* @__PURE__ */ _jsx("h4", {
											style: {
												color: "#34d399",
												margin: 0,
												fontSize: "1.05rem"
											},
											children: ar.postMortem?.v6Title
										}), /* @__PURE__ */ _jsx("span", {
											className: "badge-glow-green",
											style: { fontSize: "0.72rem" },
											children: "PURGED BEHAVIORAL CANDIDATE"
										})]
									}),
									/* @__PURE__ */ _jsx("div", {
										style: {
											fontSize: "0.8rem",
											color: "#6ee7b7",
											fontStyle: "italic",
											marginBottom: "10px"
										},
										children: ar.postMortem?.v6Metrics
									}),
									/* @__PURE__ */ _jsx("p", {
										className: "report-para",
										style: { marginBottom: "8px" },
										children: ar.postMortem?.v6Analysis
									}),
									/* @__PURE__ */ _jsxs("div", {
										style: {
											fontSize: "0.825rem",
											fontWeight: "600",
											color: "#a7f3d0"
										},
										children: ["🎯 ", ar.postMortem?.v6Lesson]
									})
								]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ _jsxs("div", {
				className: "report-section-card",
				children: [
					/* @__PURE__ */ _jsxs("h3", {
						className: "report-section-title",
						children: [
							/* @__PURE__ */ _jsx("span", { children: "R3" }),
							" ",
							ar.balancingPolicy?.title || (lang === "fr" ? "Politiques Actionnables d’Anti-Churn & Équilibrage" : "Anti-Churn Policies")
						]
					}),
					/* @__PURE__ */ _jsx("p", {
						className: "report-para",
						children: ar.balancingPolicy?.intro
					}),
					/* @__PURE__ */ _jsxs("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
							gap: "20px",
							marginTop: "20px"
						},
						children: [
							/* @__PURE__ */ _jsxs("div", {
								className: "glass-card",
								style: {
									padding: "24px",
									borderTop: "4px solid var(--accent-emerald)"
								},
								children: [
									/* @__PURE__ */ _jsx("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: "12px"
										},
										children: /* @__PURE__ */ _jsx("h4", {
											style: {
												color: "white",
												margin: 0,
												fontSize: "1.05rem"
											},
											children: ar.balancingPolicy?.policy1Title
										})
									}),
									/* @__PURE__ */ _jsx("span", {
										className: "badge-glow-green",
										style: {
											fontSize: "0.7rem",
											marginBottom: "12px",
											display: "inline-block"
										},
										children: ar.balancingPolicy?.policy1Badge
									}),
									/* @__PURE__ */ _jsxs("p", {
										style: {
											fontSize: "0.825rem",
											color: "#cbd5e1",
											lineHeight: "1.5",
											marginBottom: "14px"
										},
										children: [
											/* @__PURE__ */ _jsx("strong", { children: lang === "fr" ? "Problème :" : "Problem:" }),
											" ",
											ar.balancingPolicy?.policy1Problem,
											/* @__PURE__ */ _jsx("br", {}),
											/* @__PURE__ */ _jsx("strong", { children: lang === "fr" ? "Action :" : "Intervention:" }),
											" ",
											ar.balancingPolicy?.policy1Solution
										]
									}),
									/* @__PURE__ */ _jsx("ul", {
										className: "report-bullet-list",
										style: {
											paddingLeft: "16px",
											margin: 0
										},
										children: ar.balancingPolicy?.policy1Mechanics?.map((m, idx) => /* @__PURE__ */ _jsx("li", {
											className: "report-bullet-item",
											style: { fontSize: "0.8rem" },
											children: m
										}, idx))
									})
								]
							}),
							/* @__PURE__ */ _jsxs("div", {
								className: "glass-card",
								style: {
									padding: "24px",
									borderTop: "4px solid var(--accent-cyan)"
								},
								children: [
									/* @__PURE__ */ _jsx("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: "12px"
										},
										children: /* @__PURE__ */ _jsx("h4", {
											style: {
												color: "white",
												margin: 0,
												fontSize: "1.05rem"
											},
											children: ar.balancingPolicy?.policy2Title
										})
									}),
									/* @__PURE__ */ _jsx("span", {
										className: "badge-glow-cyan",
										style: {
											fontSize: "0.7rem",
											marginBottom: "12px",
											display: "inline-block"
										},
										children: ar.balancingPolicy?.policy2Badge
									}),
									/* @__PURE__ */ _jsxs("p", {
										style: {
											fontSize: "0.825rem",
											color: "#cbd5e1",
											lineHeight: "1.5",
											marginBottom: "14px"
										},
										children: [
											/* @__PURE__ */ _jsx("strong", { children: lang === "fr" ? "Problème :" : "Problem:" }),
											" ",
											ar.balancingPolicy?.policy2Problem,
											/* @__PURE__ */ _jsx("br", {}),
											/* @__PURE__ */ _jsx("strong", { children: lang === "fr" ? "Action :" : "Intervention:" }),
											" ",
											ar.balancingPolicy?.policy2Solution
										]
									}),
									/* @__PURE__ */ _jsx("ul", {
										className: "report-bullet-list",
										style: {
											paddingLeft: "16px",
											margin: 0
										},
										children: ar.balancingPolicy?.policy2Mechanics?.map((m, idx) => /* @__PURE__ */ _jsx("li", {
											className: "report-bullet-item",
											style: { fontSize: "0.8rem" },
											children: m
										}, idx))
									})
								]
							}),
							/* @__PURE__ */ _jsxs("div", {
								className: "glass-card",
								style: {
									padding: "24px",
									borderTop: "4px solid #3b82f6"
								},
								children: [
									/* @__PURE__ */ _jsx("div", {
										style: {
											display: "flex",
											justifyContent: "space-between",
											alignItems: "center",
											marginBottom: "12px"
										},
										children: /* @__PURE__ */ _jsx("h4", {
											style: {
												color: "white",
												margin: 0,
												fontSize: "1.05rem"
											},
											children: ar.balancingPolicy?.policy3Title
										})
									}),
									/* @__PURE__ */ _jsx("span", {
										className: "badge-glow-cyan",
										style: {
											fontSize: "0.7rem",
											marginBottom: "12px",
											display: "inline-block",
											borderColor: "#3b82f6",
											color: "#60a5fa"
										},
										children: ar.balancingPolicy?.policy3Badge
									}),
									/* @__PURE__ */ _jsxs("p", {
										style: {
											fontSize: "0.825rem",
											color: "#cbd5e1",
											lineHeight: "1.5",
											marginBottom: "14px"
										},
										children: [
											/* @__PURE__ */ _jsx("strong", { children: lang === "fr" ? "Problème :" : "Problem:" }),
											" ",
											ar.balancingPolicy?.policy3Problem,
											/* @__PURE__ */ _jsx("br", {}),
											/* @__PURE__ */ _jsx("strong", { children: lang === "fr" ? "Action :" : "Intervention:" }),
											" ",
											ar.balancingPolicy?.policy3Solution
										]
									}),
									/* @__PURE__ */ _jsx("ul", {
										className: "report-bullet-list",
										style: {
											paddingLeft: "16px",
											margin: 0
										},
										children: ar.balancingPolicy?.policy3Mechanics?.map((m, idx) => /* @__PURE__ */ _jsx("li", {
											className: "report-bullet-item",
											style: { fontSize: "0.8rem" },
											children: m
										}, idx))
									})
								]
							})
						]
					}),
					/* @__PURE__ */ _jsxs("div", {
						style: {
							marginTop: "24px",
							background: "rgba(16, 185, 129, 0.03)",
							border: "1px solid rgba(16, 185, 129, 0.15)",
							borderRadius: "12px",
							padding: "20px"
						},
						children: [
							/* @__PURE__ */ _jsxs("h4", {
								style: {
									color: "var(--accent-emerald)",
									margin: "0 0 10px 0",
									fontSize: "1rem",
									display: "flex",
									alignItems: "center",
									gap: "8px"
								},
								children: [
									/* @__PURE__ */ _jsx("span", { children: "🛡️" }),
									" ",
									ar.balancingPolicy?.ethicsTitle
								]
							}),
							/* @__PURE__ */ _jsx("p", {
								className: "report-para",
								style: { marginBottom: "12px" },
								children: ar.balancingPolicy?.ethicsText
							}),
							/* @__PURE__ */ _jsxs("div", {
								style: {
									display: "grid",
									gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
									gap: "12px",
									fontSize: "0.825rem"
								},
								children: [
									/* @__PURE__ */ _jsx("div", {
										style: {
											background: "rgba(0,0,0,0.3)",
											padding: "10px 14px",
											borderRadius: "6px",
											borderLeft: "3px solid var(--accent-emerald)"
										},
										children: ar.balancingPolicy?.ethicsRule1
									}),
									/* @__PURE__ */ _jsx("div", {
										style: {
											background: "rgba(0,0,0,0.3)",
											padding: "10px 14px",
											borderRadius: "6px",
											borderLeft: "3px solid var(--accent-cyan)"
										},
										children: ar.balancingPolicy?.ethicsRule2
									}),
									/* @__PURE__ */ _jsx("div", {
										style: {
											background: "rgba(0,0,0,0.3)",
											padding: "10px 14px",
											borderRadius: "6px",
											borderLeft: "3px solid #3b82f6"
										},
										children: ar.balancingPolicy?.ethicsRule3
									})
								]
							}),
							ar.balancingPolicy?.ethicsConclusion && /* @__PURE__ */ _jsxs("p", {
								className: "report-para",
								style: {
									marginTop: "14px",
									marginBottom: 0,
									fontStyle: "italic",
									color: "rgba(255, 255, 255, 0.75)",
									borderTop: "1px solid rgba(255,255,255,0.08)",
									paddingTop: "10px"
								},
								children: ["💡 ", ar.balancingPolicy.ethicsConclusion]
							})
						]
					})
				]
			}),
			/* @__PURE__ */ _jsxs("div", {
				className: "report-section-card",
				children: [
					/* @__PURE__ */ _jsxs("h3", {
						className: "report-section-title",
						children: [
							/* @__PURE__ */ _jsx("span", { children: "🚀" }),
							" ",
							ar.roadmap?.title || (lang === "fr" ? "Feuille de Route pour Déploiement en Studio AAA" : "Studio Deployment Roadmap")
						]
					}),
					/* @__PURE__ */ _jsx("p", {
						className: "report-para",
						children: ar.roadmap?.subtitle
					}),
					/* @__PURE__ */ _jsxs("div", {
						style: {
							display: "grid",
							gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
							gap: "16px",
							marginTop: "20px"
						},
						children: [
							/* @__PURE__ */ _jsxs("div", {
								className: "glass-card",
								style: {
									padding: "20px",
									borderLeft: "4px solid var(--accent-emerald)"
								},
								children: [
									/* @__PURE__ */ _jsx("span", {
										className: "badge-glow-green",
										style: {
											fontSize: "0.7rem",
											marginBottom: "8px",
											display: "inline-block"
										},
										children: ar.roadmap?.phase0Tag
									}),
									/* @__PURE__ */ _jsx("h4", {
										style: {
											color: "white",
											margin: "0 0 8px 0",
											fontSize: "0.95rem"
										},
										children: ar.roadmap?.phase0Title
									}),
									/* @__PURE__ */ _jsx("p", {
										style: {
											fontSize: "0.825rem",
											color: "var(--color-text-secondary)",
											lineHeight: "1.45",
											margin: 0
										},
										children: ar.roadmap?.phase0Desc
									})
								]
							}),
							/* @__PURE__ */ _jsxs("div", {
								className: "glass-card",
								style: {
									padding: "20px",
									borderLeft: "4px solid var(--accent-cyan)"
								},
								children: [
									/* @__PURE__ */ _jsx("span", {
										className: "badge-glow-cyan",
										style: {
											fontSize: "0.7rem",
											marginBottom: "8px",
											display: "inline-block"
										},
										children: ar.roadmap?.phase1Tag
									}),
									/* @__PURE__ */ _jsx("h4", {
										style: {
											color: "white",
											margin: "0 0 8px 0",
											fontSize: "0.95rem"
										},
										children: ar.roadmap?.phase1Title
									}),
									/* @__PURE__ */ _jsx("p", {
										style: {
											fontSize: "0.825rem",
											color: "var(--color-text-secondary)",
											lineHeight: "1.45",
											margin: 0
										},
										children: ar.roadmap?.phase1Desc
									})
								]
							}),
							/* @__PURE__ */ _jsxs("div", {
								className: "glass-card",
								style: {
									padding: "20px",
									borderLeft: "4px solid #3b82f6"
								},
								children: [
									/* @__PURE__ */ _jsx("span", {
										className: "badge-glow-cyan",
										style: {
											fontSize: "0.7rem",
											marginBottom: "8px",
											display: "inline-block",
											borderColor: "#3b82f6",
											color: "#60a5fa"
										},
										children: ar.roadmap?.phase2Tag
									}),
									/* @__PURE__ */ _jsx("h4", {
										style: {
											color: "white",
											margin: "0 0 8px 0",
											fontSize: "0.95rem"
										},
										children: ar.roadmap?.phase2Title
									}),
									/* @__PURE__ */ _jsx("p", {
										style: {
											fontSize: "0.825rem",
											color: "var(--color-text-secondary)",
											lineHeight: "1.45",
											margin: 0
										},
										children: ar.roadmap?.phase2Desc
									})
								]
							}),
							/* @__PURE__ */ _jsxs("div", {
								className: "glass-card",
								style: {
									padding: "20px",
									borderLeft: "4px solid #a855f7"
								},
								children: [
									/* @__PURE__ */ _jsx("span", {
										className: "badge-glow-cyan",
										style: {
											fontSize: "0.7rem",
											marginBottom: "8px",
											display: "inline-block",
											borderColor: "#a855f7",
											color: "#c084fc"
										},
										children: ar.roadmap?.phase3Tag
									}),
									/* @__PURE__ */ _jsx("h4", {
										style: {
											color: "white",
											margin: "0 0 8px 0",
											fontSize: "0.95rem"
										},
										children: ar.roadmap?.phase3Title
									}),
									/* @__PURE__ */ _jsx("p", {
										style: {
											fontSize: "0.825rem",
											color: "var(--color-text-secondary)",
											lineHeight: "1.45",
											margin: 0
										},
										children: ar.roadmap?.phase3Desc
									})
								]
							})
						]
					})
				]
			})
		]
	});
}
