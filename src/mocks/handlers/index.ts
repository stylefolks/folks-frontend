import { userHandlers } from "./user";
import { crewHandlers } from "./crew";
import { brandHandlers } from "./brand";
import { postHandlers } from "./post";
import { tagHandlers } from "./tag";

export const handlers = [
  ...userHandlers,
  ...crewHandlers,
  ...brandHandlers,
  ...postHandlers,
  ...tagHandlers,
];
