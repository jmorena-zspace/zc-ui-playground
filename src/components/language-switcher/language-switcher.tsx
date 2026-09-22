import { Globe } from 'lucide-react';
import bgBGFlag from '@assets/flags/bg-BG.svg';
import enUSFlag from '@assets/flags/en-US.svg';
import esARFlag from '@assets/flags/es-AR.svg';
import esCLFlag from '@assets/flags/es-CL.svg';
import esUSFlag from '@assets/flags/es-US.svg';
import frCAFlag from '@assets/flags/fr-CA.svg';
import frFRFlag from '@assets/flags/fr-FR.svg';
import huHUFlag from '@assets/flags/hu-HU.svg';
import itITFlag from '@assets/flags/it-IT.svg';
import kkKZFlag from '@assets/flags/kk-KZ.svg';
import koKRFlag from '@assets/flags/ko-KR.svg';
import plPLFlag from '@assets/flags/pl-PL.svg';
import roROFlag from '@assets/flags/ro-RO.svg';
import zhCNFlag from '@assets/flags/zh-CN.svg';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
  usePopoverContext,
} from '@components/ui/popover';
import { FC, KeyboardEvent, useCallback, useMemo } from 'react';
import { LanguageOption } from './language-option';

const FLAG_ICONS: Record<SupportedLanguage, string> = {
  'bg-BG': bgBGFlag,
  'en-US': enUSFlag,
  'es-AR': esARFlag,
  'es-CL': esCLFlag,
  'es-US': esUSFlag,
  'fr-CA': frCAFlag,
  'fr-FR': frFRFlag,
  'hu-HU': huHUFlag,
  'it-IT': itITFlag,
  'kk-KZ': kkKZFlag,
  'ko-KR': koKRFlag,
  'pl-PL': plPLFlag,
  'ro-RO': roROFlag,
  'zh-CN': zhCNFlag,
};

export interface Language {
  code: SupportedLanguage;
  name: string;
  flagIconUrl: string;
}

export interface LanguageSwitcherProps {
  /** Override the default language change handler (which resets router & query cache). */
  onChangeLanguage?: (code: SupportedLanguage) => void;
  /** Visual variant. 'dark' (default) for dark backgrounds, 'light' for light backgrounds. */
  variant?: 'dark' | 'light';
}

const VARIANT_CLASSES: Record<
  NonNullable<LanguageSwitcherProps['variant']>,
  string
> = {
  dark: 'icon-btn icon-btn-on-dark text-content-action-on-primary-default',
  light: 'icon-btn icon-btn-on-light text-content-primary',
};

export const LanguageSwitcher: FC<LanguageSwitcherProps> = ({
  onChangeLanguage,
  variant = 'dark',
}) => {
  const language = 'en-US';
  const currentLanguageCode = language as SupportedLanguage;

  // Recalculated when current language changes to update names
  const availableLanguages: Language[] = useMemo(
    () =>
      supportedLanguages.map((code) => ({
        code,
        name: getLanguageName(code),
        flagIconUrl: FLAG_ICONS[code],
      })),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentLanguageCode]
  );

  const currentLanguage = useMemo(
    () =>
      availableLanguages.find((lang) => lang.code === currentLanguageCode) ||
      availableLanguages[0],
    [availableLanguages, currentLanguageCode]
  );

  const handleLanguageChange = useCallback(
    (language: Language) => {
      if (language.code !== currentLanguageCode) {
        if (onChangeLanguage) {
          onChangeLanguage(language.code);
        } else {
          changeLanguage(language.code);
        }
      }
    },
    [currentLanguageCode, onChangeLanguage]
  );

  // Sort languages with current language first
  const languages = useMemo(() => {
    const filteredLanguages = availableLanguages.filter(
      (lang) => lang.code !== currentLanguage?.code
    );

    return currentLanguage
      ? [currentLanguage, ...filteredLanguages]
      : filteredLanguages;
  }, [availableLanguages, currentLanguage]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          className={VARIANT_CLASSES[variant]}
          aria-label="Language switcher button"
        >
          <Globe className="h-4 w-4" />
        </button>
      </PopoverTrigger>
      <LanguageListbox
        languages={languages}
        currentLanguage={currentLanguage}
        onLanguageChange={handleLanguageChange}
      />
    </Popover>
  );
};

function LanguageListbox({
  languages,
  currentLanguage,
  onLanguageChange,
}: {
  languages: Language[];
  currentLanguage: Language | undefined;
  onLanguageChange: (language: Language) => void;
}) {
  const popover = usePopoverContext();

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      if (e.key === 'Tab') {
        e.preventDefault();
        popover?.close();
        return;
      }

      if (e.key !== 'ArrowDown' && e.key !== 'ArrowUp') return;
      e.preventDefault();
      e.stopPropagation();

      const options =
        e.currentTarget.querySelectorAll<HTMLElement>('[role="option"]');
      if (!options.length) return;

      const active = document.activeElement as HTMLElement;
      const idx = Array.from(options).indexOf(active);
      const next =
        e.key === 'ArrowDown'
          ? Math.min(idx < 0 ? 0 : idx + 1, options.length - 1)
          : Math.max(idx < 0 ? 0 : idx - 1, 0);

      options.forEach((opt) => opt.setAttribute('tabindex', '-1'));
      options[next].setAttribute('tabindex', '0');
      options[next].focus();
    },
    [popover]
  );

  return (
    <PopoverContent align="end" className="max-h-[250px] overflow-y-auto">
      <div
        role="listbox"
        aria-label="Language switcher content"
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        {languages.map((lang, index) => (
          <LanguageOption
            key={lang.code}
            language={lang}
            isCurrentLanguage={lang.code === currentLanguage?.code}
            isActive={index === 0}
            onLanguageChange={onLanguageChange}
          />
        ))}
      </div>
    </PopoverContent>
  );
}
