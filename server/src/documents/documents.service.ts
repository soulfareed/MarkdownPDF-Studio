import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { MarkdownDocument } from './schemas/document.schema';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectModel(MarkdownDocument.name)
    private documentModel: Model<MarkdownDocument>,
  ) {}

  // This service provides methods to interact with the MarkdownDocument model
  async create(createDocumentDto: CreateDocumentDto) {
    try {
      const createdDocument = new this.documentModel(createDocumentDto);
      return await createdDocument.save();
    } catch (error) {
      console.error('Database create error:', error);
      throw error;
    }
  }

  // This method retrieves all documents from the database
  async findAll(userId: string): Promise<MarkdownDocument[]> {
    return this.documentModel.find({ userId }).exec();
  }

  // This method retrieves a document by its ID
  async findOne(id: string, userId: string): Promise<MarkdownDocument> {
    return this.documentModel.findOne({ _id: id, userId }).exec();
  }

  // This method updates a document by its ID

  async update(
    id: string,
    updateDocumentDto: UpdateDocumentDto,
    userId: string,
  ) {
    try {
      const updated = await this.documentModel
        .findOneAndUpdate({ _id: id, userId }, updateDocumentDto, { new: true })
        .exec();

      if (!updated) {
        throw new Error('Document not found or access denied');
      }
      return updated;
    } catch (error) {
      console.error('Database update error:', error);
      throw error;
    }
  }
  async remove(id: string, userId: string): Promise<MarkdownDocument> {
    return this.documentModel.findOneAndDelete({ _id: id, userId }).exec();
  }
}
