import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Permissions } from '../auth/decorators/auth.decorators';
import { UsersService } from './users.service';

@ApiTags('Admin Users')
@ApiBearerAuth()
@Controller('admin')
export class UsersController {
  constructor(private readonly service: UsersService) {}

  @Get('users') @Permissions('users.manage') list() { return this.service.list(); }
  @Post('users') @Permissions('users.manage') create(@Body() dto: any) { return this.service.create(dto); }
  @Patch('users/:id') @Permissions('users.manage') update(@Param('id') id: string, @Body() dto: any) { return this.service.update(id, dto); }
  @Delete('users/:id') @Permissions('users.manage') remove(@Param('id') id: string) { return this.service.remove(id); }
  @Get('roles') @Permissions('users.manage') roles() { return this.service.listRoles(); }
}
