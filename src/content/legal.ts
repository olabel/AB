export interface LegalSection {
  id: string;
  number: string;
  title: string;
  content: string[];
}

export interface LegalPageData {
  title: string;
  lede: string;
  bannerNotice?: string;
  sections: LegalSection[];
}

export const disclosuresData: LegalPageData = {
  title: "How this website works, and what it isn’t.",
  lede: "The plain-language version: my professional scope, licensing, compensation, and where general financial education ends.",
  sections: [
    {
      id: "education",
      number: "01",
      title: "Education, not advice",
      content: [
        "Everything on this website is general information intended to help you understand financial concepts. It does not take your personal circumstances into account and is not personalized financial, tax, legal or investment advice. It is not an offer or solicitation to buy or sell any product or service.",
        "Rules, limits and government programs change over time. Where figures and thresholds are given, they are dated and linked directly to the official source. Always confirm current details with authoritative sources and a qualified professional before acting."
      ]
    },
    {
      id: "affiliation",
      number: "02",
      title: "Who I am and my professional scope",
      content: [
        "Licensed Financial Solutions Professional.",
        "I operate as an independent financial professional providing education, registered account strategies, and financial solutions across Canada.",
        "I do not hold myself out as a portfolio manager, discretionary investment manager, accountant, tax lawyer, or fee-only fiduciary planner. When a request requires those specialized qualifications, I will point you to the appropriate licensed professional."
      ]
    },
    {
      id: "licences",
      number: "03",
      title: "Licences and where I can help",
      content: [
        "Financial products and services can be offered only in Canadian provinces and territories where the professional is duly licensed and only for authorized solutions.",
        "Educational content on this site is accessible to everyone, but availability of individual consultations or solutions depends on provincial licensing. If I cannot assist in your specific province, I will clearly let you know."
      ]
    },
    {
      id: "compensation",
      number: "04",
      title: "How I am paid",
      content: [
        "Transparency regarding compensation is essential. General educational resources, articles, and initial exploratory conversations on this website are provided at no charge.",
        "If you choose to implement specific financial products or solutions through my practice, compensation may take the form of commissions or advisory fees paid by product providers. Any compensation structure is fully disclosed in writing prior to implementing any recommendation."
      ]
    },
    {
      id: "referrals",
      number: "05",
      title: "Referrals to other professionals",
      content: [
        "Some financial questions require specialized credentials outside my professional scope. Corporate and complex tax planning belongs with a Chartered Professional Accountant (CPA); wills, trusts, and legal contracts belong with a qualified estate lawyer; formal insolvency procedures such as consumer proposals belong with a Licensed Insolvency Trustee (LIT).",
        "I refer clients to respected professionals in these domains and make any referral arrangements transparent."
      ]
    },
    {
      id: "examples",
      number: "06",
      title: "Hypothetical examples and past performance",
      content: [
        "Worked examples on this website use hypothetical figures to illustrate financial arithmetic and decision frameworks. They are not predictions or guarantees of future returns.",
        "Hypothetical models simplify calculations by excluding variables such as changing interest rates, ongoing investment management fees, and individual tax brackets. Past market performance does not guarantee future results."
      ]
    },
    {
      id: "testimonials",
      number: "07",
      title: "Testimonials and reviews",
      content: [
        "In accordance with Canadian regulatory standards for financial professionals, this website does not publish testimonials, subjective client endorsements, or past performance claims.",
        "Educational integrity and verifiable factual accuracy take precedence over promotional marketing."
      ]
    },
    {
      id: "contact",
      number: "08",
      title: "Using the contact form",
      content: [
        "Sending an enquiry through the website contact form does not establish an advisory or client relationship. Please never transmit sensitive information such as Social Insurance Numbers, banking passwords, or confidential medical documents through the form. See the privacy notice for details."
      ]
    }
  ]
};

