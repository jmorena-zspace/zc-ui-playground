import { type FC } from 'react';

type ForbiddenErrorProps = {
  message: string;
};

const isDevelopment = import.meta.env.DEV;

export const ForbiddenError: FC<ForbiddenErrorProps> = ({ message }) => {

  return (
    <div className="flex flex-col text-center items-center justify-center gap-md">
      <h2 className="text-display-lg md:text-display-xl font-bold text-content-inverse-primary">
        You do not have access
      </h2>

      {isDevelopment && (
        <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
          {message}
        </p>
      )}

      <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
        Ask an administrator if you think this is a mistake.
      </p>
    </div>
  );
};
