import type { User } from "./order";

export interface Session {
  userId: string;
  user: User;
}

export interface AuthProvider {
  signIn(): Promise<{ userId: string }>;
  signOut(): Promise<void>;
}