export const privacyData: LegalPageData = {
  title: "How your information is handled.",
  lede: "Short and plain: what is collected, why, how it is safeguarded, and how to exercise your rights under Canadian privacy legislation.",
  sections: [
    {
      id: "who",
      number: "01",
      title: "Who is responsible",
      content: [
        "This website is operated by Ahmed Bello, an independent Licensed Financial Solutions Professional in Canada. I am directly responsible for personal information collected through this website and serve as the privacy officer accountable for its management.",
        "Privacy contact: Ahmed Bello, privacy@ahmedbello.com. Write to this address with any enquiry regarding your data, to request access or correction, or to withdraw consent."
      ]
    },
    {
      id: "collect",
      number: "02",
      title: "What I collect, and why",
      content: [
        "I collect only the personal information you voluntarily provide:",
        "• Contact form: your first name, email address, province or territory, primary financial topic, and an optional phone number and message. These are utilized solely to reply to your specific enquiry.",
        "• Educational emails (optional): your email address, only if you explicitly opt in. It is used strictly to share newly published financial guides.",
        "Do not send account numbers, Social Insurance Numbers (SIN), identity cards, medical records, or sensitive financial files through the website."
      ]
    },
    {
      id: "consent",
      number: "03",
      title: "Consent",
      content: [
        "By submitting an enquiry, you consent to my using your submitted details to formulate an appropriate educational response.",
        "Consent for educational newsletters is completely separate, optional, and unticked by default. You may withdraw consent at any time by contacting privacy@ahmedbello.com or clicking the unsubscribe link in any message.",
        "Submitting an enquiry does not establish an advisory agreement. Any future formal advisory relationship involves separate regulatory consent documentation."
      ]
    },
    {
      id: "sharing",
      number: "04",
      title: "Who sees it",
      content: [
        "Enquiries are securely delivered via Resend, an enterprise transactional email infrastructure. Data is processed securely under rigorous industry standards.",
        "I never sell, rent, lease, or monetize your contact information, and I never supply visitor data to third-party advertising networks or data brokers."
      ]
    },
    {
      id: "analytics",
      number: "05",
      title: "Analytics and privacy",
      content: [
        "This website prioritizes visitor privacy and does not use cross-site behavioural profiling cookies or advertising trackers.",
        "To understand which educational guides and calculators visitors find most useful, this website utilizes privacy-friendly, aggregated web analytics (such as Vercel Web Analytics). If Google Analytics is enabled for performance monitoring, it operates strictly in privacy mode with IP anonymization enabled. No personally identifiable financial data, account values, or form contents are ever sent to analytics platforms, sold, or shared with third-party advertising brokers.",
        "Visitors can browse with complete privacy and may opt out of analytical telemetry at any time by enabling Global Privacy Control (GPC) or 'Do Not Track' in their web browser."
      ]
    },
    {
      id: "retention",
      number: "06",
      title: "How long I keep it",
      content: [
        "I retain personal information only for as long as necessary to fulfill the purpose of your enquiry or comply with applicable Canadian regulatory record-keeping standards.",
        "Enquiries that do not transition into active advisory engagements are systematically purged after reasonable fulfillment."
      ]
    },
    {
      id: "safeguards",
      number: "07",
      title: "Safeguards",
      content: [
        "All website communications are secured over TLS/HTTPS encryption. Input submissions are validated server-side, checked against injection vulnerabilities, and protected by strict rate limits. Message bodies are not written into public server logs."
      ]
    },
    {
      id: "rights",
      number: "08",
      title: "Your rights",
      content: [
        "Under Canadian federal and provincial privacy laws (including PIPEDA), you have the right to request access to the personal data held about you, correct inaccuracies, or request data deletion.",
        "To exercise these rights, email privacy@ahmedbello.com. Requests receive a written response within 30 days. You may also contact the Office of the Privacy Commissioner of Canada (priv.gc.ca)."
      ]
    },
    {
      id: "email",
      number: "09",
      title: "Commercial emails",
      content: [
        "In strict compliance with Canada's Anti-Spam Legislation (CASL), I only send educational newsletters to recipients who have provided explicit consent. Every message contains complete sender identification and a one-click unsubscribe mechanism."
      ]
    },
    {
      id: "changes",
      number: "10",
      title: "Changes",
      content: [
        "Any material updates to this privacy policy will be posted on this page with the effective date noted."
      ]
    }
  ]
};

