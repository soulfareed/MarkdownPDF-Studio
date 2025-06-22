import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  Req,
  UseGuards,
} from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { CreateDocumentDto } from './dto/create-document.dto';
import { UpdateDocumentDto } from './dto/update-document.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller('documents')
@ApiBearerAuth('access-token')
@UseGuards(JwtAuthGuard)
export class DocumentsController {
  constructor(private documentsService: DocumentsService) {}

  @Post()
  @ApiBearerAuth('access-token')
  create(@Body() createDocumentDto: CreateDocumentDto, @Req() req) {
    return this.documentsService.create({
      ...createDocumentDto,
      userId: req.user._id,
    });
  }

  @Get()
  findAll(@Req() req) {
    return this.documentsService.findAll(req.user._id);
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.documentsService.findOne(id, req.user._id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDocumentDto: UpdateDocumentDto,
    @Req() req,
  ) {
    return this.documentsService.update(id, updateDocumentDto, req.user._id);
  }

  // @Delete(':id')
  // remove(@Param('id') id: string, @Req() req) {
  //   return this.documentsService.remove(id, req.user._id);
  // }
}
