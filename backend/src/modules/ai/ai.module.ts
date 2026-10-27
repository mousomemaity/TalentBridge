import { Module } from '@nestjs/common';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { LlmClientService } from './services/llm-client.service';
import { DocumentExtractorService } from './services/document-extractor.service';
import { ResumeParserService } from './services/resume-parser.service';
import { ResumeAnalyzerService } from './services/resume-analyzer.service';
import { JobMatcherService } from './services/job-matcher.service';
import { RecruiterAssistantService } from './services/recruiter-assistant.service';

@Module({
  controllers: [AiController],
  providers: [
    AiService,
    LlmClientService,
    DocumentExtractorService,
    ResumeParserService,
    ResumeAnalyzerService,
    JobMatcherService,
    RecruiterAssistantService,
  ],
  exports: [
    AiService,
    LlmClientService,
    DocumentExtractorService,
    ResumeParserService,
    ResumeAnalyzerService,
    JobMatcherService,
    RecruiterAssistantService,
  ],
})
export class AiModule {}
