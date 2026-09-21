import { AppErrorType, type AppError } from '@shared/types';
import { transformToAppError } from '@shared/utils';
import { isAxiosError, type AxiosError } from 'axios';
import { useMemo, type FC } from 'react';
import { BadRequestError } from './bad-request-error/bad-request-error';
import { ForbiddenError } from './forbidden-error/forbidden-error';
import { InternalServerError } from './internal-server-error/internal-server-error';
import { NotFoundError } from './not-found-error/not-found-error';
import { UnauthorizedError } from './unauthorized-error/unauthorized-error';

type ErrorBoundaryProps = {
  error: AxiosError | AppError;
};

export const ErrorBoundary: FC<ErrorBoundaryProps> = ({ error }) => {
  const appError = useMemo(() => {
    if (isAxiosError(error)) {
      return transformToAppError(error);
    }

    return error;
  }, [error]);

  const authUrl = useMemo(() => {
    return appError.data?.authUrl;
  }, [appError]);

  const isNotAllowedDomain = useMemo(() => {
    return appError.data?.isAllowedDomain === false;
  }, [appError]);

  const errorContent = useMemo(() => {
    switch (appError.type) {
      case AppErrorType.UNAUTHORIZED:
        return (
          <UnauthorizedError
            authUrl={authUrl}
            isNotAllowedDomain={isNotAllowedDomain}
          />
        );

      case AppErrorType.FORBIDDEN:
        return <ForbiddenError message={appError.message} />;

      case AppErrorType.NOT_FOUND:
        return <NotFoundError />;

      case AppErrorType.BAD_REQUEST:
        return <BadRequestError />;

      case AppErrorType.INTERNAL_SERVER_ERROR:
      default:
        return <InternalServerError message={appError.message} />;
    }
  }, [appError, authUrl, isNotAllowedDomain]);

  return (
    <div className="flex items-center justify-center h-full p-6">
      {errorContent}
    </div>
  );
};
