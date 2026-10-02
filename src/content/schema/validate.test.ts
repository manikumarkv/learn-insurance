import { describe, expect, it } from 'vitest';
import { validateContent, type ContentFile } from './validate';

const q = (type: string, answer: number) => ({
  type,
  question: `A ${type} question about endorsements?`,
  options: ['A claim', 'An endorsement', 'A renewal', 'A binder'],
  answer,
  explanation: 'An endorsement changes an active policy.',
});

/** A valid full term (Medium usage, 6 questions), based on the schema's example. */
function fullTerm(): Record<string, unknown> {
  return {
    term: 'Endorsement',
    contentStatus: 'full',
    alsoKnownAs: ['Policy change'],
    category: 'Policy Wording',
    lines: ['all'],
    usageFrequency: 'Medium',
    difficulty: 'Beginner',
    quickAnswer:
      'An endorsement is an official written change to an insurance policy after it starts, such as a new address, an added driver or extra coverage. It becomes part of the policy and can raise or lower the premium you pay for the rest of the term.',
    definition:
      'Your policy is a contract. When something changes, you do not buy a new policy. The insurer adds an endorsement.',
    example: 'Adding your teenage son as a driver on your car policy is done with an endorsement.',
    whereYoullSeeIt: ['Policy document', 'Declarations page'],
    flowStages: ['Changes', 'Renewal'],
    story: {
      person: 'Tom',
      steps: [
        { stage: 'Bind', text: 'Tom buys auto insurance for $100/month.' },
        { stage: 'Changes', highlight: true, text: 'Tom adds collision with an endorsement.' },
        { stage: 'Result', text: 'His premium goes up to $120/month.' },
      ],
    },
    visual: {
      caption: 'Same policy, updated.',
      diagram: {
        discriminant: 'who-pays',
        value: {
          total: 5000,
          parts: [
            { label: 'You', amount: 1000, paidBy: 'you' },
            { label: 'Insurer', amount: 4000, paidBy: 'insurer' },
          ],
        },
      },
    },
    questions: [
      q('scenario', 1),
      q('meaning', 0),
      q('scenario', 2),
      q('difference', 1),
      q('scenario', 3),
      q('meaning', 1),
    ],
    faqs: [
      {
        question: 'What is an endorsement in insurance?',
        answer: 'A written change to your policy.',
      },
      { question: 'Does it change my premium?', answer: 'It can.' },
    ],
    relatedTerms: ['premium', 'rider'],
    seo: {
      metaTitle: 'What Is an Endorsement? Insurance Definition & Example',
      metaDescription:
        'An endorsement is an official change to your insurance policy after it starts. See a plain-English definition, a real example and how it affects your premium.',
    },
    sources: [
      { title: 'NAIC', url: 'https://content.naic.org/' },
      { title: 'III', url: 'https://www.iii.org/' },
    ],
    meta: {
      source: 'ai',
      createdAt: '2026-09-30',
      updatedAt: '2026-09-30',
      reviewedBy: 'term-reviewer',
    },
  };
}

const basicTerm = (term: string) => ({
  term,
  contentStatus: 'basic',
  category: 'Core Concept',
  lines: ['all'],
  usageFrequency: 'High',
  difficulty: 'Beginner',
  definition: `${term} definition.`,
  example: `${term} example.`,
  meta: { source: 'editorial' },
});

function run(endorsement: Record<string, unknown>, extra: ContentFile[] = []) {
  const terms: ContentFile[] = [
    { file: 'terms/endorsement.yaml', id: 'endorsement', data: endorsement },
    { file: 'terms/premium.yaml', id: 'premium', data: basicTerm('Premium') },
    { file: 'terms/rider.yaml', id: 'rider', data: basicTerm('Rider') },
    ...extra,
  ];
  return validateContent({ terms, types: [], paths: [] });
}

function messages(endorsement: Record<string, unknown>) {
  return run(endorsement).map((e) => `${e.field}: ${e.message}`);
}

describe('validateContent', () => {
  it('accepts a valid full term and basic terms', () => {
    expect(run(fullTerm())).toEqual([]);
  });

  it('names the file and field', () => {
    const t = { ...fullTerm(), category: 'Cars' };
    expect(run(t)[0]).toMatchObject({ file: 'terms/endorsement.yaml', field: 'category' });
  });

  it('checks the question pool size by usage', () => {
    const t = { ...fullTerm(), usageFrequency: 'High' };
    expect(messages(t)).toContain('questions: 6 questions for High usage, needs 10');
  });

  it('checks word and character limits', () => {
    const t = fullTerm();
    t.quickAnswer = 'Too short.';
    (t.seo as Record<string, string>).metaTitle = 'x'.repeat(61);
    expect(messages(t)).toEqual(
      expect.arrayContaining([
        'quickAnswer: 2 words, needs 40–60',
        'seo.metaTitle: 61 characters, max 60',
      ]),
    );
  });

  it('checks that related terms and [[id]] links exist', () => {
    const t = {
      ...fullTerm(),
      relatedTerms: ['premium', 'binder'],
      example: 'Pay the [[deductible]].',
    };
    expect(messages(t)).toEqual(
      expect.arrayContaining([
        'relatedTerms[1]: no term with id "binder"',
        "example: [[deductible]] links to a term that doesn't exist",
      ]),
    );
  });

  it('checks that money splits add up', () => {
    const t = fullTerm();
    (t.visual as { diagram: { value: { total: number } } }).diagram.value.total = 6000;
    expect(messages(t)).toContain(
      'visual.diagram.value.parts: amounts add up to 5000, but total is 6000',
    );
  });

  it('checks the answer index is in range', () => {
    const t = fullTerm();
    t.questions = (t.questions as { answer: number }[]).map((qq, i) =>
      i === 0 ? { ...qq, answer: 4 } : qq,
    );
    expect(messages(t)).toContain(
      'questions[0].answer: answer 4 is out of range (4 options, counted from 0)',
    );
  });

  it('does not require full fields on basic terms', () => {
    const errors = validateContent({
      terms: [{ file: 'terms/claim.yaml', id: 'claim', data: basicTerm('Claim') }],
      types: [],
      paths: [],
    });
    expect(errors).toEqual([]);
  });

  it('checks learning path terms and type parents', () => {
    const errors = validateContent({
      terms: [],
      types: [
        {
          file: 'types/life.term.yaml',
          id: 'life.term',
          data: {
            name: 'Term Life',
            parent: 'life',
            description: 'Covers a fixed period.',
            segment: 'Personal',
          },
        },
      ],
      paths: [
        {
          file: 'paths/basics.yaml',
          id: 'basics',
          data: { title: 'Basics', modules: [{ title: 'Start', terms: ['premium'] }] },
        },
      ],
    });
    expect(errors.map((e) => `${e.field}: ${e.message}`)).toEqual([
      'parent: no insurance type with id "life"',
      'modules[0].terms[0]: no term with id "premium"',
    ]);
  });
});
