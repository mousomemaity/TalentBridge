import { JobMatcherService } from './job-matcher.service';
import { WorkplaceType } from '../../../common/constants/roles.enum';

describe('JobMatcherService', () => {
  let service: JobMatcherService;

  beforeEach(() => {
    const mockLlm: any = { isConfigured: () => false };
    service = new JobMatcherService(mockLlm);
  });

  it('computes 0-100 match with skill, experience, location and salary breakdown', () => {
    const candidate = {
      userId: 'cand-1',
      skills: [{ name: 'TypeScript' }, { name: 'NestJS' }, { name: 'MongoDB' }],
      yearsExperience: 4,
      location: 'New York',
      remoteOnly: false,
      targetSalaryMin: 120000,
    };

    const job = {
      jobId: 'job-1',
      title: 'Full Stack Engineer',
      skills: ['TypeScript', 'NestJS', 'React', 'MongoDB'],
      workplaceType: WorkplaceType.HYBRID,
      location: 'New York',
      salaryMin: 110000,
      salaryMax: 140000,
    };

    const result = service.computeMatch(candidate, job);

    expect(result.overallScore).toBeGreaterThan(60);
    expect(result.explainability.matchedSkills).toContain('TypeScript');
    expect(result.explainability.missingSkills).toContain('React');
    expect(result.explainability.scoreBreakdown.total).toBe(result.overallScore);
    expect(result.explainability.governanceNotice).toContain('never automatically reject');
  });

  it('discounts remote-only candidate on onsite job', () => {
    const candidate = {
      userId: 'cand-2',
      skills: [{ name: 'Python' }],
      yearsExperience: 3,
      remoteOnly: true,
    };

    const job = {
      jobId: 'job-2',
      title: 'Python Dev',
      skills: ['Python'],
      workplaceType: WorkplaceType.ONSITE,
      location: 'Seattle',
    };

    const result = service.computeMatch(candidate, job);
    expect(result.explainability.scoreBreakdown.locationScore).toBeLessThan(5);
  });
});
