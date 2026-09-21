import { FC } from 'react';

export const BadRequestError: FC = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center gap-md">
      <h2 className="text-display-lg md:text-display-xl font-bold text-content-inverse-primary">
        Bad request error title
      </h2>
      <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
        Bad request error message
      </p>
    </div>
  );
};