export const standardsData: LegalPageData = {
  title: "How the information here is produced and checked.",
  lede: "Good financial education should be easy to verify. This page explains how the guides on this site are sourced, dated, reviewed and corrected.",
  sections: [
    {
      id: "purpose",
      number: "01",
      title: "What this site is for",
      content: [
        "The guides and essays on this site explain how Canadian financial rules and concepts work. They are general education. They are not personalized financial, tax, legal or investment advice, and they are not an offer to sell any product.",
        "A guide can tell you how a TFSA, an RRSP or an RESP works. It cannot tell you which is right for you, because that depends on facts about your situation that a web page does not have."
      ]
    },
    {
      id: "sources",
      number: "02",
      title: "Where the facts come from",
      content: [
        "Rules, limits and benefit amounts come from official sources: the Canada Revenue Agency, other Government of Canada departments, the Office of the Superintendent of Bankruptcy and securities regulators. Every guide ends with the sources it relies on, linked so you can check them yourself.",
        "• No statistic, study, quotation or testimonial appears without a source you can open.",
        "• When a figure is our own arithmetic rather than a published amount, the guide says so (for example, “our calculation, not a published amount”).",
        "• Where a rule depends on a province or on a person’s circumstances, the guide says that instead of generalizing."
      ]
    },
    {
      id: "dates",
      number: "03",
      title: "Dates and changing rules",
      content: [
        "Tax limits are reset each year, and some benefit amounts are adjusted every quarter. Guides that contain figures show a “Figures as of” line beside them, naming the tax year or period they apply to.",
        "Publication dates are shown only where a piece has actually been approved and published. Dates are never back-filled. Treat any figure as a starting point and confirm it with the official source before acting."
      ]
    },
    {
      id: "examples",
      number: "04",
      title: "Hypothetical examples",
      content: [
        "Worked examples use invented numbers chosen to make a concept easy to see, and they are labelled “Hypothetical figures”. They are not predictions, projections or typical results.",
        "Examples are simplified. Unless a guide says otherwise, they leave out fees, taxes and the fact that real investment returns vary from year to year. A steady rate of return in an example shows how arithmetic works, not what to expect."
      ]
    },
    {
      id: "review",
      number: "05",
      title: "Review and approval",
      content: [
        "Each guide and essay is reviewed by Ahmed Bello before it is published to ensure compliance with Canadian financial regulations and strict factual accuracy.",
        "Content that has not met these rigorous standards is not published. Material is periodically re-audited whenever federal limits or provincial guidelines are revised."
      ]
    },
    {
      id: "independence",
      number: "06",
      title: "Independence and objectivity",
      content: [
        "Ahmed is an independent licensed financial professional. The educational materials are authored to present balanced, objective evaluations of trade-offs, advantages, and limitations across registered accounts, debt choices, and protection strategies.",
        "The site carries zero sponsored advertising, paid editorial placements, affiliate links, or third-party endorsements."
      ]
    },
    {
      id: "corrections",
      number: "07",
      title: "Corrections",
      content: [
        "If you think something here is wrong, out of date or unclear, please say so through the contact form. A confirmed error is corrected promptly, and a material correction is noted on the page rather than silently changed."
      ]
    },
    {
      id: "limits",
      number: "08",
      title: "What this site does not do",
      content: [
        "• It does not give personalized recommendations or tell you what to buy.",
        "• It does not promise returns, tax savings, insurance outcomes or financial independence.",
        "• It does not publish testimonials, reviews or client results.",
        "• It does not ask for account numbers, government ID numbers, medical details or financial documents."
      ]
    }
  ]
};

