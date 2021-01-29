/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createAgenda = /* GraphQL */ `
  mutation CreateAgenda(
    $input: CreateAgendaInput!
    $condition: ModelAgendaConditionInput
  ) {
    createAgenda(input: $input, condition: $condition) {
      id
      title
      description
      date
      createdAt
      updatedAt
    }
  }
`;
export const updateAgenda = /* GraphQL */ `
  mutation UpdateAgenda(
    $input: UpdateAgendaInput!
    $condition: ModelAgendaConditionInput
  ) {
    updateAgenda(input: $input, condition: $condition) {
      id
      title
      description
      date
      createdAt
      updatedAt
    }
  }
`;
export const deleteAgenda = /* GraphQL */ `
  mutation DeleteAgenda(
    $input: DeleteAgendaInput!
    $condition: ModelAgendaConditionInput
  ) {
    deleteAgenda(input: $input, condition: $condition) {
      id
      title
      description
      date
      createdAt
      updatedAt
    }
  }
`;
export const createEvento = /* GraphQL */ `
  mutation CreateEvento(
    $input: CreateEventoInput!
    $condition: ModelEventoConditionInput
  ) {
    createEvento(input: $input, condition: $condition) {
      id
      type
      title
      startData
      endDate
      createdAt
      updatedAt
    }
  }
`;
export const updateEvento = /* GraphQL */ `
  mutation UpdateEvento(
    $input: UpdateEventoInput!
    $condition: ModelEventoConditionInput
  ) {
    updateEvento(input: $input, condition: $condition) {
      id
      type
      title
      startData
      endDate
      createdAt
      updatedAt
    }
  }
`;
export const deleteEvento = /* GraphQL */ `
  mutation DeleteEvento(
    $input: DeleteEventoInput!
    $condition: ModelEventoConditionInput
  ) {
    deleteEvento(input: $input, condition: $condition) {
      id
      type
      title
      startData
      endDate
      createdAt
      updatedAt
    }
  }
`;
export const createMessage = /* GraphQL */ `
  mutation CreateMessage(
    $input: CreateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    createMessage(input: $input, condition: $condition) {
      id
      user
      message
      createdAt
      updatedAt
    }
  }
`;
export const updateMessage = /* GraphQL */ `
  mutation UpdateMessage(
    $input: UpdateMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    updateMessage(input: $input, condition: $condition) {
      id
      user
      message
      createdAt
      updatedAt
    }
  }
`;
export const deleteMessage = /* GraphQL */ `
  mutation DeleteMessage(
    $input: DeleteMessageInput!
    $condition: ModelMessageConditionInput
  ) {
    deleteMessage(input: $input, condition: $condition) {
      id
      user
      message
      createdAt
      updatedAt
    }
  }
`;
export const createQuestion = /* GraphQL */ `
  mutation CreateQuestion(
    $input: CreateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    createQuestion(input: $input, condition: $condition) {
      id
      user
      question
      createdAt
      updatedAt
    }
  }
`;
export const updateQuestion = /* GraphQL */ `
  mutation UpdateQuestion(
    $input: UpdateQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    updateQuestion(input: $input, condition: $condition) {
      id
      user
      question
      createdAt
      updatedAt
    }
  }
`;
export const deleteQuestion = /* GraphQL */ `
  mutation DeleteQuestion(
    $input: DeleteQuestionInput!
    $condition: ModelQuestionConditionInput
  ) {
    deleteQuestion(input: $input, condition: $condition) {
      id
      user
      question
      createdAt
      updatedAt
    }
  }
`;
export const createIframe = /* GraphQL */ `
  mutation CreateIframe(
    $input: CreateIframeInput!
    $condition: ModelIframeConditionInput
  ) {
    createIframe(input: $input, condition: $condition) {
      id
      url
      title
      createdAt
      updatedAt
    }
  }
`;
export const updateIframe = /* GraphQL */ `
  mutation UpdateIframe(
    $input: UpdateIframeInput!
    $condition: ModelIframeConditionInput
  ) {
    updateIframe(input: $input, condition: $condition) {
      id
      url
      title
      createdAt
      updatedAt
    }
  }
`;
export const deleteIframe = /* GraphQL */ `
  mutation DeleteIframe(
    $input: DeleteIframeInput!
    $condition: ModelIframeConditionInput
  ) {
    deleteIframe(input: $input, condition: $condition) {
      id
      url
      title
      createdAt
      updatedAt
    }
  }
`;
export const createGeneralSettings = /* GraphQL */ `
  mutation CreateGeneralSettings(
    $input: CreateGeneralSettingsInput!
    $condition: ModelGeneralSettingsConditionInput
  ) {
    createGeneralSettings(input: $input, condition: $condition) {
      id
      login
      indexPage
      createdAt
      updatedAt
    }
  }
`;
export const updateGeneralSettings = /* GraphQL */ `
  mutation UpdateGeneralSettings(
    $input: UpdateGeneralSettingsInput!
    $condition: ModelGeneralSettingsConditionInput
  ) {
    updateGeneralSettings(input: $input, condition: $condition) {
      id
      login
      indexPage
      createdAt
      updatedAt
    }
  }
`;
export const deleteGeneralSettings = /* GraphQL */ `
  mutation DeleteGeneralSettings(
    $input: DeleteGeneralSettingsInput!
    $condition: ModelGeneralSettingsConditionInput
  ) {
    deleteGeneralSettings(input: $input, condition: $condition) {
      id
      login
      indexPage
      createdAt
      updatedAt
    }
  }
`;
export const createPonente = /* GraphQL */ `
  mutation CreatePonente(
    $input: CreatePonenteInput!
    $condition: ModelPonenteConditionInput
  ) {
    createPonente(input: $input, condition: $condition) {
      id
      name
      title
      image
      pdf
      url
      createdAt
      updatedAt
    }
  }
`;
export const updatePonente = /* GraphQL */ `
  mutation UpdatePonente(
    $input: UpdatePonenteInput!
    $condition: ModelPonenteConditionInput
  ) {
    updatePonente(input: $input, condition: $condition) {
      id
      name
      title
      image
      pdf
      url
      createdAt
      updatedAt
    }
  }
`;
export const deletePonente = /* GraphQL */ `
  mutation DeletePonente(
    $input: DeletePonenteInput!
    $condition: ModelPonenteConditionInput
  ) {
    deletePonente(input: $input, condition: $condition) {
      id
      name
      title
      image
      pdf
      url
      createdAt
      updatedAt
    }
  }
`;
export const createPatrocinador = /* GraphQL */ `
  mutation CreatePatrocinador(
    $input: CreatePatrocinadorInput!
    $condition: ModelPatrocinadorConditionInput
  ) {
    createPatrocinador(input: $input, condition: $condition) {
      id
      name
      link
      file
      createdAt
      updatedAt
    }
  }
`;
export const updatePatrocinador = /* GraphQL */ `
  mutation UpdatePatrocinador(
    $input: UpdatePatrocinadorInput!
    $condition: ModelPatrocinadorConditionInput
  ) {
    updatePatrocinador(input: $input, condition: $condition) {
      id
      name
      link
      file
      createdAt
      updatedAt
    }
  }
`;
export const deletePatrocinador = /* GraphQL */ `
  mutation DeletePatrocinador(
    $input: DeletePatrocinadorInput!
    $condition: ModelPatrocinadorConditionInput
  ) {
    deletePatrocinador(input: $input, condition: $condition) {
      id
      name
      link
      file
      createdAt
      updatedAt
    }
  }
`;
export const createRecurso = /* GraphQL */ `
  mutation CreateRecurso(
    $input: CreateRecursoInput!
    $condition: ModelRecursoConditionInput
  ) {
    createRecurso(input: $input, condition: $condition) {
      id
      type
      name
      text
      file
      videoUrl
      createdAt
      updatedAt
    }
  }
`;
export const updateRecurso = /* GraphQL */ `
  mutation UpdateRecurso(
    $input: UpdateRecursoInput!
    $condition: ModelRecursoConditionInput
  ) {
    updateRecurso(input: $input, condition: $condition) {
      id
      type
      name
      text
      file
      videoUrl
      createdAt
      updatedAt
    }
  }
`;
export const deleteRecurso = /* GraphQL */ `
  mutation DeleteRecurso(
    $input: DeleteRecursoInput!
    $condition: ModelRecursoConditionInput
  ) {
    deleteRecurso(input: $input, condition: $condition) {
      id
      type
      name
      text
      file
      videoUrl
      createdAt
      updatedAt
    }
  }
`;
