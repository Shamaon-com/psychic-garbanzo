/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateAgenda = /* GraphQL */ `
  subscription OnCreateAgenda {
    onCreateAgenda {
      id
      title
      description
      date
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateAgenda = /* GraphQL */ `
  subscription OnUpdateAgenda {
    onUpdateAgenda {
      id
      title
      description
      date
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteAgenda = /* GraphQL */ `
  subscription OnDeleteAgenda {
    onDeleteAgenda {
      id
      title
      description
      date
      createdAt
      updatedAt
    }
  }
`;
export const onCreateEvento = /* GraphQL */ `
  subscription OnCreateEvento {
    onCreateEvento {
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
export const onUpdateEvento = /* GraphQL */ `
  subscription OnUpdateEvento {
    onUpdateEvento {
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
export const onDeleteEvento = /* GraphQL */ `
  subscription OnDeleteEvento {
    onDeleteEvento {
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
export const onCreateMessage = /* GraphQL */ `
  subscription OnCreateMessage {
    onCreateMessage {
      id
      user
      message
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateMessage = /* GraphQL */ `
  subscription OnUpdateMessage {
    onUpdateMessage {
      id
      user
      message
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteMessage = /* GraphQL */ `
  subscription OnDeleteMessage {
    onDeleteMessage {
      id
      user
      message
      createdAt
      updatedAt
    }
  }
`;
export const onCreateGeneralSettings = /* GraphQL */ `
  subscription OnCreateGeneralSettings {
    onCreateGeneralSettings {
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
export const onUpdateGeneralSettings = /* GraphQL */ `
  subscription OnUpdateGeneralSettings {
    onUpdateGeneralSettings {
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
export const onDeleteGeneralSettings = /* GraphQL */ `
  subscription OnDeleteGeneralSettings {
    onDeleteGeneralSettings {
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
export const onCreatePonente = /* GraphQL */ `
  subscription OnCreatePonente {
    onCreatePonente {
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
export const onUpdatePonente = /* GraphQL */ `
  subscription OnUpdatePonente {
    onUpdatePonente {
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
export const onDeletePonente = /* GraphQL */ `
  subscription OnDeletePonente {
    onDeletePonente {
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
export const onCreatePatrocinador = /* GraphQL */ `
  subscription OnCreatePatrocinador {
    onCreatePatrocinador {
      id
      name
      link
      file
      createdAt
      updatedAt
    }
  }
`;
export const onUpdatePatrocinador = /* GraphQL */ `
  subscription OnUpdatePatrocinador {
    onUpdatePatrocinador {
      id
      name
      link
      file
      createdAt
      updatedAt
    }
  }
`;
export const onDeletePatrocinador = /* GraphQL */ `
  subscription OnDeletePatrocinador {
    onDeletePatrocinador {
      id
      name
      link
      file
      createdAt
      updatedAt
    }
  }
`;
export const onCreateRecurso = /* GraphQL */ `
  subscription OnCreateRecurso {
    onCreateRecurso {
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
export const onUpdateRecurso = /* GraphQL */ `
  subscription OnUpdateRecurso {
    onUpdateRecurso {
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
export const onDeleteRecurso = /* GraphQL */ `
  subscription OnDeleteRecurso {
    onDeleteRecurso {
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
export const onCreateUser = /* GraphQL */ `
  subscription OnCreateUser($username: String) {
    onCreateUser(username: $username) {
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
export const onUpdateUser = /* GraphQL */ `
  subscription OnUpdateUser($username: String) {
    onUpdateUser(username: $username) {
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
export const onDeleteUser = /* GraphQL */ `
  subscription OnDeleteUser($username: String) {
    onDeleteUser(username: $username) {
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
export const onCreateQuestion = /* GraphQL */ `
  subscription OnCreateQuestion {
    onCreateQuestion {
      id
      user
      question
      createdAt
      updatedAt
    }
  }
`;
export const onUpdateQuestion = /* GraphQL */ `
  subscription OnUpdateQuestion {
    onUpdateQuestion {
      id
      user
      question
      createdAt
      updatedAt
    }
  }
`;
export const onDeleteQuestion = /* GraphQL */ `
  subscription OnDeleteQuestion {
    onDeleteQuestion {
      id
      user
      question
      createdAt
      updatedAt
    }
  }
`;
