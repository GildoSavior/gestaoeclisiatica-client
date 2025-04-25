
import { ConsultationStatus } from "./enums/enums";

export interface Consultation {
  code: string;
  description: string;
  data: string;
  createdAt: Date;
  updatedAt: Date;
  userEmail: string;
  status: ConsultationStatus;
}
