import { EventType } from './event-type.model';
import { User } from './user.model';

export interface Event {
  code: string;
  eventType: EventType;
  user: User;
  title: string;
  description: string;
  initialDate: string;
  finalDate: string;
  createdAt: string;
  updatedAt: string;
  eventStatus: string;
  needContribution: boolean;
  images: any[];
}
