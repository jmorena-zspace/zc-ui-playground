import { UserFeedbackWidget } from '@components/feedback/user-feedback-widget';
import { ArrowLeft } from 'lucide-react';
import { type FC } from 'react';

export const UserFeedbackPage: FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
    <div className="h-full overflow-y-auto bg-bg-surface-default">
      <div className="mx-auto flex max-w-[1080px] flex-col gap-lg p-lg">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex w-fit cursor-pointer items-center gap-xs text-body-md text-content-link-action-default hover:text-content-link-action-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </button>
      </div>

      <UserFeedbackWidget />
    </div>
  );
};
