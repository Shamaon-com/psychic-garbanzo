/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createEvent = /* GraphQL */ `
  mutation CreateEvent(
    $input: CreateEventInput!
    $condition: ModelEventConditionInput
  ) {
    createEvent(input: $input, condition: $condition) {
      id
      title
      description
      date
      createdAt
      updatedAt
    }
  }
`;
export const updateEvent = /* GraphQL */ `
  mutation UpdateEvent(
    $input: UpdateEventInput!
    $condition: ModelEventConditionInput
  ) {
    updateEvent(input: $input, condition: $condition) {
      id
      title
      description
      date
      createdAt
      updatedAt
    }
  }
`;
export const deleteEvent = /* GraphQL */ `
  mutation DeleteEvent(
    $input: DeleteEventInput!
    $condition: ModelEventConditionInput
  ) {
    deleteEvent(input: $input, condition: $condition) {
      id
      title
      description
      date
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
