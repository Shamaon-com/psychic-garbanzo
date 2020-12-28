import AdminLayout from "../components/adminLayout";
import React, { useState, useEffect, useContext } from "react";
import { useFormFields } from "../utils/hooksLib";
import { AuthContext } from "../utils/functionsLib";
import { Auth, API } from "aws-amplify";

/**
TODO

- Delete user
- Search for user
- Bulk update
- Bulk delete



*/
export default function userControl(props) {
  const [users, setUsers] = useState([]);
  const [index, setIndex] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchByGroup, setSearchByGroup] = useState("Usuario")
  const authContext = useContext(AuthContext);
  let nextToken;

  const [fields, handleFieldChange] = useFormFields({
    email: "",
    name: "",
    group: "Usuario",
    number: "",
    password: "",
  });

  useEffect(() => {
    onLoad();
  }, []);

  async function onLoad() {
    console.log(authContext);
    console.log(authContext.isLoggedIn);

    if(!authContext.isLoggedIn){
      console.log("Not auth")
    }
    try {
      await listUsers(searchByGroup);
    } catch (e) {
      if (e !== "No current user") {
        console.log(e);
      }
    }
  }

  async function listUsers(groupParam) {

    console.log(groupParam)
    console.log(searchByGroup);

    let group;

    if (groupParam === "Ponente") {
      group = "ponente";
    }

    if (groupParam === "Administrador") {
      group = "admins";
    }

    if (groupParam === "Usuario") {
      group = "users";
    }

    let apiName = "AdminQueries";
    let path = "/listUsersInGroup";
    let myInit = {
      queryStringParameters: {
        groupname: group    ,
        limit: 10,
        token: nextToken,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    };
    const { NextToken, ...rest } = await API.get(apiName, path, myInit);
    nextToken = NextToken;
    setUsers(rest.Users);

  }

  async function addUser() {
    console.log(fields);

    try {
      const { user } = await Auth.signUp({
        username: fields.email,
        password: fields.password,
        attributes: {
          name: fields.name, // optional
          phone_number: "+34" + fields.number, // optional - E.164 number convention
          // other custom attributes
        },
      });

      confirmUserSignUp();
      addToGroup();
      console.log(user);
      setIsCreating(false);
    } catch (e) {
      console.log(e);
    }
  }

  async function confirmUserSignUp() {
    let apiName = "AdminQueries";
    let path = "/confirmUserSignUp";
    let myInit = {
      body: {
        username: fields.email,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    };
    return await API.post(apiName, path, myInit);
  }

  async function addToGroup() {
    let group;
    if (fields.group === "Ponente") {
      group = "ponente";
    }

    if (fields.group === "Administrador") {
      group = "admins";
    }

    if (fields.group === "Usuario") {
      group = "users";
    }

    let apiName = "AdminQueries";
    let path = "/addUserToGroup";
    let myInit = {
      body: {
        username: fields.email,
        groupname: group,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `${(await Auth.currentSession())
          .getAccessToken()
          .getJwtToken()}`,
      },
    };
    return await API.post(apiName, path, myInit);
  }

  const deleteUser = () => {
    if (index === null) {
      alert("Seleccione un usuario");
    }
    users.splice(index, 1);
    setIndex(null);
  };

  const uploadCSV = () => {};

  const deleteAll = () => {};




  const renderUserCell = () => {
    console.log(users);
    const keys = ["sub", "phone_number_verified", "email_verified"];

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
              {user.Attributes.map((attribute, key) => {
                if (!keys.includes(attribute.Name)) {
                  return (
                    <td class="border-dashed border-t border-gray-200">
                      <span class="text-gray-700 px-6 py-3 flex items-center">
                        {attribute.Value}
                      </span>
                    </td>
                  );
                }
              })}
            </tr>
          );
        })}
      </tbody>
    );
  };

  const renderKey = () => {
    //console.log(userTable.headings)
    const keys = ["sub", "phone_number_verified", "email_verified"];
    if (users[0] !== undefined) {
      return (
        <>
          {users[0].Attributes.map((item, key) => {
            if (!keys.includes(item.Name)) {
              return (
                <th class="bg-gray-100 sticky top-0 border-b border-gray-200 px-6 py-2 text-gray-600 font-bold tracking-wider uppercase text-xs">
                  {item.Name}
                </th>
              );
            }
          })}
        </>
      );
    }
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
              <button
                class="ml-auto rounded-md text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-white"
                onClick={(e) => {
                  setIsCreating(false);
                }}
              >
                <span class="sr-only">Close panel</span>
                <svg
                  class="h-6 w-6"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
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

/** 
  <div class="flex pr-4 ml-auto">
  <button class="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800">
    Subir CSV
  </button>
</div>
*/

  return (
    <AdminLayout>
      {isCreating ? (
        renderForm()
      ) : (
        <div class=" w-full space-y-8">
          <div class=" mb-4 flex justify-between items-center">
          <div class="flex pr-4">
          <input
              type="text"
              name="number"
              value={fields.number}
              id="number"
              class="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              onChange={handleFieldChange}
            />
            </div>
            <div class="flex pr-4 mr-auto">
              <select
                id="group"
                name="group"
                value={searchByGroup}
                class="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                onChange={(e) => {
                  setSearchByGroup(e.target.value);
                  listUsers(e.target.value);
                }}
              >
                <option>Administrador</option>
                <option>Ponente</option>
                <option>Usuario</option>
              </select>
          </div>
            <div class="flex pr-4 ml-auto">
              <button
                class="h-10 px-5 m-2 text-indigo-100 transition-colors duration-150 bg-indigo-700 rounded-lg focus:shadow-outline hover:bg-indigo-800"
                onClick={(e) => {
                  setIsCreating(true);
                }}
              >
                +
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
                -
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
