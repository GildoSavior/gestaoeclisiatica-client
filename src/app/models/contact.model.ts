import { User } from "./user.model";

export interface Contact {
  id: string;
  user: User;
  contact: string;
  createdAt: Date;
  updatedAt: Date;
}
