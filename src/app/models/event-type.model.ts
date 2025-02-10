import { EventModel } from "./event.model";

export interface EventTypeModel {
  code: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  events: EventModel[];
}
