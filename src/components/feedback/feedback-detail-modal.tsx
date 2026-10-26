import { BlurredModal } from '@components/modals/blurred-modal';
import type { FeedbackEntry } from '@fixtures/feedback-entries';
import { Calendar, FileText, MapPin, X } from 'lucide-react';
import { FC } from 'react';
import { RATING_SCALE } from './rating-scale';

type FeedbackDetailModalProps = {
  entry: FeedbackEntry | null;
  onClose: () => void;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const Field: FC<{ icon: typeof Calendar; label: string; value: string }> = ({
  icon: Icon,
  label,
  value,
}) => (
  <div className="flex items-start gap-sm">
    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-content-tertiary" />
    <div className="flex flex-col">
      <span className="text-body-sm text-content-tertiary">{label}</span>
      <span className="text-body-md text-content-primary">{value}</span>
    </div>
  </div>
);

export const FeedbackDetailModal: FC<FeedbackDetailModalProps> = ({
  entry,
  onClose,
}) => {
  const rating = entry
    ? RATING_SCALE.find((r) => r.value === entry.rating)
    : undefined;

  return (
    <BlurredModal
      show={entry != null}
      onClose={onClose}
      centered
      ariaLabel="Feedback details"
    >
      {entry && rating && (
        <div className="mx-auto flex w-[420px] flex-col gap-lg rounded-sm border border-border-system-subtle bg-bg-surface-default p-lg shadow-lg outline-none">
          <div className="flex items-start justify-between gap-sm">
            <div className="flex items-center gap-sm">
              <span className="flex h-11 w-11 items-center justify-center rounded-full bg-bg-surface-strong text-content-primary">
                <rating.icon className="h-6 w-6" />
              </span>
              <div className="flex flex-col">
                <span className="text-body-lg font-medium text-content-primary">
                  {rating.label}
                </span>
                <span className="text-body-sm text-content-tertiary">
                  {`Rated ${entry.rating} of 5`}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="icon-btn icon-btn-on-surface text-content-secondary"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-md">
            <Field
              icon={Calendar}
              label="Date"
              value={formatDate(entry.submittedAt)}
            />
            <Field icon={MapPin} label="Location" value={entry.location} />
            <Field icon={FileText} label="Page" value={entry.page} />
            <Field
              icon={FileText}
              label="App version"
              value={entry.appVersion}
            />
          </div>

          <div className="flex flex-col gap-xs border-t border-border-system-subtle pt-md">
            <span className="text-body-sm font-medium text-content-primary">
              Comment
            </span>
            <p className="text-body-md text-content-secondary">
              {entry.comment || 'No additional comments were left.'}
            </p>
          </div>
        </div>
      )}
    </BlurredModal>
  );
};
