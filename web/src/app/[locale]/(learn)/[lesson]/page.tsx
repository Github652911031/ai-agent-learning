import Link from "next/link";
import { LEARNING_PATH, LESSON_META, LAYERS } from "@/lib/constants";
import { LayerBadge } from "@/components/ui/badge";
import versionsData from "@/data/generated/versions.json";
import { LessonDetailClient } from "./client";
import { getTranslations } from "@/lib/i18n-server";

export function generateStaticParams() {
  return LEARNING_PATH.map((lesson) => ({ lesson }));
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ locale: string; lesson: string }>;
}) {
  const { locale, lesson } = await params;

  const lessonData = versionsData.versions.find((v) => v.id === lesson);
  const meta = LESSON_META[lesson];

  if (!meta) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold">Lesson not found</h1>
        <p className="mt-2 text-zinc-500">{lesson}</p>
      </div>
    );
  }

  const t = getTranslations(locale, "lesson");
  const tLesson = getTranslations(locale, "lessons");
  const tLayer = getTranslations(locale, "layer_labels");
  const layer = LAYERS.find((l) => l.id === meta.layer);

  const pathIndex = LEARNING_PATH.indexOf(lesson as typeof LEARNING_PATH[number]);
  const prevLesson = pathIndex > 0 ? LEARNING_PATH[pathIndex - 1] : null;
  const nextLesson =
    pathIndex < LEARNING_PATH.length - 1
      ? LEARNING_PATH[pathIndex + 1]
      : null;

  const title = locale === "zh" ? meta.titleZh : meta.title;
  const subtitle = locale === "zh" ? meta.subtitleZh : meta.subtitle;
  const keyInsight = locale === "zh" ? meta.keyInsightZh : meta.keyInsight;

  return (
    <div className="mx-auto max-w-3xl space-y-10 py-4">
      {/* Header */}
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-lg bg-zinc-100 px-3 py-1 font-mono text-lg font-bold dark:bg-zinc-800">
            {lesson}
          </span>
          <h1 className="text-2xl font-bold sm:text-3xl">
            {tLesson(lesson) || title}
          </h1>
          {layer && (
            <LayerBadge layer={meta.layer}>{tLayer(layer.id)}</LayerBadge>
          )}
        </div>
        <p className="text-lg text-zinc-500 dark:text-zinc-400">
          {subtitle}
        </p>
        <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-500 dark:text-zinc-400">
          {lessonData && (
            <>
              <span className="font-mono">{lessonData.loc} LOC</span>
              <span>{lessonData.tools.length} {t("tools")}</span>
            </>
          )}
          {meta.coreAddition && (
            <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs dark:bg-zinc-800">
              {meta.coreAddition}
            </span>
          )}
        </div>
        {keyInsight && (
          <blockquote className="border-l-4 border-zinc-300 pl-4 text-sm italic text-zinc-500 dark:border-zinc-600 dark:text-zinc-400">
            {keyInsight}
          </blockquote>
        )}
      </header>

      {/* Client-rendered interactive sections */}
      <LessonDetailClient
        lessonId={lesson}
        source={lessonData?.source ?? ""}
        filename={lessonData?.filename ?? ""}
      />

      {/* Prev / Next navigation */}
      <nav className="flex items-center justify-between border-t border-zinc-200 pt-6 dark:border-zinc-700">
        {prevLesson ? (
          <Link
            href={`/${locale}/${prevLesson}`}
            className="group flex items-center gap-2 text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              &larr;
            </span>
            <div>
              <div className="text-xs text-zinc-400">{t("prev")}</div>
              <div className="font-medium">
                {prevLesson} - {tLesson(prevLesson) || LESSON_META[prevLesson]?.title}
              </div>
            </div>
          </Link>
        ) : (
          <div />
        )}
        {nextLesson ? (
          <Link
            href={`/${locale}/${nextLesson}`}
            className="group flex items-center gap-2 text-right text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:hover:text-white"
          >
            <div>
              <div className="text-xs text-zinc-400">{t("next")}</div>
              <div className="font-medium">
                {tLesson(nextLesson) || LESSON_META[nextLesson]?.title} - {nextLesson}
              </div>
            </div>
            <span className="transition-transform group-hover:translate-x-1">
              &rarr;
            </span>
          </Link>
        ) : (
          <div />
        )}
      </nav>
    </div>
  );
}
