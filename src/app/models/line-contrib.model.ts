import { CabecContrib } from "./cabec-contrib.model";
import { User } from "./user.model";
import { ContribStatus } from "./enums/enums";

export interface LineContrib {
  id: number | null;
  cabec_id: number | null;
  cabecCode: string | null;
  cabecTitle:string | null;
  userEmail: string | null;
  description: string | null;
  createdAt: string | null;
  updatedAt: string | null;
  total: number | null;
  contribStatus: string | null;
  image: string | null;
}
