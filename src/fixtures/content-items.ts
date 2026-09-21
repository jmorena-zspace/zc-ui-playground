/**
 * Stand-in for `@fixtures/content-items` — the sample content the source
 * project's stories import.
 *
 * Images are inline SVG data URIs rather than remote URLs: the stories in
 * the source project pointed at via.placeholder.com, which no longer
 * resolves, and local data URIs keep the playground working offline.
 */
import {
  ContentPlatform,
  ContentType,
  type ContentItem,
  type Lesson,
  type LessonApplication,
  type Subject,
} from '@zcentral-v2/types';

function svgDataUri(svg: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg.trim())}`;
}

/** Square app icon: initials on a solid tile. */
function appIcon(initials: string, color: string): string {
  return svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
      <rect width="32" height="32" rx="7" fill="${color}"/>
      <text x="16" y="21" text-anchor="middle" font-family="Inter, sans-serif"
            font-size="13" font-weight="600" fill="#ffffff">${initials}</text>
    </svg>`);
}

/**
 * Circular subject icon: an initial on a tinted disc. Letters rather than
 * emoji, which render inconsistently across platforms inside an SVG data URI.
 */
function subjectIcon(glyph: string, color: string): string {
  return svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="12" fill="${color}"/>
      <text x="12" y="16.5" text-anchor="middle" font-family="Inter, sans-serif"
            font-size="12" font-weight="600" fill="#ffffff">${glyph}</text>
    </svg>`);
}

/** Lesson cover: a two-stop gradient, cropped by the card at 96x96. */
function coverImage(from: string, to: string): string {
  return svgDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stop-color="${from}"/>
          <stop offset="1" stop-color="${to}"/>
        </linearGradient>
      </defs>
      <rect width="160" height="160" fill="url(#g)"/>
      <circle cx="118" cy="44" r="30" fill="#ffffff" opacity="0.16"/>
      <circle cx="48" cy="118" r="46" fill="#000000" opacity="0.12"/>
    </svg>`);
}

// -------------
// Subjects
// -------------

export const physics: Subject = {
  id: 'subj-physics',
  name: 'Physics',
  iconUrl: subjectIcon('P', '#0058d6'),
};

export const biology: Subject = {
  id: 'subj-biology',
  name: 'Biology',
  iconUrl: subjectIcon('B', '#1ebda0'),
};

export const chemistry: Subject = {
  id: 'subj-chemistry',
  name: 'Chemistry',
  iconUrl: subjectIcon('C', '#dc6418'),
};

export const engineering: Subject = {
  id: 'subj-engineering',
  name: 'Engineering & Technology',
  iconUrl: subjectIcon('E', '#6335c0'),
};

export const mathematics: Subject = {
  id: 'subj-math',
  name: 'Mathematics',
  iconUrl: subjectIcon('M', '#d02597'),
};

// -------------
// Applications
// -------------

/** Desktop app — not launchable unless the native shell is simulated. */
export const franklinsLabApp: LessonApplication = {
  id: 'app-franklins-lab',
  name: "Franklin's Lab",
  iconUrl: appIcon('FL', '#0072ce'),
  appLaunchCode: 'FL',
  deepLinkingLaunchCode: 'FL-2481',
  platform: ContentPlatform.DESKTOP,
};

/** Web app — always launchable. */
export const bioDigitalHumanApp: LessonApplication = {
  id: 'app-biodigital-human',
  name: 'BioDigital Human',
  iconUrl: appIcon('BD', '#1ebda0'),
  appLaunchCode: 'BD',
  deepLinkingLaunchCode: null,
  platform: ContentPlatform.WEB,
};

export const studioApp: LessonApplication = {
  id: 'app-studio',
  name: 'zSpace Studio',
  iconUrl: appIcon('ZS', '#6335c0'),
  appLaunchCode: 'ZS',
  deepLinkingLaunchCode: 'ZS-0097',
  platform: ContentPlatform.DESKTOP,
};

/** Exercises the icon fallback in Icon / ImagePlaceholder. */
export const applicationNoIcon: ContentItem = {
  id: 'app-no-icon',
  name: 'Unbranded Viewer',
  imageUrl: null,
  subjects: [engineering],
  type: ContentType.APPLICATION,
  apps: [],
};

// -------------
// Lessons
// -------------

/** Long name, three subjects (so the "+1" overflow chip shows), two apps. */
export const andOrCircuits: Lesson = {
  id: 'lesson-and-or-circuits',
  name: 'AND & OR Circuits: Building Logic Gates from Switches',
  imageUrl: coverImage('#0058d6', '#22d3b2'),
  type: ContentType.LESSON,
  subjects: [physics, engineering, mathematics],
  apps: [franklinsLabApp, bioDigitalHumanApp],
  summary:
    'Students wire series and parallel switch circuits, then generalize the behavior into AND and OR truth tables.',
  lessonPlans: [
    {
      id: 'plan-1',
      name: 'AND & OR Circuits — Lesson Plan.pdf',
      fileUrl: 'https://example.com/and-or-circuits-lesson-plan.pdf',
    },
  ],
  supportingFiles: [
    {
      id: 'file-1',
      name: 'Truth Table Worksheet.docx',
      fileUrl: 'https://example.com/truth-table-worksheet.docx',
    },
  ],
};

/** Single app, single subject — the quiet baseline. */
export const lessonSingleApp: Lesson = {
  id: 'lesson-single-app',
  name: 'Dissecting the Frog Heart',
  imageUrl: coverImage('#1ebda0', '#0058d6'),
  type: ContentType.LESSON,
  subjects: [biology],
  apps: [bioDigitalHumanApp],
  summary:
    'A guided dissection of the amphibian heart, comparing its three chambers to the mammalian four.',
};

/** No image — falls back to ImagePlaceholder on the desktop layout. */
export const franklinsLab: Lesson = {
  id: 'lesson-franklins-lab',
  name: 'Static Electricity and the Leyden Jar',
  imageUrl: null,
  type: ContentType.LESSON,
  subjects: [physics, chemistry],
  apps: [franklinsLabApp, studioApp],
  summary:
    'Charge a Leyden jar, then measure how stored charge changes with plate area.',
};

/** No apps at all — the launch column collapses entirely. */
export const bioDigitalHuman: Lesson = {
  id: 'lesson-biodigital-human',
  name: 'The Cardiovascular System',
  imageUrl: coverImage('#d02597', '#6335c0'),
  type: ContentType.LESSON,
  subjects: [biology],
  apps: [],
  summary:
    'Trace a red blood cell from the right atrium to the capillary beds and back.',
};

export const contentItems: ContentItem[] = [
  andOrCircuits,
  lessonSingleApp,
  franklinsLab,
  bioDigitalHuman,
];
