import { type FC } from 'react';

export const NotFoundError: FC = () => {
  return (
    <div className="flex flex-col text-center items-center justify-center gap-md">
      <h2 className="text-display-lg md:text-display-xl font-bold text-content-inverse-primary">
        Lesson not found
      </h2>
      <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
        This lesson may have been moved or removed.
      </p>
    </div>
  );
};
