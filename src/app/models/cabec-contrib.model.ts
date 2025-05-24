import { LineContrib } from "./line-contrib.model";
import { EventModel } from "./event.model";
import { ContribStatus } from "./enums/enums";


export interface CabecContrib {
  id: number | null;
  title: string | null;
  type: string | null; // Ajuste os valores conforme o enum ContribType
  description: string | null;
  total: number | 0;
  totalApproved: number | 0;
  createdAt: string | null; // ISO 8601 format (ex: '2025-05-24T12:34:56')
  updatedAt: string | null ;
  event_id: number | null;
  eventCode: string | null;
  cabecStatus: string | null; // Ajuste os valores conforme o enum ContribStatus
}
