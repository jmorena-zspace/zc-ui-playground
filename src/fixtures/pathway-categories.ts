import type { CollectionFolderIcon } from '@components/cards/collection-folder-card/collection-folder-card';
import {
  Building2,
  Car,
  Cog,
  GraduationCap,
  HeartPulse,
  Ruler,
  Server,
  Sprout,
  Wrench,
  Zap,
} from 'lucide-react';

export type PathwayCategory = {
  id: string;
  name: string;
  count: number;
  icons: CollectionFolderIcon[];
};

/** Stand-in for the "By career pathway" collections grid. */
export const pathwayCategories: PathwayCategory[] = [
  {
    id: 'advanced-manufacturing',
    name: 'Advanced Manufacturing',
    count: 22,
    icons: [
      { icon: Cog, from: 'var(--color-blue-500)', to: 'var(--color-blue-800)' },
      { icon: Wrench, from: 'var(--color-blue-400)', to: 'var(--color-blue-700)' },
      { icon: Ruler, from: 'var(--color-blue-600)', to: 'var(--color-blue-900)' },
    ],
  },
  {
    id: 'automotive-technology',
    name: 'Automotive Technology',
    count: 14,
    icons: [
      { icon: Car, from: 'var(--color-red-400)', to: 'var(--color-red-800)' },
      { icon: Cog, from: 'var(--color-red-500)', to: 'var(--color-red-900)' },
      { icon: Wrench, from: 'var(--color-red-300)', to: 'var(--color-red-700)' },
    ],
  },
  {
    id: 'skilled-trades',
    name: 'Skilled Trades',
    count: 18,
    icons: [
      { icon: Wrench, from: 'var(--color-orange-400)', to: 'var(--color-orange-800)' },
      { icon: Zap, from: 'var(--color-orange-500)', to: 'var(--color-orange-900)' },
      { icon: Cog, from: 'var(--color-orange-300)', to: 'var(--color-orange-700)' },
    ],
  },
  {
    id: 'energy-process-technology',
    name: 'Energy & Process Technology',
    count: 11,
    icons: [
      { icon: Zap, from: 'var(--color-teal-500)', to: 'var(--color-teal-900)' },
      { icon: Cog, from: 'var(--color-teal-400)', to: 'var(--color-teal-800)' },
      { icon: Ruler, from: 'var(--color-teal-600)', to: 'var(--color-teal-950)' },
    ],
  },
  {
    id: 'health-sciences',
    name: 'Health Sciences',
    count: 27,
    icons: [
      { icon: HeartPulse, from: 'var(--color-pink-400)', to: 'var(--color-pink-800)' },
      { icon: HeartPulse, from: 'var(--color-pink-500)', to: 'var(--color-pink-900)' },
      { icon: HeartPulse, from: 'var(--color-pink-300)', to: 'var(--color-pink-700)' },
    ],
  },
  {
    id: 'agriculture-natural-resources',
    name: 'Agriculture & Natural Resources',
    count: 9,
    icons: [
      { icon: Sprout, from: 'var(--color-green-400)', to: 'var(--color-green-800)' },
      { icon: Sprout, from: 'var(--color-green-500)', to: 'var(--color-green-900)' },
      { icon: Sprout, from: 'var(--color-green-300)', to: 'var(--color-green-700)' },
    ],
  },
  {
    id: 'information-technology',
    name: 'Information Technology',
    count: 16,
    icons: [
      { icon: Server, from: 'var(--color-z-blue-400)', to: 'var(--color-z-blue-800)' },
      { icon: Server, from: 'var(--color-z-blue-500)', to: 'var(--color-z-blue-900)' },
      { icon: Server, from: 'var(--color-z-blue-300)', to: 'var(--color-z-blue-700)' },
    ],
  },
  {
    id: 'construction-design',
    name: 'Construction & Design',
    count: 12,
    icons: [
      { icon: Building2, from: 'var(--color-purple-400)', to: 'var(--color-purple-800)' },
      { icon: Ruler, from: 'var(--color-purple-500)', to: 'var(--color-purple-900)' },
      { icon: Building2, from: 'var(--color-purple-300)', to: 'var(--color-purple-700)' },
    ],
  },
  {
    id: 'career-readiness',
    name: 'Career Readiness',
    count: 7,
    icons: [
      { icon: GraduationCap, from: 'var(--color-yellow-500)', to: 'var(--color-yellow-800)' },
      { icon: GraduationCap, from: 'var(--color-yellow-400)', to: 'var(--color-yellow-700)' },
      { icon: GraduationCap, from: 'var(--color-yellow-600)', to: 'var(--color-yellow-900)' },
    ],
  },
];
