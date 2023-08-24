import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { MediasService } from './medias.service';
import { CreateMediaDto } from './dto/create-media.dto';

@Controller('medias')
export class MediasController {
  constructor(private readonly mediasService: MediasService) {}

  @Post()
  async create(@Body() createMediaDto: CreateMediaDto) {
    return await this.mediasService.create(createMediaDto);
  }

  @Get()
  async findAll() {
    return await this.mediasService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return await this.mediasService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateMediaDto,
  ) {
    return await this.mediasService.update(id, body);
  }

  //TODO: Delete route dependencies
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediasService.remove(+id);
  }
}
