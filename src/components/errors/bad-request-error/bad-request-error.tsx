import { FC } from 'react';

export const BadRequestError: FC = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center gap-md">
      <h2 className="text-display-lg md:text-display-xl font-bold text-content-inverse-primary">
        That request did not work
      </h2>
      <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
        Check the link you followed and try again.
      </p>
    </div>
  );
};