export const termsData: LegalPageData = {
  title: "Terms for using this website.",
  lede: "A short set of ground rules. The most important one: this site educates, it does not advise.",
  sections: [
    {
      id: "purpose",
      number: "01",
      title: "What this website is for",
      content: [
        "This website provides general financial education for people in Canada. It is not personalized financial, tax, legal or investment advice, and nothing on it is an offer or solicitation to buy or sell any product. Please read the disclosures."
      ]
    },
    {
      id: "relationship",
      number: "02",
      title: "No advisory relationship",
      content: [
        "Visiting this website, reading it or sending a message through it does not create an advisory, professional or client relationship, and does not mean any particular service is available to you. A relationship begins only when we both agree to one in writing and any required documents have been completed."
      ]
    },
    {
      id: "accuracy",
      number: "03",
      title: "Accuracy and currency",
      content: [
        "I take care to keep the information accurate, and I link to official sources, but laws, limits and programs change, and information may be out of date or incomplete. Examples use hypothetical figures and are not predictions. Check current details with the source and with a qualified professional before acting."
      ]
    },
    {
      id: "links",
      number: "04",
      title: "Third-party links",
      content: [
        "Links to other websites are provided for convenience. I do not control those sites and am not responsible for their content or practices."
      ]
    },
    {
      id: "content",
      number: "05",
      title: "Content and copyright",
      content: [
        "The text, design and code of this website belong to Ahmed Bello unless stated otherwise. You may share links and quote short excerpts with attribution. Please do not copy articles or pages in full without permission."
      ]
    },
    {
      id: "liability",
      number: "06",
      title: "Limits of liability",
      content: [
        "To the extent permitted by applicable Canadian law, I am not liable for losses arising from your use of, or reliance on, information on this website. Nothing here limits any statutory liability that cannot legally be limited under Canadian provincial legislation."
      ]
    },
    {
      id: "privacy",
      number: "07",
      title: "Privacy",
      content: [
        "How personal information is handled is described in the privacy notice."
      ]
    }
  ]
};

export const disclosuresDataFr: LegalPageData = {
  title: "Fonctionnement du site web et champ professionnel.",
  lede: "La version en langage clair : mon champ de pratique agréé, ma rémunération et la frontière déontologique où s'arrête l'éducation financière générale.",
  sections: [
    {
      id: "education",
      number: "01",
      title: "Éducation financière, non un conseil personnalisé",
      content: [
        "L'ensemble du contenu publié sur ce site web constitue une information générale ayant pour but de vulgariser les concepts financiers canadiens. Il ne prend en compte aucune circonstance individuelle et ne constitue en aucun cas un conseil financier, fiscal, juridique ou d'investissement personnalisé, ni une offre de souscription ou de vente de produit quelconque.",
        "Les règles fiscales, les plafonds et les programmes gouvernementaux évoluent régulièrement. Lorsque des chiffres et des barèmes sont présentés, ils sont rigoureusement datés et renvoient directement aux sources officielles (ARC, ministères, organismes de réglementation). Confirmez toujours les détails en vigueur auprès des sources officielles et d'un conseiller qualifié avant d'agir."
      ]
    },
    {
      id: "affiliation",
      number: "02",
      title: "Identité et portée professionnelle",
      content: [
        "Professionnel agréé en solutions financières au Canada.",
        "J'exerce en tant que conseiller indépendant fournissant de l'éducation patrimoniale, des stratégies relatives aux comptes enregistrés et des solutions financières adaptées aux familles et entreprises à travers le Canada.",
        "Je ne prétends pas agir à titre de gestionnaire de portefeuille discrétionnaire, d'expert-comptable agréé, d'avocat fiscaliste ou de planificateur à honoraires exclusifs. Lorsqu'une situation nécessite ces compétences spécialisées, je vous oriente systématiquement vers les professionnels dûment qualifiés et membres de leurs ordres respectifs."
      ]
    },
    {
      id: "licences",
      number: "03",
      title: "Agréments et juridictions autorisées",
      content: [
        "Les produits et services financiers ne peuvent être proposés que dans les provinces et territoires canadiens où le professionnel est titulaire d'un permis d'exercice en règle auprès du régulateur provincial concerné (par exemple la FCSC au Nouveau-Brunswick, l'ARSF en Ontario, l'AIC en Alberta, ou l'AMF au Québec).",
        "Les ressources éducatives de ce site sont librement accessibles à tous, mais la disponibilité des consultations individuelles et des solutions dépend des autorisations provinciales en vigueur. Si je ne suis pas habilité à intervenir dans votre juridiction, je vous en informerai avec une totale transparence."
      ]
    },
    {
      id: "compensation",
      number: "04",
      title: "Structure de rémunération",
      content: [
        "La transparence déontologique concernant la rémunération est primordiale. Les guides éducatifs, articles d'analyse et entretiens exploratoires initiaux proposés sur ce site web sont entièrement gratuits.",
        "Si vous choisissez de mettre en place une solution financière ou d'assurance par le biais de mon cabinet, la rémunération prend généralement la forme de commissions institutionnelles versées par les assureurs partenaires selon les barèmes réglementés. Toute structure de rémunération vous est intégralement exposée par écrit avant la mise en œuvre de la moindre recommandation."
      ]
    },
    {
      id: "referrals",
      number: "05",
      title: "Orientation vers d'autres professionnels",
      content: [
        "Lorsque la complexité d'un dossier requiert la rédaction d'un testament notarié, un audit comptable d'entreprise ou la constitution d'une fiducie familiale, je vous oriente vers des notaires, avocats ou comptables professionnels agréés (CPA) indépendants.",
        "Aucune commission d'intermédiation occulte ne m'est versée pour ces recommandations déontologiques."
      ]
    }
  ]
};

