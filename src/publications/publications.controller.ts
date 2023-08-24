import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseBoolPipe,
  ParseIntPipe,
  Put,
} from '@nestjs/common';
import { PublicationsService } from './publications.service';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { ParseDatePipe } from '../pipes/parse-date-pipe/parse-date.pipe';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Post()
  async create(@Body() createPublicationDto: CreatePublicationDto) {
    return await this.publicationsService.create(createPublicationDto);
  }

  @Get()
  async findAll(
    @Query('published', new ParseBoolPipe({ optional: true }))
    published: boolean,
    @Query('after', new ParseDatePipe({ optional: true }))
    after: Date,
  ) {
    return await this.publicationsService.findAll(published, after);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.publicationsService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePublicationDto: CreatePublicationDto,
  ) {
    return await this.publicationsService.update(id, updatePublicationDto);
  }

  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    return await this.publicationsService.remove(id);
  }
}
