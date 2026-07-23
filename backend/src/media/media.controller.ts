import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { memoryStorage } from 'multer';
import { Permissions, CurrentUser } from '../auth/decorators/auth.decorators';
import type { AuthUser } from '../auth/interfaces/jwt-payload.interface';
import { MediaService } from './media.service';
import { MediaQueryDto, UpdateMediaDto } from './dto/media.dto';

@ApiTags('Admin Media')
@ApiBearerAuth()
@Controller('admin/media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @Permissions('media.manage')
  @ApiOperation({ summary: 'Upload media file' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 8 * 1024 * 1024 },
    }),
  )
  upload(
    @UploadedFile() file: Express.Multer.File,
    @CurrentUser() user: AuthUser,
  ) {
    return this.mediaService.upload(file, user.id);
  }

  @Get()
  @Permissions('media.manage')
  @ApiOperation({ summary: 'List media assets' })
  list(@Query() query: MediaQueryDto) {
    return this.mediaService.list(query.q, query.page, query.pageSize);
  }

  @Get(':id')
  @Permissions('media.manage')
  get(@Param('id') id: string) {
    return this.mediaService.get(id);
  }

  @Patch(':id')
  @Permissions('media.manage')
  update(@Param('id') id: string, @Body() dto: UpdateMediaDto) {
    return this.mediaService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('media.manage')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(id);
  }
}
