import { type FC } from 'react';
import { NotAllowedDomain } from './not-allowed-domain';
import { RedirectToLogin } from './redirect-to-login';

type UnauthorizedErrorProps = {
  authUrl?: string;
  isNotAllowedDomain?: boolean;
};

export const UnauthorizedError: FC<UnauthorizedErrorProps> = ({
  authUrl,
  isNotAllowedDomain = false,
}) => {
  if (authUrl) {
    return <RedirectToLogin authUrl={authUrl} />;
  }

  if (isNotAllowedDomain) {
    return <NotAllowedDomain />;
  }

  return (
    <div className="flex flex-col text-center items-center justify-center gap-md">
      <h2 className="text-display-lg md:text-display-xl font-bold text-content-inverse-primary">
        Authentication error
      </h2>
      <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
        Unexpected authentication error
      </p>
    </div>
  );
};
