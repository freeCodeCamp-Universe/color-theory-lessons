import type { LessonConfig } from '../../types/lesson.ts';

export const lesson5_6: LessonConfig = {
  id: 'u5-l6', unitId: 'unit-5',
  title: 'Inclusive Testing and Review',
  interactionType: 'inclusive-review',
  glossaryTerms: [
    'approximation',
    'inclusive design',
    'robustness',
    'user test',
    'workflow',
  ],
  reviewTags: ['workflow', 'inclusive-design', 'testing', 'user-research'],
  steps: [
    {
      id: 's1',
      text: 'CVD simulation is a useful approximation, but it is not a perfect substitute for user research. Different people with the same CVD type can have different experiences. Simulation gives you a fast first pass — it does not give you a complete picture.',
      highlights: ['approximation'],
    },
    {
      id: 's2',
      text: 'A repeatable inclusive workflow: (1) View in normal mode and identify all elements that use color to carry meaning. (2) Switch to each simulation mode. (3) Identify which elements become ambiguous. (4) Add backup cues. (5) Re-check in simulation mode.',
      highlights: ['workflow', 'inclusive design'],
    },
    {
      id: 's3',
      text: 'Inclusive checks should happen early in the design process, not only as a final compliance step. Structural changes — like adding a second column to a legend or switching from color-only dots to labeled badges — are much cheaper to make before designs are locked.',
      highlights: ['robustness'],
    },
    {
      id: 's4',
      text: 'User testing with people who have CVD adds value that simulation cannot provide: real reactions, task completion rates, and the nuances of individual experience. Even occasional user testing significantly improves your understanding beyond what any filter can show.',
      highlights: ['user test'],
    },
    {
      id: 's5',
      text: 'Accessible color design is not a separate phase — it is a quality lens applied throughout regular design work. Check early, simulate often, and validate with real users when possible. The goal is to make accessibility a habit, not a last-minute task.',
    },
  ],
  challenges: [
    {
      id: 'c1',
      prompt: 'Work through the inclusive review checklist for the sample interface. Mark each item as Pass or Needs Work based on what you observe.',
      type: 'explore-all',
      hints: [
        'Read each checklist item carefully. The sample interface has real problems — look for them.',
        'For each item, ask: can a user complete the task without relying on hue alone?',
      ],
    },
  ],
  quizItems: [
    {
      id: 'q1',
      prompt: "Is simulation a perfect representation of a CVD user's experience?",
      choices: [
        {
          id: 'a',
          label: 'Yes — simulation shows exactly what every CVD user sees',
          isCorrect: false,
          explanation: 'Simulation is a mathematical approximation. Real users with the same CVD type can still vary.',
        },
        {
          id: 'b',
          label: 'No — it is a useful approximation, and real user testing still adds value',
          isCorrect: true,
          explanation: 'Simulation gives a fast first-pass check. User testing provides real task completion data and individual nuance.',
        },
        {
          id: 'c',
          label: 'Yes — all protan users see the same filtered result',
          isCorrect: false,
          explanation: 'Even within the same CVD category, individuals vary. Simulation is an average approximation.',
        },
        {
          id: 'd',
          label: 'No — simulation is inaccurate and should not be used',
          isCorrect: false,
          explanation: 'Simulation is a valuable first-pass tool despite being an approximation.',
        },
      ],
    },
    {
      id: 'q2',
      prompt: 'Why should inclusive color checks happen early in the design process?',
      choices: [
        {
          id: 'a',
          label: 'Because tools only work on early-stage designs',
          isCorrect: false,
          explanation: 'Tools work at any stage. The reason to check early is about the cost of changes.',
        },
        {
          id: 'b',
          label: 'Because structural fixes are much harder after the design is locked — catching problems early is cheaper',
          isCorrect: true,
          explanation: 'Switching from color-only dots to labeled badges is trivial in a design file and very costly in a shipped product.',
        },
        {
          id: 'c',
          label: 'Because accessibility problems disappear later in the process',
          isCorrect: false,
          explanation: 'Accessibility problems do not self-resolve. They become harder and more expensive to fix over time.',
        },
        {
          id: 'd',
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
          id: 'a',
          label: 'Nothing — simulation is sufficient for all accessibility checking',
          isCorrect: false,
          explanation: 'Simulation is a mathematical approximation. Real users provide nuance, reactions, and task completion data that filters cannot capture.',
        },
        {
          id: 'b',
          label: 'Real task completion data, individual nuance, and practical reactions to design choices',
          isCorrect: true,
          explanation: 'Even occasional user testing significantly improves understanding beyond what any filter can show.',
        },
        {
          id: 'c',
          label: 'More accurate color values for the design system',
          isCorrect: false,
          explanation: 'User testing is about usability and comprehension, not about calibrating color values.',
        },
        {
          id: 'd',
          label: 'Faster audit turnaround',
          isCorrect: false,
          explanation: 'User testing is typically slower than simulation — its value is depth of insight, not speed.',
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
