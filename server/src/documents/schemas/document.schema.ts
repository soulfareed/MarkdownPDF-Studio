import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MarkdownDocument extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ required: true, ref: 'User' })
  userId: string;
}

export const MarkdownDocumentSchema =
  SchemaFactory.createForClass(MarkdownDocument);
