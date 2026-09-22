import { Check } from 'lucide-react';
import { usePopoverContext } from '@components/ui/popover';
import clsx from 'clsx';
import { FC, useCallback } from 'react';
import { Language } from './language-switcher';

export type LanguageOptionProps = {
  language: Language;
  isCurrentLanguage?: boolean;
  isActive?: boolean;
  onLanguageChange?: (language: Language) => void;
};

export const LanguageOption: FC<LanguageOptionProps> = ({
  language,
  isCurrentLanguage = false,
  isActive = false,
  onLanguageChange,
}) => {
  const popover = usePopoverContext();

  const handleLanguageChange = useCallback(() => {
    if (!isCurrentLanguage) {
      onLanguageChange?.(language);
    }
    setTimeout(() => popover?.close(), 100);
  }, [isCurrentLanguage, language, onLanguageChange, popover]);

  return (
    <>
      <div
        data-nav-item
        role="option"
        aria-selected={isCurrentLanguage}
        className={clsx(
          'flex w-full cursor-pointer items-center justify-start gap-sm',
          'px-sm py-xs text-body-sm font-regular text-content-primary',
          'hover:bg-bg-surface-hover',
          'focus-visible:bg-bg-surface-hover focus-visible:outline-none'
        )}
        tabIndex={isActive ? 0 : -1}
        onClick={handleLanguageChange}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleLanguageChange();
          }
        }}
      >
        <div className="flex items-center gap-xs flex-1">
          <img
            src={language.flagIconUrl}
            width="20"
            height="20"
            alt={`${language.name} flag`}
          />
          <span
            className={clsx(
              'text-content-primary',
              isCurrentLanguage ? 'font-medium' : 'font-regular'
            )}
          >
            {language.name}
          </span>
        </div>
        {isCurrentLanguage && (
          <Check className="text-content-secondary"
            aria-hidden="true" />
        )}
      </div>
      {isCurrentLanguage && (
        <hr className="border-border-system-subtle" aria-hidden="true" />
      )}
    </>
  );
};
