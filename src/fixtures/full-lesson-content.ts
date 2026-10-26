import { andOrCircuits } from './content-items';
import lessonPlan from './lesson-content/and-or-circuits.lesson-plan.md?raw';
import worksheet from './lesson-content/and-or-circuits.worksheet.md?raw';

export type LessonStandard = {
  id: string;
  state: string;
  framework: string;
  code: string;
  description: string;
};

export type FullLessonContent = {
  lessonPlan: string;
  worksheet: string;
  standards: LessonStandard[];
};

const images = import.meta.glob('./lesson-content/*.svg', {
  eager: true,
  query: '?url',
  import: 'default',
}) as Record<string, string>;

/** Markdown references images by file name; this maps them to built URLs. */
export const resolveLessonImage = (src: string): string =>
  images[`./lesson-content/${src}`] ?? src;

const std = (
  state: string,
  framework: string,
  code: string,
  description: string
): LessonStandard => ({
  id: `${state}-${code}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
  state,
  framework,
  code,
  description,
});

// Sample data: the shape and wording are realistic, but this is not an
// authoritative crosswalk — don't read the codes as a real alignment.
const andOrCircuitsStandards: LessonStandard[] = [
  std('California', 'CA NGSS', 'HS-PS3-3', 'Design, build, and refine a device that works within given constraints to convert one form of energy into another.'),
  std('California', 'CA NGSS', 'HS-ETS1-2', 'Design a solution to a complex real-world problem by breaking it down into smaller, more manageable problems.'),
  std('Florida', 'NGSSS', 'SC.912.P.10.15', 'Investigate and explain the relationships among current, voltage, resistance, and power.'),
  std('Florida', 'NGSSS', 'SC.912.N.1.1', 'Define a problem and carry out scientific investigations, including making observations and recording data.'),
  std('Georgia', 'GSE', 'SPS10.c', 'Develop and use models to explain how electric current flows in series and parallel circuits.'),
  std('Georgia', 'GSE', 'SPS10.d', 'Plan and carry out an investigation of the relationship between voltage, current, and resistance.'),
  std('Illinois', 'IL-NGSS', 'HS-PS3-3', 'Design, build, and refine a device that works within given constraints to convert one form of energy into another.'),
  std('Illinois', 'IL-NGSS', 'HS-ETS1-1', 'Analyze a major global challenge to specify qualitative and quantitative criteria and constraints for solutions.'),
  std('Massachusetts', 'MA STE', 'HS-PS3-3', 'Design, build, and refine a device that works within given constraints to convert one form of energy into another.'),
  std('Massachusetts', 'MA STE', 'MS-PS2-3', 'Ask questions about data to determine the factors that affect the strength of electric and magnetic forces.'),
  std('New York', 'NYSSLS', 'MS-PS2-3', 'Ask questions about data to determine the factors that affect the strength of electric and magnetic forces.'),
  std('New York', 'NYSSLS', 'HS-PS3-3', 'Design, build, and refine a device that works within given constraints to convert one form of energy into another.'),
  std('North Carolina', 'NC Essential Standards', 'PSc.3.2', 'Explain how electric circuits transfer energy, including series and parallel arrangements.'),
  std('Ohio', 'Ohio Learning Standards', 'PS.EN.4', 'Describe how electrical energy flows through simple circuits and how switches control that flow.'),
  std('Texas', 'TEKS', 'P.5F', 'Investigate and describe the relationship between potential difference, current, and resistance in series and parallel circuits.'),
  std('Texas', 'TEKS', 'P.2A', 'Plan and implement investigations, including collecting and organizing qualitative and quantitative data.'),
  std('Virginia', 'SOL', 'PH.9a', 'Investigate and understand how series and parallel circuits behave, including the role of switches.'),
  std('Washington', 'WA NGSS', 'HS-PS3-3', 'Design, build, and refine a device that works within given constraints to convert one form of energy into another.'),
];

const content: Record<string, FullLessonContent> = {
  [andOrCircuits.id]: {
    lessonPlan,
    worksheet,
    standards: andOrCircuitsStandards,
  },
};

export const getFullLessonContent = (
  lessonId: string
): FullLessonContent | undefined => content[lessonId];
