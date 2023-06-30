import { UserRole } from '@prisma/client';

export interface TokenDecoded {
  userId: string;
  timestamp: number;
  roles: UserRole[];
}
