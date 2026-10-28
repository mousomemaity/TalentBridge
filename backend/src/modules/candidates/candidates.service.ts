import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { CandidateProfile, CandidateProfileDocument } from '../../database/schemas/candidate-profile.schema';
import {
  UpdateProfileDto,
  AddExperienceDto,
  AddEducationDto,
  UpdateSkillsDto,
  UpdatePreferencesDto,
  UpdateVisibilityDto,
} from './dto/update-profile.dto';

@Injectable()
export class CandidatesService {
  constructor(
    @InjectModel(CandidateProfile.name)
    private readonly candidateProfileModel: Model<CandidateProfileDocument>,
  ) {}

  async getProfileByUserId(userId: string) {
    let profile = await this.candidateProfileModel.findOne({ userId }).exec();
    if (!profile) {
      profile = await this.candidateProfileModel.create({
        _id: uuidv4(),
        userId,
        skills: [],
        experiences: [],
        educations: [],
        preferences: {},
        visibility: 'PUBLIC',
        openToWork: true,
      });
    }
    return profile;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const profile = await this.getProfileByUserId(userId);
    if (dto.headline !== undefined) profile.headline = dto.headline;
    if (dto.summary !== undefined) profile.summary = dto.summary;
    if (dto.location !== undefined) profile.location = dto.location;
    if (dto.yearsExperience !== undefined) profile.yearsExperience = dto.yearsExperience;
    return profile.save();
  }

  async addExperience(userId: string, dto: AddExperienceDto) {
    const profile = await this.getProfileByUserId(userId);
    const exp = {
      id: uuidv4(),
      ...dto,
    };
    profile.experiences.push(exp as any);
    await profile.save();
    return exp;
  }

  async deleteExperience(userId: string, expId: string) {
    const profile = await this.getProfileByUserId(userId);
    profile.experiences = profile.experiences.filter((e) => e.id !== expId);
    await profile.save();
    return { success: true, message: 'Experience removed' };
  }

  async addEducation(userId: string, dto: AddEducationDto) {
    const profile = await this.getProfileByUserId(userId);
    const edu = {
      id: uuidv4(),
      ...dto,
    };
    profile.educations.push(edu as any);
    await profile.save();
    return edu;
  }

  async updateSkills(userId: string, dto: UpdateSkillsDto) {
    const profile = await this.getProfileByUserId(userId);
    profile.skills = dto.skills.map((s) => ({
      name: s.name,
      level: s.level || 'INTERMEDIATE',
      yearsExperience: s.yearsExperience || 1,
    }));
    return profile.save();
  }

  async updatePreferences(userId: string, dto: UpdatePreferencesDto) {
    const profile = await this.getProfileByUserId(userId);
    profile.preferences = { ...profile.preferences, ...dto };
    return profile.save();
  }

  async updateVisibility(userId: string, dto: UpdateVisibilityDto) {
    const profile = await this.getProfileByUserId(userId);
    if (dto.visibility) profile.visibility = dto.visibility;
    if (dto.openToWork !== undefined) profile.openToWork = dto.openToWork;
    if (dto.blockedCompanyIds) profile.blockedCompanyIds = dto.blockedCompanyIds;
    return profile.save();
  }
}
