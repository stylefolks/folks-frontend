import { http, HttpResponse } from "msw";

const hotTags = [
  { name: "비건카페", postCount: 32 },
  { name: "90s", postCount: 12 },
  { name: "한남", postCount: 7 },
];

export const tagHandlers = [
  http.get("/tags/hot", () => {
    return HttpResponse.json(hotTags);
  }),
];
