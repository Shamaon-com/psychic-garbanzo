// Amplify
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../src/graphql/mutations';
import * as queries from '../src/graphql/queries';




export const graphqlGet = async (funcName, setter) => {

    API.graphql(graphqlOperation(queries[funcName])).then((data) => {
        console.log(data)
        setter(data.data[funcName].items);
    });
}

export const graphqlCreate = async (funcName, itemData) => {
   
    API.graphql(
        graphqlOperation(mutations[funcName], { input: itemData })
    );
}

export const graphqlDelete = async (funcName, itemID) => {

    API.graphql(
        graphqlOperation(mutations[funcName], { input: {id: itemID} })
      );

}