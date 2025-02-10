import { LineContrib } from "./line-contrib.model";
import { EventModel } from "./event.model";
import { ContribStatus } from "./enums/enums";

export interface CabecContrib {
  id: string;
  description: string;
  total: number;
  dateTime: Date;
  createdAt: Date;
  updatedAt: Date;
  lineContrib: LineContrib;
  event: EventModel | null;
  cabecStatus: ContribStatus;
}
