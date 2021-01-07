/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getEvent = /* GraphQL */ `
  query GetEvent($id: ID!) {
    getEvent(id: $id) {
      id
      title
      description
      date
      createdAt
      updatedAt
    }
  }
`;
export const listEvents = /* GraphQL */ `
  query ListEvents(
    $filter: ModelEventFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listEvents(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
export const getIframe = /* GraphQL */ `
  query GetIframe($id: ID!) {
    getIframe(id: $id) {
      id
      url
      title
      createdAt
      updatedAt
    }
  }
`;
export const listIframes = /* GraphQL */ `
  query ListIframes(
    $filter: ModelIframeFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listIframes(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        url
        title
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
      indexPage
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
        indexPage
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
      file
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
        file
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
export const getArticulo = /* GraphQL */ `
  query GetArticulo($id: ID!) {
    getArticulo(id: $id) {
      id
      name
      date
      text
      file
      createdAt
      updatedAt
    }
  }
`;
export const listArticulos = /* GraphQL */ `
  query ListArticulos(
    $filter: ModelArticuloFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listArticulos(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
        id
        name
        date
        text
        file
        createdAt
        updatedAt
      }
      nextToken
    }
  }
`;
