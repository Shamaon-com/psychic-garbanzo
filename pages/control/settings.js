import AdminLayout from '../../layouts/adminLayout';
import ContainerPage from '../../components/containers';
import React, { useContext, useEffect } from 'react';

import { AuthContext } from '../../utils/functionsLib';

export default function platformControl(props) {
  const authContext = useContext(AuthContext);

  useEffect(() => {
    console.log('uig')
  }, []);



  const buildInitalSettings = () => {



  }

  /**
   *   
    login: Boolean!
    mainLogo: String!
    backgroundLoginImage: String!
    backgroundColor: String!
    boxBackgroundColor: String!
    boxBorderColor: String!
    boxInnerTextColor: String!
    boxTitleColor: String!
    titleColor: String!
    textColor: String!
    pageAgenda: Boolean!
    pagePonentes: Boolean!
    pagePatrocinadores: Boolean!
    pagePrensa: Boolean! 
    pageContacto: Boolean!
  */


  const renderMain = () => {
    return (
      <div>
        <div className="py-5 border-b">
          <p className="text-xl mb-3">Diseño general</p>
          <p className="text-gray-500 font-extralight">
            Cambia el diseño del evento
          </p>
        </div>
        <div className="flex flex-row mb-3 py-3 border-b">
          <p className="text-gray-600">Nombre</p>
          <p className="mx-auto font-light">
            Esta informacion esta relacionada con tu perfil
          </p>
          <p className="text-blue-600">Cambiar</p>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <ContainerPage>
        <div className="flex items-center text-3xl " style={{ height: "10%" }}>
          Settings
        </div>
        <div
          className="bg-white rounded-lg shadow py-10 px-20"
          style={{ height: "90%" }}
        >
          {renderMain()}
        </div>
      </ContainerPage>
    </AdminLayout>
  );
}
