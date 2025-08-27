export interface CreateUserDTO {
  id?: string;
  name?: string | null;
  email?: string | null;
  avatarURL: string;
  externalAccountId: number;
}
