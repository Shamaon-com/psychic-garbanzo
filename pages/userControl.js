import AdminLayout from "../components/adminLayout";
import { userTable } from "./sampleData";
import React, { useState, useEffect } from "react";
import { useFormFields } from "../utils/hooksLib";

export default function userControl(props) {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const [fields, handleFieldChange] = useFormFields({
    email: "",
    name: "",
    group: "Usuario",
    number: "",
    password: ""
  });

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    try {
      setUsers(userTable.users);
    } catch (e) {
      if (e !== "No current user") {
        console.log(e);
      }
    }
  }

  const addUser = () => {
    console.log(fields)

    var user  = {
      'emailAddress': fields.email,
      'userName': fields.name,
      'userGroup': fields.group,
      'phoneNumber': fields.number,
      'password': fields.password
    }


    var userArray = users
    userArray.push(user)
    setUsers(userArray)

    setIsCreating(false)
  };

  const deleteUser = () => {
    if (index === null) {
      alert("Seleccione un usuario");
    }
    users.splice(index, 1);
    setIndex(null);
  };

  const uploadCSV = () => {

  }

  const deleteAll = () => {

  }

  const renderUserCell = () => {
    //console.log(users);
    return (
      <tbody>
        {users.map((user, key) => {
          return (
            <tr key={key}>
              <td class="border-dashed border-t border-gray-200 px-3">
                <label class="text-teal-500 inline-flex justify-between items-center hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    class="form-checkbox rowCheckbox focus:outline-none focus:shadow-outline"
                    onClick={(e) => {
                      setIndex(key);
                    }}
                  />
                </label>
              </td>
              <td class="border-dashed border-t border-gray-200 userId">
                <span class="text-gray-700 px-6 py-3 flex items-center">
                  {user.userName}
                </span>
              </td>
              <td class="border-dashed border-t border-gray-200 firstName">
                <span class="text-gray-700 px-6 py-3 flex items-center">
                  {user.emailAddress}
                </span>
              </td>
              <td class="border-dashed border-t border-gray-200 lastName">
                <span class="text-gray-700 px-6 py-3 flex items-center">
                  {user.phoneNumber}
                </span>
              </td>
              <td class="border-dashed border-t border-gray-200 emailAddress">
                <span class="text-gray-700 px-6 py-3 flex items-center">
                  {user.userGroup}
                </span>
              </td>
              <td class="border-dashed border-t border-gray-200 phoneNumber">
                <span class="text-gray-700 px-6 py-3 flex items-center">
                  {user.password}
                </span>
              </td>
            </tr>
          );
        })}
      </tbody>
    );
  };

  const renderKey = () => {
    //console.log(userTable.headings)
    const heading = [
       "Nombre",
      "Email",
      "Telefono",
      "Grupo",
      "Contraseña"
    ]
    return (
      <>
        {heading.map((item, key) => {
          return (
            <th class="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-2 text-gray-600 font-bold tracking-wider uppercase text-xs">
              {item}
            </th>
          );
        })}
      </>
    );
  };

  const renderForm = () => {
    return (
      <div
        class=" mx-auto container ounded-lg  transform 
                    transition-all sm:my-8"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-headline"
      >
        <div class="mx-auto container max-w-2xl md:w-3/4 shadow-md">
          <div class="flex bg-gray-100 p-4 border-t-2 bg-opacity-5 border-indigo-400 rounded-t">
            <div class="flex max-w-sm mx-auto md:w-full md:mx-0">
              <div class="inline-flex items-center space-x-4">
                <h1 class="text-gray-600">Crea un nuevo usuario</h1>
              </div>
            </div>
            <div class="flex ml-auto">
              <button class="ml-auto rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
               onClick={(e) => {
                setIsCreating(false);
              }}              >
                  <span class="sr-only">Close panel</span>
                  <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
              </button>
            </div>
          </div>
          <div class="bg-white">
            <div class="md:inline-flex  space-y-4 md:space-y-0  w-full p-4 text-gray-500 items-center">
              <h2 class="md:w-1/3 mx-auto max-w-sm">Personal info</h2>
              <div class="md:w-2/3 mx-auto max-w-sm space-y-5">
                <div>
                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="email"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={fields.email}
                      name="email"
                      id="email"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      onChange={handleFieldChange}
                    />
                  </div>
                </div>
                <div>
                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="group"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Grupo
                    </label>
                    <select
                      id="group"
                      name="group"
                      value={fields.group}
                      class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      onChange={handleFieldChange}
                    >
                      <option>Administrador</option>
                      <option>Ponente</option>
                      <option>Usuario</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            <hr />
            <div class="md:inline-flex  space-y-4 md:space-y-0  w-full p-4 text-gray-500 items-center">
              <h2 class="md:w-1/3 mx-auto max-w-sm">Personal info</h2>
              <div class="md:w-2/3 mx-auto max-w-sm space-y-5">
                <div>
                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="name"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Nombre completo
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={fields.name}
                      id="name"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      onChange={handleFieldChange}

                    />
                  </div>
                </div>
                <div>
                  <div class="col-span-6 sm:col-span-3">
                    <label
                      for="number"
                      class="block text-sm font-medium text-gray-700"
                    >
                      Numero de telefono
                    </label>
                    <input
                      type="text"
                      name="number"
                      value={fields.number}
                      id="number"
                      class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                      onChange={handleFieldChange}

                    />
                  </div>
                </div>
              </div>
            </div>

            <hr />
            <div class="md:inline-flex space-y-4 md:space-y-0 w-full p-4 text-gray-500 items-center">
              <h2 class="md:w-1/3 max-w-sm mx-auto">
                Establece una contraseña
              </h2>
              <div class="md:w-2/3 max-w-sm mx-auto">
                <div class="col-span-6 sm:col-span-3">
                  <label
                    for="last_name"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Contraseña
                  </label>
                  <input
                  value={fields.password}
                    type="password"
                    name="password"
                    id="password"
                    class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                    onChange={handleFieldChange}

                  />
                </div>
              </div>
            </div>
            <hr />
            <div class="md:inline-flex w-full p-8 text-gray-500 items-center">
              <div class=" text-center ml-auto">
                <button 
                class="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
                onClick={addUser}
                >
                  Crear
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      {isCreating ? (
        renderForm()
      ) : (
        <div class=" w-full space-y-8">
          <div class=" mb-4 flex justify-between items-center">

            <div class="flex pr-4 ml-auto">
              <button class="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">
                Subir CSV
              </button>
            </div>
            <div class="flex pr-4">
              <button
                class="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
                onClick={(e) => {
                  setIsCreating(true);
                }}
              >
                Añadir
              </button>
            </div>
            <div class="flex pr-4">
              <button
                class="h-10 px-5 m-2 text-indigo-100 transition-colors 
          duration-150 bg-red-700 rounded-lg focus:shadow-outline hover:bg-red-800"
                onClick={(e) => {
                  deleteUser();
                }}
              >
                Borrar
              </button>
            </div>
          </div>

          <div
            class="overflow-x-auto bg-white rounded-lg shadow overflow-y-auto relative"
            style={{ height: "85%" }}
          >
            <table class="border-collapse table-auto w-full whitespace-no-wrap bg-white table-striped relative">
              <thead>
                <tr class="text-left">
                  <th class="py-2 px-3 sticky top-0 border-b border-gray-200 bg-gray-100">
                    <label class="text-teal-500 inline-flex justify-between items-center hover:bg-gray-200 px-2 py-2 rounded-lg cursor-pointer">
                      <input
                        type="checkbox"
                        class="form-checkbox focus:outline-none focus:shadow-outline"
                      />
                    </label>
                  </th>
                  {renderKey()}
                </tr>
              </thead>
              {renderUserCell()}
            </table>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
