import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { Resume, ResumeDocument } from '../../database/schemas/resume.schema';
import { CandidateProfile, CandidateProfileDocument } from '../../database/schemas/candidate-profile.schema';
import { CreateResumeDto, PresignFileDto } from './dto/create-resume.dto';

@Injectable()
export class ResumesService {
  constructor(
    @InjectModel(Resume.name) private readonly resumeModel: Model<ResumeDocument>,
    @InjectModel(CandidateProfile.name)
    private readonly candidateProfileModel: Model<CandidateProfileDocument>,
  ) {}

  async presignUpload(dto: PresignFileDto) {
    const fileId = uuidv4();
    const cleanFileName = dto.fileName.replace(/[^a-zA-Z0-9._-]/g, '');
    const uploadUrl = `https://storage.talentbridge.local/upload/${fileId}/${cleanFileName}`;
    const fileUrl = `https://storage.talentbridge.local/files/${fileId}/${cleanFileName}`;

    return {
      fileId,
      uploadUrl,
      fileUrl,
      expiresInSeconds: 300,
      headers: {
        'Content-Type': dto.mimeType,
      },
    };
  }

  async getResumes(userId: string) {
    return this.resumeModel.find({ userId }).sort({ createdAt: -1 }).exec();
  }

  async createResume(userId: string, dto: CreateResumeDto) {
    const hasExisting = await this.resumeModel.findOne({ userId }).exec();
    const isDefault = !hasExisting;

    const resume = await this.resumeModel.create({
      _id: uuidv4(),
      userId,
      fileId: dto.fileId,
      fileName: dto.fileName,
      fileUrl: dto.fileUrl,
      mimeType: dto.mimeType || 'application/pdf',
      sizeBytes: dto.sizeBytes || 0,
      isDefault,
      parseStatus: 'PENDING',
    });

    return resume;
  }

  async getResumeById(userId: string, resumeId: string) {
    const resume = await this.resumeModel.findById(resumeId).exec();
    if (!resume) {
      throw new NotFoundException('Resume not found');
    }
    if (resume.userId !== userId) {
      throw new ForbiddenException('Access denied to this resume');
    }
    return resume;
  }

  async parseResume(userId: string, resumeId: string) {
    const resume = await this.getResumeById(userId, resumeId);
    resume.parseStatus = 'PARSED';
    resume.parsedJson = {
      headline: 'Software Engineer',
      summary: 'Experienced developer specializing in modern distributed web systems and TypeScript architectures.',
      skills: ['TypeScript', 'Node.js', 'React', 'MongoDB', 'Docker', 'GraphQL'],
      yearsExperience: 4,
      experiences: [
        {
          title: 'Software Developer',
          company: 'Nexus Tech',
          startDate: '2022-01-01',
          current: true,
          description: 'Engineered high-throughput REST APIs and scalable backend architectures.',
        },
      ],
      educations: [
        {
          institution: 'State University',
          degree: 'B.S. in Computer Science',
          startDate: '2018-09-01',
          endDate: '2022-05-01',
        },
      ],
    };

    return resume.save();
  }

  async getParsedResume(userId: string, resumeId: string) {
    const resume = await this.getResumeById(userId, resumeId);
    return {
      resumeId: resume._id,
      parseStatus: resume.parseStatus,
      parsedJson: resume.parsedJson || null,
    };
  }

  async applyParsedData(userId: string, resumeId: string) {
    const resume = await this.getResumeById(userId, resumeId);
    if (!resume.parsedJson) {
      throw new NotFoundException('Resume has not been parsed yet');
    }

    const profile = await this.candidateProfileModel.findOne({ userId }).exec();
    if (profile) {
      if (resume.parsedJson.headline && !profile.headline) {
        profile.headline = resume.parsedJson.headline;
      }
      if (resume.parsedJson.summary && !profile.summary) {
        profile.summary = resume.parsedJson.summary;
      }
      if (resume.parsedJson.yearsExperience) {
        profile.yearsExperience = Math.max(profile.yearsExperience, resume.parsedJson.yearsExperience);
      }
      if (resume.parsedJson.skills?.length) {
        const existingSkillNames = new Set(profile.skills.map((s) => s.name.toLowerCase()));
        for (const skillName of resume.parsedJson.skills) {
          if (!existingSkillNames.has(skillName.toLowerCase())) {
            profile.skills.push({ name: skillName, level: 'INTERMEDIATE', yearsExperience: 2 });
          }
        }
      }
      await profile.save();
    }

    return { success: true, message: 'Parsed resume data merged into candidate profile' };
  }

  async setDefaultResume(userId: string, resumeId: string) {
    await this.getResumeById(userId, resumeId);
    await this.resumeModel.updateMany({ userId }, { isDefault: false }).exec();
    await this.resumeModel.findByIdAndUpdate(resumeId, { isDefault: true }).exec();
    return { success: true, message: 'Default resume updated' };
  }

  async deleteResume(userId: string, resumeId: string) {
    await this.getResumeById(userId, resumeId);
    await this.resumeModel.findByIdAndDelete(resumeId).exec();
    return { success: true, message: 'Resume deleted successfully' };
  }
}
