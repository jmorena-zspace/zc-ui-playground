import { Keyboard, TriangleAlert, X } from 'lucide-react';
import { KeyboardShortcut } from '@components/ui/keyboard-shortcut';
import { usePressedKeys } from '@hooks/pressed-keys';
import type { SpotlightShortcutSetResult } from '@zcentral-v2/types';
import {
  acceleratorPartsFromEvent,
  canonicalize,
  serializeAccelerator,
  validateShortcut,
  type ShortcutValidationCode,
} from '@zcentral-v2/utils';
import clsx from 'clsx';
import type { KeyboardEvent as ReactKeyboardEvent } from 'react';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BlurredModal } from './blurred-modal';

type ExternalCode = ShortcutValidationCode | 'register-failed';

type Tone = 'neutral' | 'warning' | 'error';

const TONE_BY_CODE: Record<ExternalCode | 'ok', Tone> = {
  ok: 'neutral',
  empty: 'warning',
  'missing-modifier': 'warning',
  'missing-key': 'warning',
  reserved: 'error',
  'register-failed': 'error',
};

const TONE_CONTAINER: Record<Tone, string> = {
  neutral: 'border-border-system-subtle bg-bg-surface-subtle',
  warning:
    'border-border-action-tertiary-hover bg-bg-surface-status-warning-subtle',
  error:
    'border-border-action-tertiary-pressed bg-bg-surface-status-negative-subtle',
};

const TONE_TEXT: Record<Tone, string> = {
  neutral: 'text-content-tertiary',
  warning: 'text-content-status-warning',
  error: 'text-content-status-negative',
};

const TONE_FOCUS_RING: Record<Tone, string> = {
  neutral: 'focus:ring-border-action-primary-focused',
  warning: 'focus:ring-border-input-status-warning-strong',
  error: 'focus:ring-border-input-status-negative-strong',
};

export type SpotlightShortcutModalProps = {
  show: boolean;
  onClose: () => void;
  currentAccelerator: string;
  onSave: (accelerator: string) => Promise<SpotlightShortcutSetResult>;
};

