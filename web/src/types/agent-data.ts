export interface LessonVersion {
  id: string;
  filename: string;
  title: string;
  subtitle: string;
  loc: number;
  tools: string[];
  newTools: string[];
  coreAddition: string;
  keyInsight: string;
  classes: { name: string; startLine: number; endLine: number }[];
  methods: { name: string; signature: string; startLine: number }[];
  layer: "tools" | "planning" | "memory" | "concurrency" | "collaboration";
  source: string;
}

export interface LessonDiff {
  from: string;
  to: string;
  newClasses: string[];
  newMethods: string[];
  newTools: string[];
  locDelta: number;
}

export interface DocContent {
  version: string;
  locale: "en" | "zh";
  title: string;
  content: string;
}

export interface LessonIndex {
  versions: LessonVersion[];
  diffs: LessonDiff[];
}
