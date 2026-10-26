import { Angry, Frown, Laugh, Meh, Smile, type LucideIcon } from 'lucide-react';

export type RatingLevel = {
  value: 1 | 2 | 3 | 4 | 5;
  icon: LucideIcon;
  label: string;
};

/** Shared with the feedback survey widget, so a rating means the same icon everywhere. */
export const RATING_SCALE: RatingLevel[] = [
  { value: 1, icon: Angry, label: 'Very unhappy' },
  { value: 2, icon: Frown, label: 'Unhappy' },
  { value: 3, icon: Meh, label: 'Neutral' },
  { value: 4, icon: Smile, label: 'Happy' },
  { value: 5, icon: Laugh, label: 'Very happy' },
];

export const ratingIcon = (value: number): LucideIcon =>
  RATING_SCALE.find((r) => r.value === value)?.icon ?? Meh;
