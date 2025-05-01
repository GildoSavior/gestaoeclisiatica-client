
import { Enum_EventType, EventStatus } from './enums/enums';

export interface EventModel {

  id: number | null;
  code: string;
  name: string;
  userEmail: string;
  title: string;
  description: string;
  initialDate: string; // formato ISO, ex: '2025-04-05T19:00:00'
  finalDate: string;
  eventStatus: string; // ajuste conforme os valores reais do enum
  eventType: string;  // idem acima
  needContribution: boolean;
  imagesUrls: string[];
}
