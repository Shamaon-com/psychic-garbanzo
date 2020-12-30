import { AuthContext } from "../utils/functionsLib";
import { useRouter } from 'next/router';
import GeneralLayout from "../components/generalLayout";
import React, { useState, useEffect, useContext} from "react";


export default function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const authContext = useContext(AuthContext);
  const router = useRouter();

  
  useEffect(() => {
    if(!authContext.isLoggedIn){
      console.log("not logged in");
      router.push('/login')
    }
    else{
      console.log(authContext.userData);
      //router.push('/userControl');
    }
    setIsLoading(false);
  }, []);

  return (
    <>
    {
      isLoading ? (
        <div>
          Loading
        </div>
        
      ) : (
        <GeneralLayout />
      )
    }
    </>
  )
}
