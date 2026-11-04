import { MongooseModuleOptions } from '@nestjs/mongoose';
import * as dotenv from 'dotenv';

dotenv.config();

export interface DatabaseConfig {
  uri: string;
  options: MongooseModuleOptions;
}

export function validateMongoUri(uri?: string): string {
  if (!uri || typeof uri !== 'string' || uri.trim() === '') {
    throw new Error(
      '[TalentBridge Database] Missing MONGODB_URI environment variable.\n' +
        'Please define MONGODB_URI in your environment or .env file.\n' +
        'Example local: mongodb://localhost:27017/talentbridge\n' +
        'Example Atlas: mongodb+srv://<username>:<password>@cluster0.example.mongodb.net/talentbridge?retryWrites=true&w=majority',
    );
  }

  const trimmed = uri.trim();
  if (!trimmed.startsWith('mongodb://') && !trimmed.startsWith('mongodb+srv://')) {
    throw new Error(
      `[TalentBridge Database] Invalid MONGODB_URI protocol. Must start with "mongodb://" or "mongodb+srv://". Provided: "${trimmed.substring(0, 15)}..."`,
    );
  }

  return trimmed;
}

export const getDatabaseConfig = (): DatabaseConfig => {
  const uri = validateMongoUri(process.env.MONGODB_URI);

  return {
    uri,
    options: {
      autoIndex: process.env.NODE_ENV !== 'production',
      serverSelectionTimeoutMS: 10000,
      connectTimeoutMS: 15000,
      socketTimeoutMS: 45000,
      maxPoolSize: 50,
      minPoolSize: 5,
    },
  };
};
