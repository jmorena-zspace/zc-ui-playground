import { ChevronDown } from 'lucide-react';
import { FC } from 'react';
import { BaseButton } from '../base-button/base-button';

type AppLauncherButtonProps = {
  iconUrl: string;
  name: string;
  launchCode: string;
};

export const AppLauncherButton: FC<AppLauncherButtonProps> = ({
  iconUrl,
  name,
  launchCode,
}) => {

  return (
    <BaseButton
      color="secondary"
      size="xs"
      className="rounded-full gap-xxs py-xxs"
    >
      <img
        src={iconUrl}
        alt={`${name} icon`}
        className="w-[18px] h-[18px] shrink-0 object-contain"
      />
      <span className="text-body-md font-medium text-text-default-secondary">
        {launchCode}
      </span>
      <ChevronDown className="h-3 w-3 text-icon-brand-default" />
    </BaseButton>
  );
};
