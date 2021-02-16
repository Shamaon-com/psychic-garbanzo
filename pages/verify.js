import React, { useContext } from "react";
import { AuthContext } from "../utils/functionsLib";
import { useFormFields } from '../utils/hooksLib';
import ContainerFull from "../components/containers/contaierFull"

export default function Verify() {

    // General variables
    const authContext = useContext(AuthContext);

    // Specific variables
    const [fields, setFields] = useFormFields({
        code: ""
    })



    async function handleSubmit(event) {
        event.preventDefault();
        if (validate()) {
            authContext.login(fields.email, fields.password);
        }
        else {
            alert("Porvafor rellene todos los campos.");
        };
    };

    const validate = () => {
        return true;
    }

    const renderForm = () => {

        return (

            <form className="mt-8 space-y-6" action="#" method="POST">
                <input type="hidden" name="remember" value="true" />
                <div className="rounded-md shadow-sm -space-y-px">
                    <div>
                        <label className="sr-only">
                            Email address
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="Email address"
                            onChange={setFields}
                        />
                    </div>
                    <div>
                        <label className="sr-only">
                            Codigo
                        
                        </label>
                        <input
                            id="code"
                            type="password"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                            placeholder="codigo"
                            onChange={setFields}
                        />
                    </div>
                </div>

                <div>
                    <button
                        type="submit"
                        className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm 
                        font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 
                        focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={handleSubmit}
                    >
                        <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                            <svg
                                className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20"
                                fill="currentColor"
                                aria-hidden="true"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </span>
              Sign in
            </button>
            </div>
            </form>
        );
    }

    return (
        <ContainerFull>
            <div className="w-full h-1/4 flex flex-row">
                <img
                    className="mx-auto h-full"
                    src="/img/Screen Capture_select-area_20201221163707.png"
                    alt="Workflow"
                />
            </div>
            <div className="w-full h-3/4 flex justify-center items-center
                      bg-center w-full bg-no-repeat sm:bg-hero-lg" >
                <div className="max-h-96 w-full max-w-sm bg-gray-100 px-5 py-5">
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Sign in
                    </h2>
                    {renderForm()}
                </div>
            </div>
        </ContainerFull>
    );
}