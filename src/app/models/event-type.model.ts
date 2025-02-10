import { Event } from "./event.model";

export interface EventType {
  code: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  events: Event[];
}
