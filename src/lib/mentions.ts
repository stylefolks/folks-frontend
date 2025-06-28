//TODO: crewId와 brandId를 prosemirror 컨텐츠안에서 멘션으로 어떻게 구분할지 고민 필요
// @mention은 crew 전용으로 진행하고 추후 브랜드 멘션은 별도로 구현하기로
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
      const tag = node.attrs?.tag || node.text;
      if (tag) hashtags.push(tag);
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

export const extractMentionsFromDoc = (
  doc: any
): {
  crewIds: number[];
  userIds: number[];
} => {
  const crewIds: number[] = [];
  const userIds: number[] = [];

  const traverse = (node: any) => {
    if (node.type === "mention") {
      const id = parseInt(node.attrs.id, 10);
      if (node.attrs.type === "crew") {
        if (!isNaN(id) && !crewIds.includes(id)) crewIds.push(id);
      } else if (node.attrs.type === "user") {
        if (!isNaN(id) && !userIds.includes(id)) userIds.push(id);
      }
    }
    if (node.content) node.content.forEach(traverse);
  };

  traverse(doc);
  return { crewIds, userIds };
};
