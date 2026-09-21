import { andOrCircuits } from '@fixtures/content-items';
import { LessonCard } from '@components/cards/lesson-card/lesson-card';
import { ArrowLeft } from 'lucide-react';
import { useState, type FC } from 'react';
import { toast } from 'sonner';

export const LessonCardPlayground: FC<{ onBack: () => void }> = ({
  onBack,
}) => {
  const [selected, setSelected] = useState(false);

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

        <LessonCard
          lesson={andOrCircuits}
          selectable
          selected={selected}
          onSelectedChange={setSelected}
          onClick={() => toast(`Opened ${andOrCircuits.name}`)}
        />
      </div>
    </div>
  );
};
