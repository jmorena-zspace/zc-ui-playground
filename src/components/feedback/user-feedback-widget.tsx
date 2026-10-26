import { BaseButton } from '@components/buttons/base-button/base-button';
import { AnimatePresence, motion } from 'motion/react';
import { Check, MessageCircleHeart, X } from 'lucide-react';
import clsx from 'clsx';
import { FC, useEffect, useState } from 'react';
import { RATING_SCALE } from './rating-scale';

type Step = 'rating' | 'comment' | 'thanks';

// Tailwind's `ease-in-out`, reused here so motion's easing matches the CSS
// transitions elsewhere in this app rather than a spring's overshoot.
const EASE_IN_OUT = [0.4, 0, 0.2, 1] as const;

const STEP_TITLE: Record<Step, string> = {
  rating: 'How is your experience so far?',
  comment: 'Anything you’d like to add?',
  thanks: 'Thank you!',
};

export const UserFeedbackWidget: FC = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>('rating');
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (step !== 'thanks') return;
    const timeout = setTimeout(() => {
      setOpen(false);
      setTimeout(() => {
        setStep('rating');
        setRating(null);
        setComment('');
      }, 300);
    }, 2200);
    return () => clearTimeout(timeout);
  }, [step]);

  const close = () => setOpen(false);

  const selectRating = (value: number) => {
    setRating(value);
    setStep('comment');
  };

  const send = () => setStep('thanks');

  const selectedRating = RATING_SCALE.find((r) => r.value === rating);

  return (
    <div className="pointer-events-none fixed inset-0 z-10">
      <div className="pointer-events-auto absolute bottom-lg right-lg flex flex-col items-end gap-sm">
        <AnimatePresence>
          {open && (
            <motion.div
              role="dialog"
              aria-label="Feedback survey"
              layout
              initial={{ opacity: 0, scale: 0.3 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.3 }}
              transition={{ duration: 0.35, ease: EASE_IN_OUT }}
              style={{ transformOrigin: 'bottom right' }}
              className={clsx(
                'w-[320px] overflow-hidden rounded-lg border border-border-system-subtle bg-bg-surface-subtle p-lg shadow-lg'
              )}
            >
              <div className="mb-md flex items-start justify-between gap-sm">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.h2
                    key={step}
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -16 }}
                    transition={{ duration: 0.25, ease: EASE_IN_OUT }}
                    className="text-body-lg font-medium text-content-primary"
                  >
                    {STEP_TITLE[step]}
                  </motion.h2>
                </AnimatePresence>
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close feedback survey"
                  className="icon-btn icon-btn-on-surface -mr-xs -mt-xs shrink-0 text-content-secondary"
                >
                  {/* `layout="position"` on the ancestor dialog resizes itself
                      via a corrective scale transform — without their own
                      `layout`, icon glyphs get dragged along and smear
                      through that transform instead of just repositioning. */}
                  <motion.span layout="position" className="flex">
                    <X className="h-4 w-4" />
                  </motion.span>
                </button>
              </div>

              <AnimatePresence mode="popLayout" initial={false}>
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 48 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -48 }}
                  transition={{ duration: 0.3, ease: EASE_IN_OUT }}
                >
                  {step === 'rating' && (
                    <div className="flex items-center justify-between">
                      {RATING_SCALE.map(({ value, icon: Icon, label }) => (
                        <motion.button
                          key={value}
                          type="button"
                          onClick={() => selectRating(value)}
                          aria-label={label}
                          whileHover={{ scale: 1.25, y: -4 }}
                          whileTap={{ scale: 0.9 }}
                          transition={{
                            type: 'spring',
                            stiffness: 420,
                            damping: 15,
                          }}
                          className={clsx(
                            'flex h-11 w-11 items-center justify-center rounded-full text-content-tertiary',
                            'transition-colors hover:bg-bg-surface-hover hover:text-content-primary',
                            'cursor-pointer'
                          )}
                        >
                          <motion.span layout="position" className="flex">
                            <Icon className="h-6 w-6" />
                          </motion.span>
                        </motion.button>
                      ))}
                    </div>
                  )}

                  {step === 'comment' && (
                    <div className="flex flex-col gap-sm">
                      {selectedRating && (
                        <div className="flex items-center gap-xs text-content-tertiary">
                          <selectedRating.icon className="h-4 w-4" />
                          <span className="text-body-sm">
                            Thanks for rating us
                          </span>
                        </div>
                      )}
                      <textarea
                        autoFocus
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder="Tell us more... (optional)"
                        rows={3}
                        className={clsx(
                          'w-full resize-none rounded-sm border p-sm text-body-md',
                          'border-border-input-default bg-transparent text-content-primary',
                          'placeholder:text-content-tertiary outline-none transition-colors',
                          'focus:border-border-input-active'
                        )}
                      />
                      <div className="flex justify-end gap-xs">
                        <BaseButton color="secondary" size="sm" onClick={send}>
                          Skip
                        </BaseButton>
                        <BaseButton color="primary" size="sm" onClick={send}>
                          Send
                        </BaseButton>
                      </div>
                    </div>
                  )}

                  {step === 'thanks' && (
                    <div className="flex flex-col items-center gap-xs py-md text-center">
                      <motion.span
                        initial={{ scale: 0.4, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                          type: 'spring',
                          stiffness: 380,
                          damping: 18,
                          delay: 0.1,
                        }}
                        className="flex h-10 w-10 items-center justify-center rounded-full bg-bg-surface-status-positive-subtle text-content-status-positive"
                      >
                        <motion.span layout="position" className="flex">
                          <Check className="h-5 w-5" />
                        </motion.span>
                      </motion.span>
                      <p className="text-body-sm text-content-secondary">
                        Your feedback helps us improve.
                      </p>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          layout
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? 'Close feedback survey' : 'Give feedback'}
          transition={{ layout: { duration: 0.3, ease: EASE_IN_OUT } }}
          className={clsx(
            'flex h-12 items-center justify-center gap-xs rounded-full border border-border-system-subtle bg-bg-surface-strong',
            'text-content-primary shadow-lg transition-colors hover:bg-bg-surface-hover',
            'cursor-pointer',
            open ? 'w-12' : 'px-md'
          )}
        >
          <motion.span layout="position" className="flex shrink-0">
            <MessageCircleHeart className="h-5 w-5" />
          </motion.span>
          <AnimatePresence initial={false}>
            {!open && (
              <motion.span
                key="label"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2, ease: EASE_IN_OUT }}
                className="overflow-hidden whitespace-nowrap text-body-md font-medium"
              >
                Feedback
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>
    </div>
  );
};
