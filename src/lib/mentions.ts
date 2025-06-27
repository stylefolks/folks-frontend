//TODO: crewId와 brandId를 prosemirror 컨텐츠안에서 멘션으로 어떻게 구분할지 고민 필요
export const extractFromDoc = (
  doc: any,
  types: Array<"brand" | "crew" | "hashtag">
): { brandIds?: number[]; crewIds?: number[]; hashtags?: string[] } => {
  const brandIds: number[] = [];
  const crewIds: number[] = [];
  const hashtags: string[] = [];

  const traverse = (node: any) => {
    if (types.includes("brand") && node.type === "brand") {
      const id = parseInt(node.attrs.id, 10);
      if (!isNaN(id)) brandIds.push(id);
    }
    if (
      types.includes("crew") &&
      node.type === "mention" &&
      node.attrs?.type === "crew"
    ) {
      const id = parseInt(node.attrs.id, 10);
      if (!isNaN(id)) crewIds.push(id);
    }
    if (types.includes("hashtag") && node.type === "hashtag") {
      if (node.text) hashtags.push(node.text);
    }
    if (node.content) node.content.forEach(traverse);
  };

  traverse(doc);

  const result: {
    brandIds?: number[];
    crewIds?: number[];
    hashtags?: string[];
  } = {};
  if (types.includes("brand")) result.brandIds = brandIds;
  if (types.includes("crew")) result.crewIds = crewIds;
  if (types.includes("hashtag")) result.hashtags = hashtags;
  return result;
};