export const SpotlightShortcutModal: FC<SpotlightShortcutModalProps> = ({
  show,
  onClose,
  currentAccelerator,
  onSave,
}) => {

  const [modifiers, setModifiers] = useState<string[]>([]);
  const [capturedKey, setCapturedKey] = useState<string | null>(null);
  const [externalError, setExternalError] = useState<ExternalCode | null>(null);
  const [isShaking, setIsShaking] = useState(false);
  const [saving, setSaving] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const captureRef = useRef<HTMLDivElement>(null);
  const pressedTokens = usePressedKeys(show);

  useEffect(() => {
    if (!show) return;
    setModifiers([]);
    setCapturedKey(null);
    setExternalError(null);
    setSaving(false);
    setIsShaking(false);
  }, [show]);

  // Toggle the animation via state (not `key` remount) so focus stays on
  // the capture area after a failed save. Two rAFs ensure the class has
  // been committed as removed before re-adding, so repeated Enter presses
  // retrigger the keyframe every time.
  const triggerShake = useCallback(() => {
    setIsShaking(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsShaking(true));
    });
  }, []);

  const candidate = useMemo(
    () => serializeAccelerator(modifiers, capturedKey),
    [modifiers, capturedKey]
  );

  const localValidation = useMemo(
    () => (capturedKey ? validateShortcut(candidate) : null),
    [candidate, capturedKey]
  );

  const validationCode: ExternalCode | null =
    externalError ?? (localValidation ? localValidation.code : null);
  const tone: Tone = validationCode ? TONE_BY_CODE[validationCode] : 'neutral';

  const handleSave = useCallback(async () => {
    if (saving) return;
    if (!localValidation || localValidation.code !== 'ok') {
      triggerShake();
      return;
    }
    setSaving(true);
    const saveResult = await onSave(localValidation.accelerator);
    setSaving(false);
    if (saveResult.ok) {
      onClose();
      return;
    }
    setExternalError(saveResult.code);
    triggerShake();
  }, [localValidation, onClose, onSave, saving, triggerShake]);

  const handleCaptureKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') return;

      const hasModifier =
        event.ctrlKey || event.metaKey || event.altKey || event.shiftKey;
      if (event.key === 'Enter' && !event.repeat && !hasModifier) {
        event.preventDefault();
        void handleSave();
        return;
      }

      if (event.repeat) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }

      // Swallow Tab — forwarding would move focus to the close button
      // and the next keystroke would bypass the capture area.
      if (event.key === 'Tab') {
        event.preventDefault();
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const parts = acceleratorPartsFromEvent(event.nativeEvent);
      setModifiers(parts.modifiers);
      setExternalError(null);
      // Always assign — modifier-only presses set this to null so an old
      // key can't be glued to new modifiers (e.g. Ctrl+P then Shift alone).
      setCapturedKey(parts.key);
    },
    [handleSave]
  );

  // Any captured modifier or key means the user has started a new combo;
  // until then, the modal previews the saved one.
  const isRecording = modifiers.length > 0 || capturedKey !== null;
  const displayAccelerator = isRecording
    ? candidate
    : canonicalize(currentAccelerator);

  const useFocusedNeutral = tone === 'neutral' && isFocused;
  const containerClass = clsx(
    'flex items-center justify-center min-h-16 w-full px-lg py-md rounded border-2 transition-colors cursor-pointer focus:outline-none focus:ring-2',
    TONE_FOCUS_RING[tone],
    {
      'border-border-action-primary-default bg-bg-surface-default':
        useFocusedNeutral,
      [TONE_CONTAINER[tone]]: !useFocusedNeutral,
      'animate-shortcut-invalid-pulse': isShaking,
    }
  );

  return (
    <BlurredModal
      show={show}
      onClose={onClose}
      centered
      size="xl"
      dismissible={!saving}
      initialFocus={captureRef}
      ariaLabel="Set the spotlight shortcut"
    >
      <div className="flex flex-col gap-lg bg-bg-surface-default border border-border-system-subtle rounded-sm p-md shadow-lg outline-none">
        <div className="flex items-center justify-between border-b border-border-system-subtle pb-md">
          <div className="flex items-center gap-sm">
            <Keyboard className="text-content-primary text-[24px]" />
            <h2 className="text-body-lg font-bold text-content-primary">
              Set the spotlight shortcut
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="icon-btn icon-btn-on-surface text-content-secondary"
            aria-label="Close"
          >
            <X className="w-3 h-3" />
          </button>
        </div>

        <p className="text-body-md font-regular text-content-secondary">
          Press the combination you want to use.
        </p>

        <div className="flex flex-col gap-xs">
          <div
            ref={captureRef}
            role="textbox"
            tabIndex={0}
            aria-live="polite"
            aria-label="Shortcuts spotlight"
            onKeyDown={handleCaptureKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className={containerClass}
          >
            {displayAccelerator ? (
              <KeyboardShortcut
                accelerator={displayAccelerator}
                size="lg"
                pressedTokens={pressedTokens}
              />
            ) : (
              <span className="text-body-md font-regular text-content-tertiary">
                Press a shortcut
              </span>
            )}
          </div>

          {/* Fixed-height slot prevents reflow as the validation tone changes. */}
          <div className="flex items-center h-5 gap-xxs">
            <TriangleAlert className={clsx('h-3 w-3 shrink-0', TONE_TEXT[tone], {
                invisible: tone === 'neutral',
              })} />
            <p
              className={clsx(
                'text-body-sm font-regular leading-body-sm',
                TONE_TEXT[tone]
              )}
            >
              {tone !== 'neutral' && validationCode
                ? messageForCode(validationCode)
                : 'Include at least one modifier key, such as Ctrl or Cmd.'}
            </p>
          </div>
        </div>
      </div>
    </BlurredModal>
  );
};

function messageForCode(code: ExternalCode): string {
  switch (code) {
    case 'missing-modifier':
      return 'Add a modifier key, such as Ctrl or Cmd.';
    case 'missing-key':
      return 'Add a key to go with the modifier.';
    case 'reserved':
      return 'That shortcut is reserved by the system.';
    case 'register-failed':
      return 'That shortcut could not be registered.';
    default:
      return '';
  }
}
