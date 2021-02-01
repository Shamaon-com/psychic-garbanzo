import AdminLayout from '../../layouts/adminLayout';
import ContainerPage from '../../components/containers';
import React, { useContext, useEffect } from 'react';

import { setDictValue } from '../../utils/hooksLib'
import { AuthContext } from '../../utils/functionsLib';

export default function PlatformControl(props) {

  const authContext = useContext(AuthContext);

  
  const [ dict, setDict ] = setDictValue({
    login: '',
    mainLogo: '',
    backgroundLoginImage: '',
    backgroundColor: '', 
    boxBackgroundColor: '',
    boxBorderColor: '',
    boxInnerTextColor: '',
    boxTitleColor: '',
    titleColor: '',
    textColor: '',
    pageAgenda: '',
    pagePonentes: '',
    pagePatrocinadores: '',
    pagePrensa: '', 
    pageContacto: ''
  });


  useEffect(() => {
    
    //set value from loaded general settings into local dict
    authContext.generalSettings.map((value, index) => {
      console.log(value);
    });

  }, []);


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
          <p className="text-gray-600 w-1/5">Login</p>
          <p className="mr-auto font-light w-3/5">
            Selecciona el tipo de autetificacion que quieres usar
          </p>
          <select
              className="py-2 px-3 border border-gray-300 w-2/5
                         bg-white rounded-md shadow-sm focus:outline-none 
                         focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option>Con registro</option>
              <option>Sin registro</option>
            </select>
        </div>
        <div className="flex flex-row mb-3 py-3 border-b">
          <p className="text-gray-600 w-1/5">Nombre</p>
          <p className="mr-auto font-light w-3/5">
            Logo principal de la pagina
          </p>
          <input
            className='w-2/5'
            id='mainLogo'
            accept="png"
            type="file"
          />
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
