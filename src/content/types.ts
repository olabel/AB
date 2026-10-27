export interface ArticleSource {
  label: string;
  url: string;
  note?: string;
}

export interface ArticleExampleTable {
  head: string[];
  rows: string[][];
}

export interface ArticleExample {
  title: string;
  intro: string;
  table?: ArticleExampleTable;
  notes?: string[];
}

export interface ArticleMisunderstanding {
  myth: string;
  reality: string;
}

export interface Article {
  slug: string;
  kind: "guide" | "insight";
  title: string;
  seoTitle?: string;
  description: string;
  question: string;
  category: string;
  figuresAsOf?: string;
  problem: string;
  overview: string[];
  example?: ArticleExample;
  misunderstandings: ArticleMisunderstanding[];
  tradeoffs: string[];
  questions: string[];
  sources: ArticleSource[];
  related: string[];
  contactTopic: string;
  invitationAbout: string;
  url: string;
  readingMinutes: number;
}

export interface Category {
  id: string;
  label: string;
  blurb: string;
}

export interface DecisionNode {
  id: string;
  label: string;
  x: number;
  y: number;
  label_dx: number;
  label_dy: number;
  anchor: string;
}

export interface DecisionEdge {
  a: string;
  b: string;
  text: string;
}

export interface DecisionMapData {
  nodes: DecisionNode[];
  edges: DecisionEdge[];
}

export interface HowIHelpConcept {
  term: string;
  plain: string;
}

export interface HowIHelpNextStep {
  label: string;
  href: string;
}

export interface HowIHelpTopic {
  id: string;
  short: string;
  question: string;
  why: string;
  concepts: HowIHelpConcept[];
  tradeoffs: string[];
  next: HowIHelpNextStep[];
  contactTopic: string;
}

export interface AboutData {
  portrait: string | null;
  portraitWidth: number;
  portraitHeight: number;
  portraitAlt: string;
  background: string[];
  credentials: string[];
  scopeStatement: string | null;
  approachDraft: string[];
  questionsEnjoyed: string[];
}
