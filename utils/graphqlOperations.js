// Amplify
import { API, graphqlOperation } from 'aws-amplify';
import * as mutations from '../src/graphql/mutations';
import * as queries from '../src/graphql/queries';
import * as subscriptions from '../src/graphql/subscriptions';



export const graphqlGet = async (funcName, setter) => {

    API.graphql(graphqlOperation(queries[funcName])).then((data) => {
        console.log(data.data[funcName].items)
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

export const subscribeCreate = async (funcName, setter, arrayItem) => {
    


    API.graphql(graphqlOperation(subscriptions.onCreateAgenda)).subscribe({
        next: (subRecived) => {
            setter((arrayItem) => [
                ...arrayItem,
                subRecived.value.data[funcName]
            ]);
        }
    });

}