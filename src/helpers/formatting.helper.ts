import { Injectable } from '@nestjs/common';
import { Media, Post, Publication } from '@prisma/client';

@Injectable()
export class FormattingHelper {
  static removeDbDates(body: Publication | Post | Media) {
    delete body.createdAt;
    delete body.updatedAt;
    return body;
  }
}