export const privacyDataFr: LegalPageData = {
  title: "Avis de confidentialité et protection des renseignements personnels.",
  lede: "Transparence absolue sur la collecte, l'utilisation et la conservation de vos données, en stricte conformité avec la LPRPDE et les normes canadiennes de protection de la vie privée.",
  sections: [
    {
      id: "collection",
      number: "01",
      title: "Renseignements recueillis",
      content: [
        "Nous ne recueillons que les informations strictement nécessaires que vous fournissez volontairement lors de l'envoi d'un formulaire de contact ou d'inscription à l'infolettre éducative : prénom, adresse courriel, numéro de téléphone (optionnel), province de résidence et objet de votre question.",
        "Ne transmettez jamais par le biais de ces formulaires des données sensibles comme votre numéro d'assurance sociale (NAS), vos numéros de comptes bancaires ou vos bilans médicaux."
      ]
    },
    {
      id: "usage",
      number: "02",
      title: "Utilisation des données",
      content: [
        "Vos coordonnées sont utilisées exclusivement par Ahmed Bello pour répondre à votre demande d'information, organiser un entretien d'orientation ou vous acheminer notre veille réglementaire mensuelle si vous avez confirmé votre abonnement (double opt-in CASL).",
        "Vos données personnelles ne sont jamais vendues, louées, cédées ni partagées avec des tiers publicitaires."
      ]
    },
    {
      id: "security",
      number: "03",
      title: "Mesures de sécurité et chiffrement",
      content: [
        "Toutes les communications sur ce site web sont sécurisées par un chiffrement de niveau bancaire TLS/HTTPS. Les soumissions de formulaires font l'objet d'une validation rigoureuse côté serveur, de contrôles anti-robots et de limites de débit strictes.",
        "Les enregistrements de consentement CASL sont authentifiés par jeton cryptographique horodaté et conservés dans une base de données sécurisée."
      ]
    },
    {
      id: "rights",
      number: "04",
      title: "Vos droits d'accès et de rectification",
      content: [
        "Conformément à la Loi sur la protection des renseignements personnels et les documents électroniques (LPRPDE), vous disposez du droit d'accéder aux données vous concernant, d'exiger leur rectification ou de demander leur suppression définitive.",
        "Pour exercer ce droit ou pour toute question déontologique, écrivez directement à privacy@ahmedbello.com. Une réponse écrite vous sera apportée sous 30 jours."
      ]
    }
  ]
};

