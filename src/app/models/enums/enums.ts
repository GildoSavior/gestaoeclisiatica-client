export enum AccessLevel {
    ADMIN = "ADMIN",
    USER = "USER",
    MODERATOR = "MODERATOR"
}
  
export enum MaritalStatus {
    SINGLE = "SINGLE",
    MARRIED = "MARRIED",
    DIVORCED = "DIVORCED",
    WIDOWED = "WIDOWED"
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