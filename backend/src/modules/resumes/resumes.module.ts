import { Module } from '@nestjs/common';
import { ResumesController } from './resumes.controller';
import { FilesController } from './files.controller';
import { ResumesService } from './resumes.service';

@Module({
  controllers: [ResumesController, FilesController],
  providers: [ResumesService],
  exports: [ResumesService],
})
export class ResumesModule {}
