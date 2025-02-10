import { User } from "./user.model";

export interface Department {
  code: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  usersList: User[];
}
