import { LineContrib } from "./line-contrib.model";
import { EventModel } from "./event.model";
import { ContribStatus } from "./enums/enums";


export interface CabecContrib {
  id: number;
  title: string;
  type: string; // Ajuste os valores conforme o enum ContribType
  description: string;
  total: number;
  totalApproved: number;
  createdAt: string; // ISO 8601 format (ex: '2025-05-24T12:34:56')
  updatedAt: string;
  event_id: number;
  eventCode: string;
  cabecStatus: string;
}
