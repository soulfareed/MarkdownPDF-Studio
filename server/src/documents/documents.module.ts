import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DocumentService } from './documents.service';
import { DocumentsController } from './documents.controller';
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
  providers: [DocumentService],
  controllers: [DocumentsController],
  exports: [DocumentService],
})
export class DocumentsModule {}
