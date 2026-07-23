import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiProperty, ApiPropertyOptional, ApiTags } from '@nestjs/swagger';
import { NavLocation } from '@prisma/client';
import { IsBoolean, IsEnum, IsInt, IsOptional, IsString, IsUUID, IsArray } from 'class-validator';
import { Permissions, Public } from '../auth/decorators/auth.decorators';
import { NavigationService } from './navigation.service';

class NavDto {
  @ApiProperty() @IsString() label!: string;
  @ApiProperty() @IsString() href!: string;
  @ApiProperty({ enum: NavLocation }) @IsEnum(NavLocation) location!: NavLocation;
  @ApiPropertyOptional() @IsOptional() @IsUUID() parentId?: string | null;
  @ApiPropertyOptional() @IsOptional() @IsInt() sortOrder?: number;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isVisible?: boolean;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() openInNewTab?: boolean;
}

class ReorderDto {
  @ApiProperty({ type: [String] }) @IsArray() @IsUUID('4', { each: true }) ids!: string[];
}

@ApiTags('Admin Navigation')
@ApiBearerAuth()
@Controller('admin/navigation')
export class NavigationController {
  constructor(private readonly service: NavigationService) {}

  @Get() @Permissions('navigation.manage')
  list(@Query('location') location?: NavLocation) { return this.service.list(location); }

  @Post() @Permissions('navigation.manage')
  create(@Body() dto: NavDto) { return this.service.create(dto); }

  @Patch(':id') @Permissions('navigation.manage')
  update(@Param('id') id: string, @Body() dto: Partial<NavDto>) { return this.service.update(id, dto); }

  @Delete(':id') @Permissions('navigation.manage')
  remove(@Param('id') id: string) { return this.service.remove(id); }

  @Post('reorder') @Permissions('navigation.manage') @ApiOperation({ summary: 'Reorder navigation items' })
  reorder(@Body() dto: ReorderDto) { return this.service.reorder(dto.ids); }
}

@ApiTags('Public Navigation')
@Controller('public/navigation')
export class PublicNavigationController {
  constructor(private readonly service: NavigationService) {}
  @Public() @Get()
  list(@Query('location') location?: NavLocation) { return this.service.list(location); }
}
