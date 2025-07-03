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
    birthDay?: string;
    email?: string;
    password?: string;
    address?: string;
    yearOfConversation?: number;
    createdAt?: Date;
    updatedAt?: Date;
    phoneNumber?:number;
    accessLevel?: AccessLevel;
    maritalStatus?: MaritalStatus;
    disciplinaryStatus?: DisciplinaryStatus;
    departmentCode?: string;
    positionCode?: string;
    imageUrl?: string;
    enabled?: boolean;

  }
  