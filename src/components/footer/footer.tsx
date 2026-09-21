import { environment } from '@constants/environment';
import { mainContainer } from '@constants/theme';
import { useAppVersion } from '@hooks/app-version';
import { ARIA_LABELS, PAGE_TEXTS, useTranslation } from '@zcentral-v2/i18n';
import clsx from 'clsx';
import { FC } from 'react';

const footerTextClass =
  'text-body-sm font-regular text-content-action-on-primary-default';

export const Footer: FC = () => {
  const { t } = useTranslation();
  const displayVersion = useAppVersion();
  return (
    <footer className="bg-bg-surface-inverse-default">
      <div
        className={clsx(
          mainContainer,
          'flex flex-col px-lg py-md md:px-xl gap-lg items-center md:flex-row md:justify-start'
        )}
      >
        <span className={footerTextClass}>
          &copy; {new Date().getFullYear()}{' '}
          <span className="ml-1">zSpace, Inc.</span>
        </span>

        <nav>
          <ul
            className={clsx(
              footerTextClass,
              'flex flex-col justify-center items-center gap-lg md:flex-row md:justify-start'
            )}
          >
            <li>
              <FooterLink
                href={environment.termsOfUseUrl}
                label={t(PAGE_TEXTS.UI.TERMS_OF_USE)}
              />
            </li>
            <li>
              <FooterLink
                href={environment.privacyPolicyUrl}
                label={t(PAGE_TEXTS.UI.PRIVACY_POLICY)}
              />
            </li>
            <li>
              <FooterLink
                href={environment.legalUrl}
                label={t(PAGE_TEXTS.UI.LEGAL)}
              />
            </li>
          </ul>
        </nav>

        <span
          aria-label="App version"
          data-clarity-unmask="true"
          className={clsx(footerTextClass, 'md:ml-auto')}
        >
          {displayVersion && `v${displayVersion}`}
        </span>
      </div>
    </footer>
  );
};

export default Footer;

type FooterLinkProps = {
  href: string;
  label: string;
};

const FooterLink: FC<FooterLinkProps> = ({ href, label }) => {
  const { t } = useTranslation();

  return (
    <a
      href={href}
      className="text-content-action-on-primary-default hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t(ARIA_LABELS.UI.EXTERNAL_LINK, { label })}
    >
      {label}
    </a>
  );
};
