import {
  andOrCircuits,
  bioDigitalHuman,
  franklinsLab,
  lessonSingleApp,
} from '@fixtures/content-items';
import { LessonCard } from '@components/cards/lesson-card/lesson-card';
import { ArrowLeft } from 'lucide-react';
import type { FC, ReactNode } from 'react';
import { toast } from 'sonner';

const Section: FC<{ title: string; note: string; children: ReactNode }> = ({
  title,
  note,
  children,
}) => (
  <section className="flex flex-col gap-sm">
    <div className="flex flex-col gap-xxs">
      <h2 className="font-display text-display-xs text-content-primary">
        {title}
      </h2>
      <p className="text-body-md text-content-secondary">{note}</p>
    </div>
    {children}
  </section>
);

export const LessonCardPlayground: FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const open = (name: string) => toast(`Opened details for ${name}`);

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-xxl p-lg">
        <header className="flex flex-col gap-sm">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex w-fit items-center gap-xs text-body-md text-content-link-action-default hover:text-content-link-action-hover cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            Card playground
          </button>
          <h1 className="font-display text-display-xl text-content-primary">
            LessonCard
          </h1>
          <p className="max-w-[60ch] text-body-lg text-content-secondary">
            Hover or focus a card: the app row slides up into a launch button,
            and the deep-link code slides out. Desktop-only apps render
            disabled because the fake launch hook reports no native shell.
            Resize below 768px for the stacked mobile layout.
          </p>
        </header>

        <Section
          title="Default"
          note="Three subjects (one overflows to +1), a desktop app with a deep-link code, and a launchable web app."
        >
          <LessonCard lesson={andOrCircuits} onClick={() => open(andOrCircuits.name)} />
        </Section>

        <Section
          title="Single app"
          note="One subject, one web app — every launch button enabled."
        >
          <LessonCard
            lesson={lessonSingleApp}
            onClick={() => open(lessonSingleApp.name)}
          />
        </Section>

        <Section
          title="No image"
          note="Falls back to ImagePlaceholder. Both apps are desktop-only, so both launch buttons are disabled."
        >
          <LessonCard lesson={franklinsLab} onClick={() => open(franklinsLab.name)} />
        </Section>

        <Section
          title="No apps"
          note="The launch column collapses entirely."
        >
          <LessonCard
            lesson={bioDigitalHuman}
            onClick={() => open(bioDigitalHuman.name)}
          />
        </Section>

        <Section
          title="Compact"
          note="Image hidden and the subject list trimmed to one — used in dense lists."
        >
          <LessonCard
            lesson={andOrCircuits}
            compact
            onClick={() => open(andOrCircuits.name)}
          />
        </Section>

        <Section
          title="Inverted hover"
          note="Stronger hover background, for cards sitting on an inverse surface."
        >
          <div className="rounded-md bg-bg-surface-inverse-default p-md">
            <LessonCard
              lesson={lessonSingleApp}
              invertedHover
              onClick={() => open(lessonSingleApp.name)}
            />
          </div>
        </Section>
      </div>
    </div>
  );
};
