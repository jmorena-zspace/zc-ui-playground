import { environment } from '@constants/environment';
import clsx from 'clsx';
import { type FC } from 'react';

export const NotAllowedDomain: FC = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center gap-md">
      <h2 className="text-display-lg md:text-display-xl font-bold text-content-inverse-primary">
        Domain not allowed
      </h2>
      <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
        You are not allowed to access this site
      </p>

      <a
        href={environment.zspaceUrl}
        className={clsx(
          'text-body-lg md:text-display-xs cursor-pointer text-content-inverse-link-action-default',
          'transition-all duration-100',
          'underline md:underline-grow'
        )}
      >
        Go back to zSpace
      </a>
    </div>
  );
};
