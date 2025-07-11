import { SearchPostType } from "@/types/post";

// DTO 스타일로 json 키를 모두 따옴표로 감싸고 camelCase 유지
export interface SearchOptions {
  query?: string;
  tags?: string[];
  tab?: string;
}

export function buildSearchParams({
  query,
  tags,
  tab,
}: SearchOptions): URLSearchParams {
  const params = new URLSearchParams();
  if (query) params.set("query", query);
  if (tags && tags.length) params.set("tag", tags.join(","));
  if (tab && tab !== "ALL") params.set("tab", tab);
  return params;
}

export function parseSearchParams(
  search: string | URLSearchParams
): SearchOptions {
  const params =
    typeof search === "string" ? new URLSearchParams(search) : search;
  const query = params.get("query") ?? undefined;
  const tag = params.get("tag");
  const tags = tag ? tag.split(",").filter(Boolean) : [];
  const tab = params.get("tab") ?? "ALL";
  return { query: query, tags: tags, tab: tab };
}
