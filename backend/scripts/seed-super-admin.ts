import * as dotenv from 'dotenv';
import * as path from 'path';
import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { UserRole, UserStatus } from '../src/common/constants/roles.enum';
import { UserSchema, UserDocument } from '../src/database/schemas/user.schema';

// Load environment variables from backend/.env (priority) and fallback to cwd
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config();

export interface SuperAdminSeedResult {
  action: 'created' | 'already_exists';
  userId: string;
  email: string;
  role: string;
  status: string;
}

export async function seedSuperAdmin(): Promise<SuperAdminSeedResult> {
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is required. Please check your backend .env file.');
  }

  const email = process.env.SUPER_ADMIN_EMAIL?.trim();
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const firstName = process.env.SUPER_ADMIN_FIRST_NAME?.trim();
  const lastName = process.env.SUPER_ADMIN_LAST_NAME?.trim();

  const missingVars: string[] = [];
  if (!email) missingVars.push('SUPER_ADMIN_EMAIL');
  if (!password) missingVars.push('SUPER_ADMIN_PASSWORD');
  if (!firstName) missingVars.push('SUPER_ADMIN_FIRST_NAME');
  if (!lastName) missingVars.push('SUPER_ADMIN_LAST_NAME');

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      `Please configure them in your backend .env file.`
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('SUPER_ADMIN_EMAIL must be a valid email address.');
  }

  if (password.length < 8) {
    throw new Error('SUPER_ADMIN_PASSWORD must be at least 8 characters long.');
  }

  const normalizedEmail = email.toLowerCase();
  const maskedUri = mongoUri.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@');

  console.log('=====================================================');
  console.log('       JobPilot — Super Admin Provisioning Tool       ');
  console.log('=====================================================');
  console.log(`Connecting to MongoDB: ${maskedUri}`);

  await mongoose.connect(mongoUri);
  console.log('MongoDB connected successfully.\n');

  try {
    const UserModel: mongoose.Model<any> =
      (mongoose.models.User as mongoose.Model<any>) ||
      mongoose.model('User', UserSchema as any);

    const existingUser = await UserModel.findOne({ email: normalizedEmail }).exec();

    if (existingUser) {
      if (existingUser.role === UserRole.SUPER_ADMIN) {
        console.log(`[SEED] Super Admin account with email "${normalizedEmail}" already exists.`);
        console.log(`       User ID: ${existingUser._id || existingUser.id}`);
        console.log('       No duplicate account was created.');
        return {
          action: 'already_exists',
          userId: existingUser._id || existingUser.id,
          email: existingUser.email,
          role: existingUser.role,
          status: existingUser.status,
        };
      } else {
        const errorMsg =
          `Conflict Error: An account with email "${normalizedEmail}" already exists with role "${existingUser.role}". ` +
          `Never silently promote an existing account. Aborting seed operation.`;
        console.error(`[ERROR] ${errorMsg}`);
        throw new Error(errorMsg);
      }
    }

    // Hash password following the existing AuthService approach (bcryptjs with 10 salt rounds)
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const superAdmin = await UserModel.create({
      _id: uuidv4(),
      email: normalizedEmail,
      passwordHash,
      role: UserRole.SUPER_ADMIN,
      status: UserStatus.ACTIVE,
      firstName,
      lastName,
      emailVerified: true,
      mfaEnabled: false,
    });

    console.log('-----------------------------------------------------');
    console.log('✓ Super Admin created successfully!');
    console.log(`  User ID:    ${superAdmin._id || superAdmin.id}`);
    console.log(`  Email:      ${superAdmin.email}`);
    console.log(`  Name:       ${superAdmin.firstName} ${superAdmin.lastName}`);
    console.log(`  Role:       ${superAdmin.role}`);
    console.log(`  Status:     ${superAdmin.status}`);
    console.log('-----------------------------------------------------');

    return {
      action: 'created',
      userId: superAdmin._id || superAdmin.id,
      email: superAdmin.email,
      role: superAdmin.role,
      status: superAdmin.status,
    };
  } finally {
    await mongoose.disconnect();
    console.log('\nMongoDB connection closed safely.');
  }
}

// Execute when run directly via CLI (ts-node / node)
if (require.main === module) {
  seedSuperAdmin()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error(`[SEED FAILED] ${err.message}`);
      process.exit(1);
    });
}
