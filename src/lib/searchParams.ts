import { SearchPostType } from "@/types/post";

export interface SearchOptions {
  query?: string;
  tags?: string[];
  tab?: SearchPostType;
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
  const tab = (params.get("tab") as SearchPostType) ?? "ALL";
  return { query, tags, tab };
}
