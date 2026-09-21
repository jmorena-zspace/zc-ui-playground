import {
  andOrCircuits,
  bioDigitalHuman,
  lessonSingleApp,
} from '@fixtures/content-items';
import { LessonCard } from '@components/cards/lesson-card/lesson-card';
import { ArrowLeft } from 'lucide-react';
import { useState, type FC } from 'react';
import { toast } from 'sonner';

const lessons = [andOrCircuits, lessonSingleApp, bioDigitalHuman];

export const LessonCardPlayground: FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [selectedIds, setSelectedIds] = useState<ReadonlySet<string>>(
    new Set()
  );

  const toggleSelected = (id: string, selected: boolean) => {
    setSelectedIds((current) => {
      const next = new Set(current);
      if (selected) {
        next.add(id);
      } else {
        next.delete(id);
      }
      return next;
    });
  };

  return (
    <div className="h-full overflow-y-auto">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-lg p-lg">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit cursor-pointer items-center gap-xs text-body-md text-content-link-action-default hover:text-content-link-action-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="flex flex-col gap-xs">
          {lessons.map((lesson) => (
            <LessonCard
              key={lesson.id}
              lesson={lesson}
              selectable
              selected={selectedIds.has(lesson.id)}
              onSelectedChange={(selected) =>
                toggleSelected(lesson.id, selected)
              }
              onClick={() => toast(`Opened ${lesson.name}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
