import { type FC } from 'react';

type InternalServerErrorProps = {
  message: string;
};

const isDevelopment = import.meta.env.DEV;

export const InternalServerError: FC<InternalServerErrorProps> = ({
  message,
}) => {

  return (
    <div className="flex flex-col text-center items-center justify-center gap-md">
      <h2 className="text-display-lg md:text-display-xl font-bold text-content-inverse-primary">
        Something went wrong
      </h2>

      {isDevelopment && (
        <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
          {message}
        </p>
      )}

      <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
        We could not load this lesson. Try again in a moment.
      </p>
    </div>
  );
};
