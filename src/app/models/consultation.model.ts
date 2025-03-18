
import { ConsultationStatus } from "./enums/enums";

export interface Consultation {
  code: string;
  description: string;
  data: Date;
  createdAt: Date;
  updatedAt: Date;
  userEmail: string;
  status: ConsultationStatus;
}
