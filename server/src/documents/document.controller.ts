import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UseGuards,
  Request,
  Controller,
} from '@nestjs/common';

import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { use } from 'passport';

@Controller('documents')
@UseGuards(JwtAuthGuard)
export class DocumentsController{
    constructor(private readonly documentsService: DocumentsService) {}
    )
}
