
import { Enum_EventType, EventStatus } from './enums/enums';

export interface EventModel {

  id: number | null;
  code: string;
  userEmail: string;
  title: string;
  description: string;
  initialDate: string; // formato ISO, ex: '2025-04-05T19:00:00'
  finalDate: string;
  eventStatus:  EventStatus | null; // ajuste conforme os valores reais do enum
  eventType: Enum_EventType | null;  // idem acima
  needContribution: boolean;
  imagesUrls: string[];
}
