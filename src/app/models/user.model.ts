import { Consultation } from "./consultation.model";
import { Contact } from "./contact.model";
import { Department } from "./departament.model";
import { AccessLevel, DisciplinaryStatus, MaritalStatus } from "./enums/enums";
import { LineContrib } from "./line-contrib.model";
import { Position } from "./position.model";

export interface User {
    id: string;
    name?: string;
    lastName?: string;
    birthDay?: Date;
    email?: string;
    password?: string;
    address?: string;
    yearOfConversion?: number;
    createdAt?: Date;
    updatedAt?: Date;
    phoneNumber?:number;
    accessLevel?: AccessLevel;
    maritalStatus?: MaritalStatus;
    disciplinaryStatus?: DisciplinaryStatus;
    department?: Department;
    position?: Position;
    contactsList?: Contact[];
    imageUrl?: string;
    events?: Event[];
    consultations?: Consultation[];
    lineContribs?: LineContrib[];
  }
  