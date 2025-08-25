import { IsNotEmpty, IsString } from 'class-validator';

export class AuthenticateGitHubDTO {
  @IsString()
  @IsNotEmpty()
  code: string;
}
