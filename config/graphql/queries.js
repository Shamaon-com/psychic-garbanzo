/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getUser = /* GraphQL */ `
  query GetUser($id: ID!) {
    getUser(id: $id) {
      id
      username
      email
      banned
      disabled
      createdAt
      updatedAt
    }
  }
`;
export const listUsers = /* GraphQL */ `
  query ListUsers(
    $filter: ModelUserFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listUsers(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        username
        email
        banned
        disabled
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getAgenda = /* GraphQL */ `
  query GetAgenda($id: ID!) {
    getAgenda(id: $id) {
      id
      title
      description
      date
      createdAt
      updatedAt
    }
  }
`;
export const listAgendas = /* GraphQL */ `
  query ListAgendas(
    $filter: ModelAgendaFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listAgendas(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        title
        description
        date
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getEvento = /* GraphQL */ `
  query GetEvento($id: ID!) {
    getEvento(id: $id) {
      id
      url
      title
      startDate
      endDate
      chat
      questions
      allowed
      image
      createdAt
      updatedAt
    }
  }
`;
export const listEventos = /* GraphQL */ `
  query ListEventos(
    $filter: ModelEventoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEventos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        url
        title
        startDate
        endDate
        chat
        questions
        allowed
        image
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getMessage = /* GraphQL */ `
  query GetMessage($id: ID!) {
    getMessage(id: $id) {
      id
      user
      message
      createdAt
      updatedAt
    }
  }
`;
export const listMessages = /* GraphQL */ `
  query ListMessages(
    $filter: ModelMessageFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listMessages(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        user
        message
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getQuestion = /* GraphQL */ `
  query GetQuestion($id: ID!) {
    getQuestion(id: $id) {
      id
      user
      question
      createdAt
      updatedAt
    }
  }
`;
export const listQuestions = /* GraphQL */ `
  query ListQuestions(
    $filter: ModelQuestionFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listQuestions(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        user
        question
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getGeneralSettings = /* GraphQL */ `
  query GetGeneralSettings($id: ID!) {
    getGeneralSettings(id: $id) {
      id
      login
      mainLogo
      backgroundLoginImage
      backgroundColor
      boxBackgroundColor
      boxBorderColor
      boxInnerTextColor
      boxTitleColor
      titleColor
      textColor
      pageAgenda
      pagePonentes
      pagePatrocinadores
      pageRecursos
      pageContacto
      createdAt
      updatedAt
    }
  }
`;
export const listGeneralSettingss = /* GraphQL */ `
  query ListGeneralSettingss(
    $filter: ModelGeneralSettingsFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listGeneralSettingss(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
    ) {
      items {
        id
        login
        mainLogo
        backgroundLoginImage
        backgroundColor
        boxBackgroundColor
        boxBorderColor
        boxInnerTextColor
        boxTitleColor
        titleColor
        textColor
        pageAgenda
        pagePonentes
        pagePatrocinadores
        pageRecursos
        pageContacto
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPonente = /* GraphQL */ `
  query GetPonente($id: ID!) {
    getPonente(id: $id) {
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
export const listPonentes = /* GraphQL */ `
  query ListPonentes(
    $filter: ModelPonenteFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPonentes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        title
        image
        pdf
        url
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getPatrocinador = /* GraphQL */ `
  query GetPatrocinador($id: ID!) {
    getPatrocinador(id: $id) {
      id
      name
      link
      file
      createdAt
      updatedAt
    }
  }
`;
export const listPatrocinadors = /* GraphQL */ `
  query ListPatrocinadors(
    $filter: ModelPatrocinadorFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listPatrocinadors(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        link
        file
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
export const getRecurso = /* GraphQL */ `
  query GetRecurso($id: ID!) {
    getRecurso(id: $id) {
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
export const listRecursos = /* GraphQL */ `
  query ListRecursos(
    $filter: ModelRecursoFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listRecursos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        type
        name
        text
        file
        videoUrl
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
