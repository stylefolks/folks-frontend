import { http, HttpResponse } from 'msw';
import { brands, brandPosts } from '@/lib/brands';

export const handlers = [
  http.get('/brands', ({ request }) => {
    const url = new URL(request.url);
    const tag = url.searchParams.get('tag');
    const hasUpcomingEvent = url.searchParams.get('hasUpcomingEvent');

    let result = brands;
    if (hasUpcomingEvent) {
      result = result.filter((b) => b.upcomingEvent);
    }
    if (tag) {
      result = result.filter((b) => b.tags.includes(tag));
    }
    return HttpResponse.json(result);
  }),
  http.get('/posts', ({ request }) => {
    const url = new URL(request.url);
    const authorType = url.searchParams.get('authorType');
    const limit = parseInt(url.searchParams.get('limit') || '6', 10);

    if (authorType === 'BRAND') {
      return HttpResponse.json(brandPosts.slice(0, limit));
    }

    return HttpResponse.json([]);
  }),
];
