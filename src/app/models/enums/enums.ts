export enum AccessLevel {
  ROLE_SUPER_ADMIN = "ROLE_SUPER_ADMIN",
  ROLE_ADMIN = "ROLE_ADMIN",
  ROLE_DEPARTMENT = "ROLE_DEPARTMENT",
  ROLE_USER = "ROLE_USER"
}
  
export enum MaritalStatus {
    SINGLE = "Solteiro",
    MARRIED = "Casado",
    DIVORCED = "Divorciado",
    WIDOWED = "Viuvo"
}

export enum ConsultationStatus {
  PENDING ="Pendente",
    REJECTED = "Rejeitado",
    APPROVED = "Aprovado"
}

export enum ContribStatus {
  PENDING = "Pendente",
  APPROVED = "Aprovado" ,
  REJECTED = "Anulado",
  PROCESSED = "Processado"
}

export enum DisciplinaryStatus {
  DISCIPLINED = "Disciplinado" ,
  UNDISCIPLINED = "Indisciplinado"
}


export enum EventStatus {
  PENDING = "PENDENTE",
  APPROVED = "APROVADO", 
  REJECTED = "ANULADO",
  PROCESSED = "PROCESSADO"
}

export enum Enum_EventType {
  WEDDING = "CASAMENTO",
  PROPOSAL = "PEDIDO", 
  FUNERAL = "FUNERAL",
}