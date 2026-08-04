import type { User } from "./order";

export interface Session {
  userId: string;
  user: User;
}
