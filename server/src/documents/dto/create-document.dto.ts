import { ApiProperty } from '@nestjs/swagger';

export class CreateDocumentDto {
  @ApiProperty({ type: 'string' })
  title: string;
  @ApiProperty({ type: 'string' })
  content: string;
  @ApiProperty({ type: 'string' })
  userId?: string;
}
