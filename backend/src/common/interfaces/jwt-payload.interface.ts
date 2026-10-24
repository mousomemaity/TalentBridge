import { UserRole } from '../constants/roles.enum';

export interface JwtPayload {
  sub: string; // userId (UUID)
  email: string;
  role: UserRole;
  tenantId?: string; // companyId / tenantId (UUID)
  candidateId?: string; // candidate profile ID (UUID)
  sid?: string; // session ID
  iat?: number;
  exp?: number;
}

export interface AuthenticatedUser {
  userId: string;
  email: string;
  role: UserRole;
  tenantId?: string;
  candidateId?: string;
  sessionId?: string;
}
