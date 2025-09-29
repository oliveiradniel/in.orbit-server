import { ApiProperty } from '@nestjs/swagger';

export class GitHubAuthenticateResponseDOCS {
  @ApiProperty({
    example:
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjZTkzYmI0Ni05MGVjLTRhNjEtYTM3Zi1lMTEyOTA4OTMzZTciLCJpYXQiOjE3NTYxMjU3ODYsImV4cCI6MTc1NjI5ODU4Nn0.cPKtrNqY7-nEaCeWisupna9aF3MaC0E3Egmt6cOIhYo',
    description:
      'JWT access token returned after successful GitHub authentication.',
  })
  accessToken: string;
}
