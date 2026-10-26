export type FeedbackEntry = {
  id: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  appVersion: string;
  submittedAt: string;
  page: string;
  location: string;
};

const PAGES = [
  'Home',
  'Card playground',
  'Theme lab',
  'Faceted filters',
  'Lesson side panel',
  'Collection folders',
  'User feedback',
];

const VERSIONS = ['4.1.0', '4.2.0', '4.2.1', '4.3.0-beta'];

const LOCATIONS = [
  'Austin, TX',
  'San Jose, CA',
  'Chicago, IL',
  'Denver, CO',
  'Toronto, ON',
  'London, UK',
  'Berlin, DE',
  'Sydney, AU',
  'Seattle, WA',
  'Raleigh, NC',
];

const POSITIVE_COMMENTS = [
  "The new collection folders are a delight to click through.",
  'Loading feels noticeably faster since the last update.',
  'Really like the tooltip on disabled launch buttons — clears up a lot of confusion.',
  'Clean layout, easy to find what I need.',
  '',
  '',
];

const NEUTRAL_COMMENTS = [
  'Works fine, nothing stands out either way.',
  'Would like more filter options on the collections page.',
  '',
  '',
];

const NEGATIVE_COMMENTS = [
  'The side panel took a while to load on my connection.',
  "Launch button was disabled and I couldn't tell why at first.",
  'Ran into a blank screen after switching pages quickly.',
  '',
];

/** Deterministic pseudo-random so the fixture is stable across reloads. */
function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260928);
const pick = <T,>(list: T[]) => list[Math.floor(rand() * list.length)];

function weightedRating(): FeedbackEntry['rating'] {
  // Skews positive, like most in-app feedback surveys.
  const r = rand();
  if (r < 0.32) return 5;
  if (r < 0.58) return 4;
  if (r < 0.76) return 3;
  if (r < 0.9) return 2;
  return 1;
}

function commentFor(rating: FeedbackEntry['rating']): string {
  if (rating >= 4) return pick(POSITIVE_COMMENTS);
  if (rating === 3) return pick(NEUTRAL_COMMENTS);
  return pick(NEGATIVE_COMMENTS);
}

const NOW = new Date('2026-09-28T12:00:00Z').getTime();
const DAY_MS = 24 * 60 * 60 * 1000;

export const feedbackEntries: FeedbackEntry[] = Array.from(
  { length: 64 },
  (_, i) => {
    const rating = weightedRating();
    const daysAgo = Math.floor(rand() * 30);
    const submittedAt = new Date(
      NOW - daysAgo * DAY_MS - Math.floor(rand() * DAY_MS)
    ).toISOString();
    return {
      id: `fb-${i + 1}`,
      rating,
      comment: commentFor(rating),
      appVersion: pick(VERSIONS),
      submittedAt,
      page: pick(PAGES),
      location: pick(LOCATIONS),
    };
  }
).sort((a, b) => b.submittedAt.localeCompare(a.submittedAt));
