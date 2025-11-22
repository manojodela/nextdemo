// export const dynamic = 'force-dynamic';

// 'use client';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserForm from './components/UserForm';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto">
        {/* <p className="text-sm text-gray-500">{process.env.NEXT_PUBLIC_SERVICE_ENDPOINT || 'Static SERVICE_ENDPOINT not set in browser env'}</p>
        <p className="text-sm text-gray-500">{process.env.SERVICE_ENDPOINT || 'Dynamic SERVICE_ENDPOINT not set in browser env'}</p> */}
        <UserForm />
      </div>
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
      />
    </div>
  ); 
}


// // app/page.js  (server component)
// import ClientDisplay from './components/ClientDisplay';
// export const dynamic = 'force-dynamic';

// export default function Page() {
//   const publicEndpoint = process.env.NEXT_PUBLIC_SERVICE_ENDPOINT || 'no-next-public';
//   const serverEndpoint = process.env.SERVICE_ENDPOINT || 'no-server-env';
//   return (
//     <div>
//       <h2>Server rendered values</h2>
//       <p>NEXT_PUBLIC: {publicEndpoint}</p>
//       <p>SERVICE_ENDPOINT (server): {serverEndpoint}</p>

//       {/* Client child will show public inlined var and optionally fetch the server value */}
//       <ClientDisplay />
//     </div>
//   );
// }