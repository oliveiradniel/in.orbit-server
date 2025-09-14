export interface User {
  id?: string;
  name?: string | null;
  email?: string | null;
  avatarURL: string;
  externalAccountId: number;
  experiencePoints: number;
}
