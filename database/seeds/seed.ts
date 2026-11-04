import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { getDatabaseConfig } from '../src/config/database.config';
import { Models } from '../src/index';
import {
  sampleApplications,
  sampleApplicationStageHistories,
  sampleCandidateProfiles,
  sampleCompanies,
  sampleCompanyMembers,
  sampleJobs,
  sampleMatchResults,
  sampleNotifications,
  samplePipelineStages,
  sampleResumes,
  sampleSavedJobs,
  sampleSavedSearches,
  sampleUsers,
} from './seed-data';

dotenv.config();

async function runSeed() {
  console.log('=====================================================');
  console.log('       TalentBridge Database Seeder (Safe Mode)      ');
  console.log('=====================================================');

  const config = getDatabaseConfig();
  console.log(`Connecting to MongoDB: ${config.uri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')}`);

  await mongoose.connect(config.uri, config.options);
  console.log('MongoDB connected successfully.\n');

  try {
    // 1. Seed Users
    console.log('1. Seeding Users...');
    const UserModel = Models.getUserModel();
    for (const u of sampleUsers) {
      await UserModel.findOneAndUpdate(
        { email: u.email },
        { $set: u },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    console.log(`   Seeded ${sampleUsers.length} users.`);

    // 2. Seed Companies
    console.log('2. Seeding Companies...');
    const CompanyModel = Models.getCompanyModel();
    for (const c of sampleCompanies) {
      await CompanyModel.findOneAndUpdate(
        { slug: c.slug },
        { $set: c },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    console.log(`   Seeded ${sampleCompanies.length} companies.`);

    // 3. Seed Company Members
    console.log('3. Seeding Company Members...');
    const CompanyMemberModel = Models.getCompanyMemberModel();
    for (const cm of sampleCompanyMembers) {
      await CompanyMemberModel.findOneAndUpdate(
        { company: cm.company, user: cm.user },
        { $set: cm },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    console.log(`   Seeded ${sampleCompanyMembers.length} company members.`);

    // 4. Seed Candidate Profiles
    console.log('4. Seeding Candidate Profiles...');
    const CandidateProfileModel = Models.getCandidateProfileModel();
    for (const cp of sampleCandidateProfiles) {
      await CandidateProfileModel.findOneAndUpdate(
        { user: cp.user },
        { $set: cp },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    console.log(`   Seeded ${sampleCandidateProfiles.length} candidate profiles.`);

    // 5. Seed Resumes
    console.log('5. Seeding Resumes...');
    const ResumeModel = Models.getResumeModel();
    for (const r of sampleResumes) {
      await ResumeModel.findOneAndUpdate(
        { candidate: r.candidate, fileName: r.fileName },
        { $set: r },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    console.log(`   Seeded ${sampleResumes.length} resumes.`);

    // 6. Seed Pipeline Stages
    console.log('6. Seeding Pipeline Stages...');
    const PipelineStageModel = Models.getPipelineStageModel();
    for (const ps of samplePipelineStages) {
      await PipelineStageModel.findOneAndUpdate(
        { company: ps.company, name: ps.name },
        { $set: ps },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    console.log(`   Seeded ${samplePipelineStages.length} pipeline stages.`);

    // 7. Seed Jobs
    console.log('7. Seeding Jobs...');
    const JobModel = Models.getJobModel();
    for (const j of sampleJobs) {
      await JobModel.findOneAndUpdate(
        { slug: j.slug },
        { $set: j },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    console.log(`   Seeded ${sampleJobs.length} jobs.`);

    // 8. Seed Match Results
    console.log('8. Seeding Match Results...');
    const MatchResultModel = Models.getMatchResultModel();
    for (const mr of sampleMatchResults) {
      await MatchResultModel.findOneAndUpdate(
        { candidate: mr.candidate, job: mr.job },
        { $set: mr },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    console.log(`   Seeded ${sampleMatchResults.length} match results.`);

    // 9. Seed Applications
    console.log('9. Seeding Applications...');
    const ApplicationModel = Models.getApplicationModel();
    for (const a of sampleApplications) {
      await ApplicationModel.findOneAndUpdate(
        { job: a.job, candidate: a.candidate },
        { $set: a },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    console.log(`   Seeded ${sampleApplications.length} applications.`);

    // 10. Seed Application Stage Histories
    console.log('10. Seeding Application Stage Histories...');
    const HistoryModel = Models.getApplicationStageHistoryModel();
    for (const ash of sampleApplicationStageHistories) {
      await HistoryModel.findOneAndUpdate(
        { application: ash.application, nextStage: ash.nextStage },
        { $set: ash },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    console.log(`    Seeded ${sampleApplicationStageHistories.length} stage histories.`);

    // 11. Seed Saved Jobs & Saved Searches
    console.log('11. Seeding Saved Jobs & Saved Searches...');
    const SavedJobModel = Models.getSavedJobModel();
    for (const sj of sampleSavedJobs) {
      await SavedJobModel.findOneAndUpdate(
        { candidate: sj.candidate, job: sj.job },
        { $set: sj },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    const SavedSearchModel = Models.getSavedSearchModel();
    for (const ss of sampleSavedSearches) {
      await SavedSearchModel.findOneAndUpdate(
        { candidate: ss.candidate, keywords: ss.keywords },
        { $set: ss },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    console.log('    Seeded saved jobs & searches.');

    // 12. Seed Notifications
    console.log('12. Seeding Notifications...');
    const NotificationModel = Models.getNotificationModel();
    for (const n of sampleNotifications) {
      await NotificationModel.findOneAndUpdate(
        { recipient: n.recipient, title: n.title },
        { $set: n },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }
    console.log(`    Seeded ${sampleNotifications.length} notifications.`);

    console.log('\nSeed completed successfully! All entities are upserted and consistent.');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
  }
}

runSeed();
