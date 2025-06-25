export function extractMentionsFromDoc(doc: any): {
  crewIds: number[];
  userIds: number[];
} {
  const crewIds = new Set<number>();
  const userIds = new Set<number>();

  const traverse = (node: any) => {
    if (node.type === 'mention') {
      const { id, type } = node.attrs || {};
      if (type === 'crew') crewIds.add(Number(id));
      if (type === 'user') userIds.add(Number(id));
    }
    if (node.content) node.content.forEach(traverse);
  };

  traverse(doc);
  return {
    crewIds: Array.from(crewIds),
    userIds: Array.from(userIds),
  };
}
