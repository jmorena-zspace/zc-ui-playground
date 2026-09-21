import { faPlugCircleXmark } from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { FC } from 'react';

export type NoInternetConnectionBadgeProps = {
  onClick: () => void;
};

export const NoInternetConnectionBadge: FC<NoInternetConnectionBadgeProps> = ({
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      type="button"
      className="flex items-center gap-xxs px-xs py-xxs rounded-full bg-bg-surface-status-negative-strong border border-border-input-status-negative-strong text-content-on-status-negative-strong cursor-pointer"
    >
      <FontAwesomeIcon icon={faPlugCircleXmark} className="text-xl" />
      <span className="text-body-md font-medium ">
        Offline
      </span>
    </button>
  );
};
