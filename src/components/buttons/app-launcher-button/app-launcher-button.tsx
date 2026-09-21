import { faChevronDown } from '@awesome.me/kit-935ddc1468/icons/classic/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ARIA_LABELS, useTranslation } from '@zcentral-v2/i18n';
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
  const { t } = useTranslation();

  return (
    <BaseButton
      color="secondary"
      size="xs"
      className="rounded-full gap-xxs py-xxs"
    >
      <img
        src={iconUrl}
        alt={t(ARIA_LABELS.UI.APPLICATION_ICON_ALT, { name })}
        className="w-[18px] h-[18px] shrink-0 object-contain"
      />
      <span className="text-body-md font-medium text-text-default-secondary">
        {launchCode}
      </span>
      <FontAwesomeIcon
        icon={faChevronDown}
        className="text-body-sm text-icon-brand-default"
      />
    </BaseButton>
  );
};
