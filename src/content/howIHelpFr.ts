import { HowIHelpTopic } from "./types.ts";

export const howIHelpTopicsFr: HowIHelpTopic[] = [
  {
    id: "priorities",
    short: "Prioriser les objectifs",
    question: "Comment devrais-je prioriser mes objectifs financiers ?",
    why: "L'argent est une ressource finie et les objectifs entrent en concurrence. Sans ordre clair, l'urgence éclipse l'important, et le choix d'un compte ou d'un produit financier se fait avant même d'avoir répondu à la question fondamentale.",
    concepts: [
      {
        term: "Flux de trésorerie (Cash flow)",
        plain: "Ce qui rentre, ce qui sort, et la marge nette qu'il reste à diriger stratégiquement."
      },
      {
        term: "Fonds d'urgence",
        plain: "Liquidités mises de côté pour qu'un imprévu ne se transforme pas en dette coûteuse."
      },
      {
        term: "Coût de la dette",
        plain: "L'intérêt payé sur les emprunts, comparé au rendement potentiel de l'épargne ou aux économies d'impôt."
      },
      {
        term: "Horizon temporel",
        plain: "Le moment où chaque objectif aura besoin des fonds, ce qui dicte la façon dont ils doivent être investis."
      }
    ],
    tradeoffs: [
      "Rembourser une dette procure un rendement garanti mais réduit la liquidité immédiate. Épargner préserve des liquidités mais peut rapporter moins que l'intérêt payé.",
      "Hiérarchiser les priorités implique d'en faire attendre certaines. L'arbitrage consiste à déterminer lesquelles, et pour combien de temps.",
      "Un plan simple que vous suivrez réellement a plus de valeur qu'une stratégie complexe irréaliste sur papier."
    ],
    next: [
      {
        label: "Lire : Rembourser la dette ou épargner ?",
        href: "/fr/insights/savings-or-debt-first"
      }
    ],
    contactTopic: "education"
  },
  {
    id: "accounts",
    short: "Régimes enregistrés",
    question: "Que devrais-je comprendre avant de choisir un compte enregistré ?",
    why: "Le CELI, le REER, le CELIAPP et le REEE protègent chacun vos investissements de l'impôt, mais à des moments différents et selon des règles distinctes. Choisir par habitude ou selon l'offre par défaut peut entraîner des pertes d'avantages fiscaux ou de flexibilité.",
    concepts: [
      {
        term: "Impôt différé vs non imposable",
        plain: "Déduire aujourd'hui pour payer l'impôt au retrait (REER) ou cotiser après impôt pour retirer 100 % libre d'impôt (CELI/CELIAPP)."
      },
      {
        term: "Droits de cotisation cumulatifs",
        plain: "Les plafonds annuels qui se reportent s'ils ne sont pas utilisés, et les pénalités sévères de 1 % par mois en cas de dépassement."
      },
      {
        term: "Tranche marginale d'imposition",
        plain: "Votre taux d'imposition actuel comparé au taux prévu lors de votre retraite, qui détermine l'avantage mathématique du REER face au CELI."
      },
      {
        term: "Impact sur les prestations publiques",
        plain: "Les retraits du REER augmentent votre revenu imposable et peuvent réduire le SRG ou la SV, tandis que les retraits du CELI n'ont aucun impact."
      }
    ],
    tradeoffs: [
      "Le REER procure une déduction immédiate, mais chaque retrait futur sera imposable comme un salaire ordinaire.",
      "Le CELI n'offre aucune déduction immédiate, mais la croissance et les retraits sont totalement exempts d'impôt à vie.",
      "Le CELIAPP combine le meilleur des deux mondes pour l'achat d'une première maison : déduction à l'entrée et retrait exonéré à la sortie."
    ],
    next: [
      {
        label: "Guide : Comparatif CELI vs REER",
        href: "/fr/education/tfsa-vs-rrsp"
      },
      {
        label: "Guide : Tout comprendre sur le CELIAPP",
        href: "/fr/education/fhsa-explained"
      }
    ],
    contactTopic: "accounts"
  },
  {
    id: "income",
    short: "Protection du revenu",
    question: "Quelle part du revenu de mon foyer dépend de ma capacité à travailler ?",
    why: "Pour la plupart des Canadiens, leur actif le plus précieux n'est pas leur maison ou leurs placements, mais leur capacité future à générer un revenu. Si cette source s'interrompt par maladie ou accident, tout le reste s'effondre.",
    concepts: [
      {
        term: "Assurance invalidité",
        plain: "Remplace une fraction de votre salaire mensuel (généralement 60 à 70 %) si une maladie ou une blessure vous empêche d'exercer."
      },
      {
        term: "Assurance maladies graves",
        plain: "Verse une somme forfaitaire non imposable au diagnostic d'une condition couverte (cancer, crise cardiaque, AVC) pour couvrir les soins et pauses."
      },
      {
        term: "Couverture collective vs individuelle",
        plain: "Les régimes d'employeur ont des plafonds rigides et s'arrêtent si vous quittez l'entreprise ; une police individuelle vous appartient sans condition."
      },
      {
        term: "Période d'attente (délai de carence)",
        plain: "Le nombre de jours entre le début de l'arrêt et le premier versement des prestations, pendant lequel vos liquidités doivent subvenir aux besoins."
      }
    ],
    tradeoffs: [
      "Les polices collectives sont pratiques mais souvent limitées en montant et non transférables si vous changez d'employeur.",
      "Une police individuelle nécessite une sélection médicale mais garantit des primes fixes et une protection permanente.",
      "Choisir un délai d'attente plus long réduit significativement la prime mensuelle, à condition d'avoir un fonds d'urgence solide."
    ],
    next: [
      {
        label: "Guide : Pourquoi votre revenu passe avant l'investissement",
        href: "/fr/education/income-depends-on-you"
      },
      {
        label: "Guide : Temporaire vs Permanente",
        href: "/fr/education/term-vs-permanent-life-insurance"
      }
    ],
    contactTopic: "protection"
  },
  {
    id: "investing",
    short: "Investir avec méthode",
    question: "Que devrais-je savoir avant de prendre une décision d'investissement ?",
    why: "Le vocabulaire financier est souvent intimidant ou utilisé pour vendre des produits complexes. Investir judicieusement repose sur des principes simples : le temps, les frais, la diversification et la tolérance réelle à la volatilité.",
    concepts: [
      {
        term: "Horizon temporel",
        plain: "Le temps dont dispose votre capital pour croître et absorber les fluctuations normales des marchés boursiers."
      },
      {
        term: "Frais de gestion (RFG)",
        plain: "Le pourcentage annuel prélevé sur vos actifs, qui peut éroder des dizaines de milliers de dollars de rendement sur 20 ans."
      },
      {
        term: "Diversification mondiale",
        plain: "Répartir vos placements entre différents secteurs et pays pour ne pas dépendre du succès ou de l'échec d'une seule entreprise."
      },
      {
        term: "Investissement éthique & Halal",
        plain: "Filtrer les investissements selon les critères de la finance islamique (AAOIFI) pour éliminer les intérêts (Riba) et secteurs proscrits."
      }
    ],
    tradeoffs: [
      "Rechercher un rendement supérieur exige d'accepter une volatilité à court terme plus marquée.",
      "Garder tout son argent en liquidités bancaires évite les baisses, mais garantit une perte continue de pouvoir d'achat face à l'inflation.",
      "Une stratégie passive indicielle bat la majorité des gestionnaires actifs après déduction des frais sur le long terme."
    ],
    next: [
      {
        label: "Campagne : Investissement Islamique Mondial (BlackRock)",
        href: "/fr/investing/islamic-equity"
      },
      {
        label: "Guide : Risque d'investissement vs Risque d'objectif",
        href: "/fr/education/investment-risk-vs-goal-risk"
      }
    ],
    contactTopic: "investing"
  },
  {
    id: "debt",
    short: "Gérer et restructurer la dette",
    question: "Comment aborder mes dettes sans compromettre mon avenir ?",
    why: "Toutes les dettes ne se valent pas. Confondre une hypothèque à taux modéré avec un solde de carte de crédit à 20 % mène à des erreurs d'arbitrage coûteuses.",
    concepts: [
      {
        term: "Dette à intérêt élevé",
        plain: "Cartes de crédit et prêts personnels dont le taux dépasse 10 à 22 %, représentant une urgence financière absolue."
      },
      {
        term: "Dette structurée / hypothécaire",
        plain: "Emprunts garantis par un actif immobilier, avec des taux inférieurs et des périodes d'amortissement longues."
      },
      {
        term: "Proposition de consommateur",
        plain: "Procédure légale fédérale administrée par un syndic autorisé en insolvabilité permettant de négocier un remboursement partiel sans faillite."
      },
      {
        term: "Choc de renouvellement hypothécaire",
        plain: "La hausse soudaine des mensualités lors du passage d'un taux historique bas aux taux du marché actuel."
      }
    ],
    tradeoffs: [
      "Liquider ses REER pour payer une dette déclenche un impôt immédiat élevé et détruit définitivement des droits de cotisation.",
      "Consolider ses dettes allège la mensualité immédiate mais peut prolonger la durée totale du remboursement et augmenter l'intérêt cumulé.",
      "Une proposition de consommateur stoppe le harcèlement des créanciers mais affecte le dossier de crédit pendant plusieurs années."
    ],
    next: [
      {
        label: "Guide : Comprendre la proposition de consommateur",
        href: "/fr/education/consumer-proposals-explained"
      },
      {
        label: "Analyse : Le choc du renouvellement hypothécaire",
        href: "/fr/insights/canadian-mortgage-renewal-shock-liquidity-trap"
      }
    ],
    contactTopic: "debt"
  },
  {
    id: "education",
    short: "Épargne-études des enfants",
    question: "Comment préparer efficacement les études supérieures de mes enfants ?",
    why: "Les coûts des études postsecondaires ne cessent de croître. Le Régime enregistré d'épargne-études (REEE) offre un levier unique grâce aux subventions gouvernementales gratuites qui s'ajoutent à vos cotisations.",
    concepts: [
      {
        term: "Subvention canadienne pour l'épargne-études (SCEE)",
        plain: "Le gouvernement fédéral ajoute 20 % sur les premiers 2 500 $ cotisés par année, soit jusqu'à 500 $ par an et 7 200 $ à vie par enfant."
      },
      {
        term: "Bon d'études canadien (BEC)",
        plain: "Une aide financière supplémentaire pouvant atteindre 2 000 $ pour les familles à revenu modeste, sans obligation de cotisation parentale."
      },
      {
        term: "Régime familial vs individuel",
        plain: "Un régime familial permet de partager les subventions et les revenus de placement entre frères et sœurs si leurs parcours d'études diffèrent."
      },
      {
        term: "Règle de retrait (PAE)",
        plain: "À l'université ou au collège, les gains et subventions sont imposés entre les mains de l'étudiant, qui ne paie généralement aucun impôt."
      }
    ],
    tradeoffs: [
      "Cotiser plus de 2 500 $ par an ne génère pas de subvention supplémentaire pour l'année en cours (hors rattrapage d'une année antérieure).",
      "Si l'enfant ne poursuit pas d'études postsecondaires, les subventions sont retournées au gouvernement et les gains peuvent être transférés dans votre REER sous conditions.",
      "Les régimes collectifs (à bourses d'études) imposent souvent des règles de versement rigides, contrairement aux REEE autogérés ou en fonds distincts."
    ],
    next: [
      {
        label: "Guide : Les fondamentaux du REEE",
        href: "/fr/education/resp-basics"
      }
    ],
    contactTopic: "family"
  },
  {
    id: "retirement",
    short: "Retraite et rentes publiques",
    question: "Que devrais-je considérer à l'approche de la retraite ?",
    why: "La retraite canadienne repose sur trois piliers : les régimes publics (RPC/RRQ et SV), l'épargne enregistrée (REER, CELI, régimes d'employeur) et les actifs personnels. Coordonner leur décaissement évite de payer trop d'impôt ou de subir des pénalités.",
    concepts: [
      {
        term: "Régime de pensions du Canada (RPC / RRQ)",
        plain: "Rente basée sur vos gains de carrière. Peut débuter entre 60 et 70 ans, avec une réduction de 36 % à 60 ans ou un bonus de 42 % à 70 ans."
      },
      {
        term: "Sécurité de la vieillesse (SV)",
        plain: "Rente universelle financée par les recettes générales de l'État, accessible dès 65 ans avec possibilité de report jusqu'à 70 ans (+36 %)."
      },
      {
        term: "Récupération fiscale de la SV",
        plain: "Un impôt de récupération de 15 % s'applique sur chaque dollar de revenu net individuel dépassant le seuil fixé par l'ARC."
      },
      {
        term: "Conversion en FERR",
        plain: "Obligation légale de transformer votre REER en Fonds enregistré de revenu de retraite avant la fin de l'année de vos 71 ans."
      }
    ],
    tradeoffs: [
      "Prendre le RPC à 60 ans apporte des liquidités plus tôt mais réduit votre revenu garanti à vie.",
      "Retirer prioritairement du REER/FERR avant 65 ou 71 ans peut lisser votre tranche d'impôt et protéger votre pension de la Sécurité de la vieillesse.",
      "Le CELI constitue l'outil de décaissement idéal pour compléter votre revenu sans jamais déclencher de récupération de la SV ou du SRG."
    ],
    next: [
      {
        label: "Guide : À quel âge commencer le RPC et la SV ?",
        href: "/fr/education/cpp-oas-start-age"
      }
    ],
    contactTopic: "retirement"
  }
];
