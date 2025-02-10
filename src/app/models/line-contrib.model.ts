import { CabecContrib } from "./cabec-contrib.model";
import { User } from "./user.model";
import { ContribStatus } from "./enums/enums";

export interface LineContrib {
  id: string;
  cabecContrib: CabecContrib;
  user: User;
  dateTime: Date;
  createdAt: Date;
  updatedAt: Date;
  total: number;
  contribStatus: ContribStatus;
  image: string;
}
