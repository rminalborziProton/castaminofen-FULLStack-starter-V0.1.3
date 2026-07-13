import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { SearchService } from './search.service';
import { SearchQueryDto } from './dto/search-query.dto';

@ApiTags('Search')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  search(@Query() query: SearchQueryDto, @Req() req: Request & { user?: { id?: string } }) {
    return this.searchService.search(query.q ?? '', {
      type: query.type,
      categoryId: query.categoryId,
      channelId: query.channelId,
      page: query.page,
      limit: query.limit,
      userId: req.user?.id,
    });
  }

  @Get('autocomplete')
  autocomplete(@Query('q') query: string, @Req() req: Request & { user?: { id?: string } }) {
    return this.searchService.autocomplete(query ?? '', req.user?.id);
  }

  @Get('suggestions')
  suggestions(@Query('q') query: string, @Req() req: Request & { user?: { id?: string } }) {
    return this.searchService.getSuggestions(query ?? '', req.user?.id);
  }

  @Get('recent')
  recent(@Req() req: Request & { user?: { id?: string } }) {
    return this.searchService.getRecentSearches(req.user?.id);
  }

  @Get('analytics')
  analytics(@Query('days') days?: string) {
    const parsed = Number(days ?? '30');
    return this.searchService.getAnalytics(Number.isNaN(parsed) ? 30 : parsed);
  }
}
