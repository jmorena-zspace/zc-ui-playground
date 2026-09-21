import clsx from 'clsx';
import { Spinner } from '@components/ui/spinner';
import { useEffect, type FC } from 'react';

type RedirectToLoginProps = {
  authUrl: string;
  redirectToLoginTimeoutSeconds?: number;
};

export const RedirectToLogin: FC<RedirectToLoginProps> = ({
  authUrl,
  redirectToLoginTimeoutSeconds = 2,
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      window.location.assign(authUrl);
    }, redirectToLoginTimeoutSeconds * 1000);

    return () => clearTimeout(timeout);
  }, [redirectToLoginTimeoutSeconds, authUrl]);

  return (
    <div className="flex flex-col text-center items-center justify-center gap-md">
      <h2 className="text-display-lg md:text-display-xl font-bold text-content-inverse-primary">
        Redirecting to login...
      </h2>

      <Spinner className="size-10 md:size-15" />

      <a
        href={authUrl}
        className={clsx(
          'text-body-lg md:text-display-xs cursor-pointer text-content-inverse-link-action-default',
          'transition-all duration-100',
          'underline md:underline-grow'
        )}
      >
        Go to login now
      </a>
    </div>
  );
};
