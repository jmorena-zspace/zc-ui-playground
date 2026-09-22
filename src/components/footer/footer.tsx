import { environment } from '@constants/environment';
import { mainContainer } from '@constants/theme';
import { useAppVersion } from '@hooks/app-version';
import clsx from 'clsx';
import { FC } from 'react';

const footerTextClass =
  'text-body-sm font-regular text-content-action-on-primary-default';

export const Footer: FC = () => {
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
                label="Terms of use"
              />
            </li>
            <li>
              <FooterLink
                href={environment.privacyPolicyUrl}
                label="Privacy policy"
              />
            </li>
            <li>
              <FooterLink
                href={environment.legalUrl}
                label="Legal"
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

  return (
    <a
      href={href}
      className="text-content-action-on-primary-default hover:underline"
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (opens in a new tab)`}
    >
      {label}
    </a>
  );
};
