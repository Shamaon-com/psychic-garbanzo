import React, { useState, useEffect, useContext } from "react";
import { API, graphqlOperation } from "aws-amplify";

import AdminLayout from "../../layouts/adminLayout";
import {ContainerFull} from "../../components/containers";
import Modal from "../../components/modal";

import { AuthContext } from "../../utils/functionsLib";
import { useModalFields } from "../../utils/hooksLib";

import * as mutations from "../../config/graphql/mutations";
import * as queries from "../../config/graphql/queries";
import * as subscriptions from "../../config/graphql/subscriptions";



export default function platformControl(props) {
  


  return (
    <AdminLayout>
      <div class="container mx-auto px-4 max-w-5xl">
        <div class="flex flex-wrap flex-col h-full w-full">
          <div class="inputs w-full max-w-7xl p-6 mx-auto">
            <h2 class="text-2xl text-gray-900">Account Setting</h2>
            <form class="mt-6 border-t border-gray-400 pt-4">
              

            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
