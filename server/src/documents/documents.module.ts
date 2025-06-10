import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentsService } from './documents.service';
import { DocumentsController } from './document.controller';
import {
  MarkdownDocument,
  MarkdownDocumentSchema,
} from './schemas/document.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MarkdownDocument.name, schema: MarkdownDocumentSchema },
    ]),
  ],
  providers: [DocumentsService],
  controllers: [DocumentsController],
  exports: [DocumentsService],
})
export class DocumentsModule {}
