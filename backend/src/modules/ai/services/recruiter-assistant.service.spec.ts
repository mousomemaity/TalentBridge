import { RecruiterAssistantService } from './recruiter-assistant.service';
import { LlmClientService } from './llm-client.service';

describe('RecruiterAssistantService', () => {
  let service: RecruiterAssistantService;
  let mockLlm: jest.Mocked<LlmClientService>;

  beforeEach(() => {
    mockLlm = {
      isConfigured: jest.fn().mockReturnValue(true),
      generateChatCompletion: jest.fn(),
    } as any;
    service = new RecruiterAssistantService(mockLlm);
  });

  it('generates job description with clear draft notice', async () => {
    mockLlm.generateChatCompletion.mockResolvedValueOnce(
      JSON.stringify({
        title: 'Backend Engineer',
        description: 'Design distributed systems.',
        suggestedSkills: ['TypeScript', 'Node.js'],
        responsibilities: ['Build APIs'],
        qualifications: ['3+ years exp'],
      }),
    );

    const draft = await service.generateJobDescription({ title: 'Backend Engineer' });
    expect(draft.title).toBe('Backend Engineer');
    expect(draft.draftNotice).toContain('AI-GENERATED DRAFT');
  });

  it('detects exclusionary jargon in bias check', async () => {
    const result = await service.checkBias({
      text: 'Looking for a rockstar ninja who is aggressive and a native english speaker.',
    });

    expect(result.hasBiasFlags).toBe(true);
    expect(result.flags.length).toBeGreaterThanOrEqual(3);
  });
});
