import { LineContrib } from "./line-contrib.model";
import { Event } from "./event.model";
import { ContribStatus } from "./enums/enums";

export interface CabecContrib {
  id: string;
  description: string;
  total: number;
  dateTime: Date;
  createdAt: Date;
  updatedAt: Date;
  lineContrib: LineContrib;
  event: Event | null;
  cabecStatus: ContribStatus;
}
