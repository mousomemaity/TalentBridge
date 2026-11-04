import assert from 'node:assert';
import mongoose from 'mongoose';
import { validateMongoUri } from '../src/config/database.config';
import { ModelNames } from '../src/config/database.constants';
import { AccountStatus, EmploymentType, JobStatus, RemoteType, UserRole } from '../src/enums';
import { Models } from '../src/index';

async function runTests() {
  console.log('=====================================================');
  console.log('       TalentBridge Database Schema Test Suite       ');
  console.log('=====================================================');
  let passed = 0;
  let failed = 0;

  function test(name: string, fn: () => void | Promise<void>) {
    try {
      fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`[FAIL] ${name}`);
      console.error('       Error:', err.message);
      failed++;
    }
  }

  async function testAsync(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`[FAIL] ${name}`);
      console.error('       Error:', err.message);
      failed++;
    }
  }

  // 1. Connection Config Tests
  test('Config: Throws if MONGODB_URI is empty or undefined', () => {
    assert.throws(() => validateMongoUri(''), /Missing MONGODB_URI/);
    assert.throws(() => validateMongoUri(undefined), /Missing MONGODB_URI/);
  });

  test('Config: Throws if MONGODB_URI has invalid protocol', () => {
    assert.throws(() => validateMongoUri('postgres://localhost:5432/db'), /Invalid MONGODB_URI protocol/);
    assert.throws(() => validateMongoUri('http://localhost:27017'), /Invalid MONGODB_URI protocol/);
  });

  test('Config: Accepts valid mongodb:// and mongodb+srv:// URIs', () => {
    assert.strictEqual(
      validateMongoUri('mongodb://localhost:27017/talentbridge'),
      'mongodb://localhost:27017/talentbridge',
    );
    assert.strictEqual(
      validateMongoUri('mongodb+srv://user:pass@cluster.mongodb.net/talentbridge'),
      'mongodb+srv://user:pass@cluster.mongodb.net/talentbridge',
    );
  });

  // 2. User Schema Validation Tests
  await testAsync('User: Fails validation on invalid email address', async () => {
    const UserModel = Models.getUserModel();
    const invalidUser = new UserModel({
      email: 'not-an-email',
      passwordHash: 'hashed_password_sample',
      role: UserRole.CANDIDATE,
    });
    const err = invalidUser.validateSync();
    assert.ok(err?.errors['email'], 'Expected validation error on email');
  });

  await testAsync('User: Applies default role (CANDIDATE) and status (PENDING)', async () => {
    const UserModel = Models.getUserModel();
    const user = new UserModel({
      email: 'test@example.com',
      passwordHash: 'secret_hash',
    });
    assert.strictEqual(user.role, UserRole.CANDIDATE);
    assert.strictEqual(user.accountStatus, AccountStatus.PENDING);
  });

  await testAsync('User: Normalizes email to lowercase and strips whitespace', async () => {
    const UserModel = Models.getUserModel();
    const user = new UserModel({
      email: '  ALICE.SMITH@EXAMPLE.COM  ',
      passwordHash: 'secret_hash',
    });
    assert.strictEqual(user.email, 'alice.smith@example.com');
  });

  await testAsync('User: Excludes passwordHash in toJSON output', async () => {
    const UserModel = Models.getUserModel();
    const user = new UserModel({
      email: 'security.check@example.com',
      passwordHash: 'super_secret_hash_value',
    });
    const json = user.toJSON();
    assert.strictEqual(json.passwordHash, undefined, 'passwordHash must never be exposed in toJSON');
  });

  // 3. Job Schema Validation Tests
  await testAsync('Job: Rejects salary maximum less than minimum', async () => {
    const JobModel = Models.getJobModel();
    const invalidJob = new JobModel({
      company: new mongoose.Types.ObjectId(),
      title: 'Backend Engineer',
      slug: 'backend-engineer',
      description: 'Role description',
      employmentType: EmploymentType.FULL_TIME,
      remoteType: RemoteType.REMOTE,
      status: JobStatus.PUBLISHED,
      salaryRange: {
        min: 150000,
        max: 100000, // Invalid: max < min
        currency: 'USD',
        period: 'YEARLY',
      },
    });
    const err = invalidJob.validateSync();
    assert.ok(
      err?.errors['salaryRange.max'] || err?.errors['salaryRange'],
      'Expected salary max >= min validation failure',
    );
  });

  await testAsync('Job: Accepts valid salary range where max >= min', async () => {
    const JobModel = Models.getJobModel();
    const validJob = new JobModel({
      company: new mongoose.Types.ObjectId(),
      title: 'Backend Engineer',
      slug: 'valid-backend-engineer',
      description: 'Role description',
      employmentType: EmploymentType.FULL_TIME,
      remoteType: RemoteType.REMOTE,
      status: JobStatus.PUBLISHED,
      salaryRange: {
        min: 120000,
        max: 160000,
        currency: 'USD',
        period: 'YEARLY',
      },
    });
    const err = validJob.validateSync();
    assert.strictEqual(err, undefined);
  });

  await testAsync('Job: Rejects invalid non-URL-safe slug', async () => {
    const JobModel = Models.getJobModel();
    const invalidJob = new JobModel({
      company: new mongoose.Types.ObjectId(),
      title: 'Backend Engineer',
      slug: 'Invalid Slug with Spaces & Caps!',
      description: 'Role description',
      employmentType: EmploymentType.FULL_TIME,
      remoteType: RemoteType.REMOTE,
      salaryRange: { min: 100000, max: 120000, currency: 'USD', period: 'YEARLY' },
    });
    const err = invalidJob.validateSync();
    assert.ok(err?.errors['slug'], 'Expected validation error on invalid slug');
  });

  // 4. MatchResult Schema Validation Tests
  await testAsync('MatchResult: Rejects score less than 0 or greater than 100', async () => {
    const MatchModel = Models.getMatchResultModel();
    const invalidUnder = new MatchModel({
      candidate: new mongoose.Types.ObjectId(),
      job: new mongoose.Types.ObjectId(),
      totalScore: -5,
      modelVersion: 'v1.0',
    });
    const errUnder = invalidUnder.validateSync();
    assert.ok(errUnder?.errors['totalScore']);

    const invalidOver = new MatchModel({
      candidate: new mongoose.Types.ObjectId(),
      job: new mongoose.Types.ObjectId(),
      totalScore: 105,
      modelVersion: 'v1.0',
    });
    const errOver = invalidOver.validateSync();
    assert.ok(errOver?.errors['totalScore']);
  });

  await testAsync('MatchResult: Accepts valid score between 0 and 100', async () => {
    const MatchModel = Models.getMatchResultModel();
    const validMatch = new MatchModel({
      candidate: new mongoose.Types.ObjectId(),
      job: new mongoose.Types.ObjectId(),
      totalScore: 94,
      componentBreakdown: {
        skillsScore: 95,
        experienceScore: 90,
        educationScore: 92,
        locationScore: 100,
        matchedSkills: ['TypeScript', 'React'],
        missingSkills: [],
      },
      modelVersion: 'talentbridge-ai-v1',
    });
    const err = validMatch.validateSync();
    assert.strictEqual(err, undefined);
  });

  // 5. Resume Schema Security Tests
  await testAsync('Resume: Excludes storageKey in toJSON output', async () => {
    const ResumeModel = Models.getResumeModel();
    const resume = new ResumeModel({
      candidate: new mongoose.Types.ObjectId(),
      fileName: 'my_resume.pdf',
      storageKey: 's3://private-bucket/keys/resume_secret.pdf',
      mimeType: 'application/pdf',
      fileSize: 10240,
    });
    const json = resume.toJSON();
    assert.strictEqual(json.storageKey, undefined, 'storageKey must not be exposed in toJSON');
  });

  // 6. Index Definitions Verification
  test('Indexes: Unique indexes correctly declared on schemas', () => {
    const UserModel = Models.getUserModel();
    const CompanyModel = Models.getCompanyModel();
    const SavedJobModel = Models.getSavedJobModel();
    const ApplicationModel = Models.getApplicationModel();
    const MatchResultModel = Models.getMatchResultModel();

    const userIndexes = UserModel.schema.indexes();
    const companyIndexes = CompanyModel.schema.indexes();
    const savedJobIndexes = SavedJobModel.schema.indexes();
    const appIndexes = ApplicationModel.schema.indexes();
    const matchIndexes = MatchResultModel.schema.indexes();

    // Check unique email on User
    const hasUniqueEmail = userIndexes.some(
      ([fields, options]) => fields['email'] === 1 && options?.unique === true,
    );
    assert.ok(hasUniqueEmail, 'User schema must have unique index on email');

    // Check unique slug on Company
    const hasUniqueCompanySlug = companyIndexes.some(
      ([fields, options]) => fields['slug'] === 1 && options?.unique === true,
    );
    assert.ok(hasUniqueCompanySlug, 'Company schema must have unique index on slug');

    // Check compound unique candidate-job on SavedJob
    const hasUniqueSavedJob = savedJobIndexes.some(
      ([fields, options]) => fields['candidate'] === 1 && fields['job'] === 1 && options?.unique === true,
    );
    assert.ok(hasUniqueSavedJob, 'SavedJob schema must have compound unique index on { candidate, job }');

    // Check compound unique job-candidate on Application
    const hasUniqueApplication = appIndexes.some(
      ([fields, options]) => fields['job'] === 1 && fields['candidate'] === 1 && options?.unique === true,
    );
    assert.ok(hasUniqueApplication, 'Application schema must have compound unique index on { job, candidate }');

    // Check compound unique job-candidate on MatchResult
    const hasUniqueMatch = matchIndexes.some(
      ([fields, options]) => fields['job'] === 1 && fields['candidate'] === 1 && options?.unique === true,
    );
    assert.ok(hasUniqueMatch, 'MatchResult schema must have compound unique index on { job, candidate }');
  });

  console.log('=====================================================');
  console.log(`Summary: ${passed} passed, ${failed} failed.`);
  console.log('=====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
