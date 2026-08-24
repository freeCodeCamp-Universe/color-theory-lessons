import type { LessonConfig } from '../../types/lesson.ts';
import { LESSON_TITLES } from '../lesson-titles.ts';

export const lesson5_6: LessonConfig = {
  id: 'u5-l6', unitId: 'unit-5',
  title: LESSON_TITLES['u5-l6'],
  interactionType: 'inclusive-review',
  reviewTags: ['workflow', 'inclusive-design', 'testing', 'user-research'],
  steps: [
    {
      text: 'CVD simulations approximate how an interface may appear under a specific type of CVD. They cannot represent differences between individuals, so use them to find design risks rather than predict any person\'s experience.',
    },
    {
      text: 'Use a repeatable review workflow. First, view the interface without a simulation and identify each element that uses color to carry meaning. Then check each CVD simulation, find elements that become ambiguous, add another visual cue, and check the simulations again.',
    },
    {
      text: 'Run inclusive checks before design decisions are fixed. In a design file, you can add a legend column or replace color-only dots with labeled badges before developers build those patterns throughout the interface.',
    },
    {
      text: 'User testing with people who have CVD can reveal whether participants understand the interface and complete its tasks. A simulation cannot reproduce their individual perceptions, strategies, or reactions.',
    },
    {
      text: 'Include accessible color checks throughout the design process. Check early, use simulations to find risks, and test with people who have CVD when possible. Repeat the checks when the design changes.',
    },
  ],
  challenge: {
      prompt: 'Work through the inclusive review checklist for the sample interface. Mark each item as Pass or Needs Work based on what you observe.',
      hints: [
        'Switch through the CVD simulation modes and compare each view with the original interface.',
        'Check whether labels, icons, patterns, or text communicate the information carried by each color.',
      ],
  },
  quizItems: [
    {
      id: 'q1',
      prompt: 'Does a CVD simulation show exactly how every person with that CVD type sees an interface?',
      choices: [
        {
          stableId: 'yes-simulation-shows-exactly-what-every-cvd-user-sees',
          label: 'Yes. It shows exactly what every person with CVD sees',
          isCorrect: false,
          explanation: 'A simulation applies a model to the interface. People with the same CVD type can still have different experiences.',
        },
        {
          stableId: 'no-it-is-a-useful-approximation-and-real-user-testing-still-adds',
          label: 'No. It is an approximation, and user testing can reveal individual experiences',
          isCorrect: true,
          explanation: 'Simulation can reveal design risks. User testing shows how individual participants interpret the interface and complete its tasks.',
        },
        {
          stableId: 'yes-all-protan-users-see-the-same-filtered-result',
          label: 'Yes. Everyone with a protan CVD type sees the same result',
          isCorrect: false,
          explanation: 'People within the same CVD category can perceive an interface differently. A single simulation cannot represent those differences.',
        },
        {
          stableId: 'no-simulation-is-inaccurate-and-should-not-be-used',
          label: 'No. CVD simulations are too inaccurate to be useful',
          isCorrect: false,
          explanation: 'A simulation can reveal places where reduced color distinctions may make an interface ambiguous.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'Why should inclusive color checks happen early in the design process?',
      choices: [
        {
          stableId: 'because-tools-only-work-on-early-stage-designs',
          label: 'Because tools only work on early-stage designs',
          isCorrect: false,
          explanation: 'Tools work at any stage. The reason to check early is about the cost of changes.',
        },
        {
          stableId: 'because-structural-fixes-are-much-harder-after-the-design-is-loc',
          label: 'Because changing the structure before implementation can avoid reworking built interface patterns',
          isCorrect: true,
          explanation: 'An early design change can replace color-only dots with labeled badges before developers reuse the status pattern throughout the interface.',
        },
        {
          stableId: 'because-accessibility-problems-disappear-later-in-the-process',
          label: 'Because accessibility problems disappear later in the process',
          isCorrect: false,
          explanation: 'A color-only status remains color-only until the design adds a label, icon, or another visual cue.',
        },
        {
          stableId: 'because-inclusive-design-only-applies-to-wireframes',
          label: 'Because inclusive design only applies to wireframes',
          isCorrect: false,
          explanation: 'Inclusive design applies throughout the entire design and development process.',
        },
      ],
    },
    {
      id: 'q3',
      prompt: 'What does user testing with CVD users add that simulation cannot?',
      choices: [
        {
          stableId: 'nothing-simulation-is-sufficient-for-all-accessibility-checking',
          label: 'Nothing. Simulation provides all the information needed for accessibility checks',
          isCorrect: false,
          explanation: 'A simulation applies a model. It cannot show how individual participants interpret the interface or complete its tasks.',
        },
        {
          stableId: 'real-task-completion-data-individual-nuance-and-practical-reacti',
          label: 'How individual participants interpret the design and complete its tasks',
          isCorrect: true,
          explanation: 'User testing provides observations of participants\' task results, strategies, and reactions. A simulation cannot provide those observations.',
        },
        {
          stableId: 'more-accurate-color-values-for-the-design-system',
          label: 'More accurate color values for the design system',
          isCorrect: false,
          explanation: 'Color measurement tools report color values. User testing shows how participants understand and use the interface.',
        },
        {
          stableId: 'faster-audit-turnaround',
          label: 'Faster audit turnaround',
          isCorrect: false,
          explanation: 'Applying a simulation filter is faster than recruiting participants and running a test. The test provides observations of how participants use the interface.',
        },
      ],
    },
  ],
  keyPoints: [
    'CVD simulation is a useful approximation — a valuable first-pass check — but not a perfect substitute for real user testing.',
    'A repeatable inclusive workflow: view normally → simulate each CVD type → identify ambiguous elements → add backup cues → re-check.',
    'Inclusive color checks should happen early: structural fixes are cheap in a design file and expensive in a shipped product.',
    'User testing with people who have CVD adds real-world validity that simulation alone cannot provide.',
    'Accessible color design is a quality lens applied throughout regular work, not a last-minute compliance step.',
  ],
};
