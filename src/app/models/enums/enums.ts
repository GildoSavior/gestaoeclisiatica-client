// enums.ts

// === Nível de Acesso (AccessLevel) ===
export enum AccessLevel {
    ROLE_SUPER_ADMIN = 'Super',
    ROLE_ADMIN = 'Administrador',
    ROLE_PASTOR = 'Pastor',
    ROLE_FIEL = 'Fiel'
}

// === Estado Civil (MaritalStatus) ===
export enum MaritalStatus {
    CASADO = 'Casado',
    SOLTEIRO = 'Solteiro',
    VIUVO = 'Viúvo',
    DIVORCIADO = 'Divorciado'
}

// === Estado da Consulta (ConsultationStatus) ===
export enum ConsultationStatus {
    PENDENTE = 'Pendente',
    REJEITADA = 'Rejeitada',
    APROVADA = 'Aprovada',
    REALIZADA = 'Realizada'
}

// === Estado da Contribuição (ContribStatus) ===
export enum ContribStatus {
    PENDENTE = 'Pendente',
    APROVADO = 'Aprovado',
    REJEITADA = 'Rejeitada'
}

// === Tipo de Contribuição (ContribType) ===
export enum ContribType {
    CASAMENTO = 'Casamento',
    FUNERAL = 'Funeral',
    EXCURSAO = 'Excursão',
    DIZIMO = 'Dízimo',
    OFERTA = 'Oferta',
    CONSTRUCAO = 'Contribuição para construção',
    EVENTO = 'Contribuição para eventos',
    MISSAO = 'Missões e evangelismo',
    AGRADECIMENTO = 'Oferta de agradecimento',
    OUTRO = 'Outro'
}

// === Situação Disciplinar (DisciplinaryStatus) ===
export enum DisciplinaryStatus {
    DISCIPLINADO = 'Disciplinado',
    INDISCIPLINADO = 'Indisciplinado'
}

// === Estado do Evento (EventStatus) ===
export enum EventStatus {
    PENDENTE = 'Pendente',
    APROVADO = 'Aprovado',
    REJEITADO = 'Rejeitado'
}

// === Tipo de Evento (EnumEventType) ===
export enum EnumEventType {
    CASAMENTO = 'Casamento',
    HOBBY = 'Lazer',
    PEDIDO = 'Pedido de Casamento',
    FUNERAL = 'Funeral',
    BATISMO = 'Batismo',
    CULTO = 'Culto',
    CONGRESSO = 'Congresso',
    RETIRO = 'Retiro Espiritual',
    VIGILIA = 'Vigília',
    SANTA_CEIA = 'Santa Ceia',
    FORMATURA = 'Formatura',
    ANIVERSARIO_IGREJA = 'Aniversário da Igreja',
    ANIVERSARIO_MEMBRO = 'Aniversário de Membro',
    OUTRO = 'Outro'
}
