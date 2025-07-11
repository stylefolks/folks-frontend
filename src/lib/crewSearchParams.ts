export interface CrewSearchOptions {
  keyword?: string;
  tag?: string | null;
}

export function buildCrewSearchParams({
  keyword,
  tag,
}: CrewSearchOptions): URLSearchParams {
  const params = new URLSearchParams();
  if (tag) {
    params.set("tag", tag);
  } else if (keyword) {
    params.set("keyword", keyword);
  }
  return params;
}

export function parseCrewSearchParams(
  search: string | URLSearchParams
): CrewSearchOptions {
  const params =
    typeof search === "string" ? new URLSearchParams(search) : search;
  const keyword = params.get("keyword") ?? undefined;
  const tag = params.get("tag");
  return { keyword: keyword, tag: tag };
}
