import UnauthorizedPage from "@/components/UnauthorizedPage/UnauthorizedPage";
import Head from "next/head";
import React from "react";

const Unauthorized = () => {
  return (
     <>
         <Head>
             <title>Unauthorized Access • Xaqsoor</title>
             <meta
                 name="description"
                 content="Access denied. You do not have permission to view this page on the Xaqsoor platform."
             />
         </Head>
         <UnauthorizedPage/>
     </>
  )
}
export default Unauthorized;