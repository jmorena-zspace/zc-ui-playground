import { Unplug } from 'lucide-react';
import { type FC } from 'react';

export const NoInternetConnectionError: FC = () => {

  return (
    <div className="flex flex-col text-center items-center justify-center gap-xl h-full">
      <div className="flex text-display-lg md:text-display-xl text-content-inverse-primary gap-sm">
        <Unplug className="h-4 w-4" />
        <h2 className="font-bold">
          You are offline
        </h2>
      </div>
      <p className="text-body-lg md:text-display-xs text-content-inverse-secondary">
        Check your connection and try again.
      </p>
    </div>
  );
};
