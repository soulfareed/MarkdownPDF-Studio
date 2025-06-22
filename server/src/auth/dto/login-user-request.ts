import { ApiProperty } from '@nestjs/swagger';

export class LoginUserRequest {
  @ApiProperty({
    type: 'string',
  })
  email: string;

  @ApiProperty({
    type: 'string',
  })
  password: string;
}
