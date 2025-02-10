import { User } from "./user.model";

export interface Position {
  code: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  usersList: User[];
}