export const standardsDataFr: LegalPageData = {
  title: "Normes éditoriales et vérification des sources officielles.",
  lede: "Une éducation financière de premier plan doit être vérifiable à la source. Cette page détaille comment nos analyses sont rédigées, vérifiées, datées et actualisées.",
  sections: [
    {
      id: "purpose",
      number: "01",
      title: "Vocation pédagogique",
      content: [
        "Les guides et analyses de ce site expliquent le fonctionnement réel de la fiscalité et des instruments financiers canadiens. Ils constituent une formation générale et ne remplacent pas une consultation personnalisée.",
        "Un guide expose la mécanique d'un CELI, REER, CELIAPP ou REEE avec ses arbitrages mathématiques, mais ne saurait préconiser une allocation unique, chaque situation familiale comportant des paramètres fiscaux propres."
      ]
    },
    {
      id: "sources",
      number: "02",
      title: "Origine des données et rigueur factuelle",
      content: [
        "Les règles, barèmes et seuils cités proviennent exclusivement des instances officielles : Agence du revenu du Canada (ARC), Bureau du surintendant des institutions financières (BSIF), Banque du Canada et organismes provinciaux de réglementation des marchés financiers.",
        "Chaque guide se conclut par la liste explicite des sources officielles consultées avec liens directs permettant au lecteur de valider lui-même chaque point de droit."
      ]
    },
    {
      id: "dates",
      number: "03",
      title: "Actualisation et indexation réglementaire",
      content: [
        "Les plafonds de cotisation et les tranches d'imposition sont indexés annuellement par l'ARC. Nos dossiers analytiques portent la mention claire de l'année d'imposition à laquelle ils s'appliquent.",
        "Toute modification réglementaire majeure (ex. : révision des critères du BSIF, taux préscrits de l'ARC, projet de loi C-69) entraîne une mise à jour immédiate de nos articles avec horodatage de révision."
      ]
    },
    {
      id: "corrections",
      number: "04",
      title: "Signalement d'erreur et rectifications",
      content: [
        "Si vous relevez une inexactitude, une formulation ambiguë ou un changement de barème non encore reflété, veuillez nous en faire part via notre formulaire de contact. Toute correction confirmée fait l'objet d'une mention éditoriale transparente."
      ]
    }
  ]
};

export const termsDataFr: LegalPageData = {
  title: "Conditions d'utilisation du site web.",
  lede: "Règles simples et essentielles. La plus importante : ce site informe et éduque, il ne dispense pas de conseils financiers personnalisés sans mandat écrit préalable.",
  sections: [
    {
      id: "purpose",
      number: "01",
      title: "Objet du site web",
      content: [
        "Ce site diffuse des ressources d'éducation financière destinées aux résidents canadiens. Aucun élément publié ne constitue une sollicitation, une incitation ou une offre contractuelle d'achat ou de vente de produits financiers."
      ]
    },
    {
      id: "relationship",
      number: "02",
      title: "Absence de relation de conseil automatique",
      content: [
        "La navigation sur ce site, la lecture d'articles ou l'envoi d'un message via un formulaire ne créent aucune relation contractuelle ou professionnelle de conseil. Une telle relation n'est établie qu'après signature d'une convention écrite bilatérale et vérification des critères réglementaires de convenance."
      ]
    },
    {
      id: "accuracy",
      number: "03",
      title: "Exactitude des informations",
      content: [
        "Bien que nous apportions le plus grand soin à la rigueur de nos contenus et à leur adossement aux sources étatiques, les lois et programmes évoluent. Les exemples chiffrés sont strictement hypothétiques et n'ont aucune valeur de prédiction."
      ]
    },
    {
      id: "content",
      number: "04",
      title: "Propriété intellectuelle",
      content: [
        "Les textes, guides d'analyse, simulateurs et éléments graphiques de ce site sont la propriété exclusive d'Ahmed Bello, sauf indication contraire. Les citations courtes accompagnées d'un lien d'attribution sont autorisées. Toute reproduction intégrale sans autorisation préalable écrite est formellement prohibée."
      ]
    },
    {
      id: "liability",
      number: "05",
      title: "Limitation de responsabilité",
      content: [
        "Dans toute la mesure permise par les lois canadiennes en vigueur, l'éditeur ne saurait être tenu responsable des décisions prises ou des pertes directes ou indirectes résultant de l'utilisation des informations générales contenues sur ce site."
      ]
    }
  ]
};
