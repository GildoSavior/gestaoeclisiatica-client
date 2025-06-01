
import { ConsultationStatus } from "./enums/enums";

export interface Consultation {
  id: number;
  code: string;
  title: string;
  description: string;
  date: string;
  createdAt: Date;
  updatedAt: Date;
  userEmail: string;
  status: string;
}
