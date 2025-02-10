import { User } from "./user.model";
import { ConsultationStatus } from "./enums/enums";

export interface Consultation {
  code: string;
  description: string;
  data: Date;
  createdAt: Date;
  updatedAt: Date;
  user: User;
  status: ConsultationStatus;
}
