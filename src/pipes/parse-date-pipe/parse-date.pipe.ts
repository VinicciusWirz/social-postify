import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';

interface ParseDatePipeOptions {
  optional?: boolean;
}

@Injectable()
export class ParseDatePipe implements PipeTransform<string, Date> {
  private readonly options?: ParseDatePipeOptions;
  private readonly dateFormat = /^\d{4}-\d{2}-\d{2}$/;
  constructor(options?: ParseDatePipeOptions) {
    this.options = options;
  }
  transform(value: string, metadata: ArgumentMetadata): Date {
    if (this.options?.optional && !value) {
      return null;
    }
    const date = new Date(value);
    if (isNaN(date.getTime()) || !this.dateFormat.test(value)) {
      throw new BadRequestException('Invalid date format');
    }

    return date;
  }
}
