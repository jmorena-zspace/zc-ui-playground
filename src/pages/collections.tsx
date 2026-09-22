import { CollectionFolderCard } from '@components/cards/collection-folder-card/collection-folder-card';
import { pathwayCategories } from '@fixtures/pathway-categories';
import { ArrowLeft } from 'lucide-react';
import { type FC } from 'react';
import { toast } from 'sonner';

export const CollectionsPage: FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="h-full overflow-y-auto bg-bg-surface-default">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-xxl p-lg">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit cursor-pointer items-center gap-xs text-body-md text-content-link-action-default hover:text-content-link-action-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>

        <div className="grid grid-cols-1 gap-x-lg gap-y-xxl sm:grid-cols-2 lg:grid-cols-3">
          {pathwayCategories.map((category) => (
            <CollectionFolderCard
              key={category.id}
              name={category.name}
              count={category.count}
              icons={category.icons}
              onClick={() => toast(`Opening ${category.name}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
