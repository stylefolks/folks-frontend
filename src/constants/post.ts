export const POST_TYPES = ["BASIC", "COLUMN"] as const;
export const SEARCH_POST_TYPES = ["ALL", ...POST_TYPES] as const;
