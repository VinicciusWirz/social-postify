import { Global, Module } from '@nestjs/common';
import { FormattingHelper } from './formatting.helper';

@Global()
@Module({
  providers: [FormattingHelper],
  exports: [FormattingHelper],
})
export class HelperModule {}
