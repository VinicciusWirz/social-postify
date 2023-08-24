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
  findAll(
    @Query('published', new ParseBoolPipe({ optional: true }))
    published: boolean,
    @Query('after', new ParseDatePipe({ optional: true }))
    after: Date,
  ) {
    return this.publicationsService.findAll(published, after);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.publicationsService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updatePublicationDto: CreatePublicationDto,
  ) {
    return this.publicationsService.update(+id, updatePublicationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.publicationsService.remove(+id);
  }
}
