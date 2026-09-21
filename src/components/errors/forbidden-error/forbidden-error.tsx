import { type FC } from 'react';

type ForbiddenErrorProps = {
  message: string;
};

const isDevelopment = import.meta.env.DEV;

export const ForbiddenError: FC<ForbiddenErrorProps> = ({ message }) => {

  return (
    <div className="flex flex-col text-center items-center justify-center gap-md">
      <h2 className="text-display-lg md:text-display-xl font-bold text-content-inverse-primary">
        Forbidden error title
      </h2>

      {isDevelopment && (
        <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
          {message}
        </p>
      )}

      <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
        Forbidden error message
      </p>
    </div>
  );
};
