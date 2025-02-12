
import { Enum_EventType, EventStatus } from './enums/enums';
import { User } from './user.model';

export interface EventModel {
  code: string;
  eventType: Enum_EventType | null;
  user?: User | null;
  title: string;
  description: string;
  initialDate: Date;
  finalDate: Date;
  createdAt: Date;
  updatedAt: Date;
  eventStatus: EventStatus | null;
  needContribution: boolean;
  images: string[];
}
