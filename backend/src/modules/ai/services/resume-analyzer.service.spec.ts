import { ResumeAnalyzerService } from './resume-analyzer.service';
import { LlmClientService } from './llm-client.service';

describe('ResumeAnalyzerService', () => {
  let service: ResumeAnalyzerService;
  let mockLlm: jest.Mocked<LlmClientService>;

  beforeEach(() => {
    mockLlm = {
      isConfigured: jest.fn().mockReturnValue(true),
      generateChatCompletion: jest.fn(),
    } as any;
    service = new ResumeAnalyzerService(mockLlm);
  });

  it('analyzes skills and provides strengths and recommendations', async () => {
    mockLlm.generateChatCompletion.mockResolvedValueOnce(
      JSON.stringify({
        identifiedSkills: ['TypeScript', 'React'],
        strengths: ['Strong modern frontend stack'],
        missingSkills: ['Kubernetes'],
        improvementSuggestions: ['Add metrics'],
        score: 85,
        overview: 'High proficiency candidate',
      }),
    );

    const result = await service.analyzeResume(['TypeScript', 'React'], 'Experienced developer', []);
    expect(result.score).toBe(85);
    expect(result.missingSkills).toContain('Kubernetes');
    expect(result.strengths.length).toBeGreaterThan(0);
  });
});
