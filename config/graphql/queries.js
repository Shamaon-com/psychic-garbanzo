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
