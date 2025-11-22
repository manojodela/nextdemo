'use client';
import { useEffect, useState } from 'react';

export default function ClientDisplay() {
  // NEXT_PUBLIC is inlined at build time and available here
  const publicEndpoint = process.env.NEXT_PUBLIC_SERVICE_ENDPOINT || 'no-next-public';

  // For server-only value: fetch runtime API
  const [serverEndpoint, setServerEndpoint] = useState(null);

  useEffect(() => {
    // make a runtime request to your API route that returns process.env.SERVICE_ENDPOINT
    fetch('/api/env')
      .then((r) => r.json())
      .then((j) => setServerEndpoint(j.SERVICE_ENDPOINT || 'no-server-value'))
      .catch(() => setServerEndpoint('error'));
  }, []);

  return (
    <div>
      <h3>Client component</h3>
      <p>NEXT_PUBLIC (inlined): {publicEndpoint}</p>
      <p>SERVICE_ENDPOINT (fetched at runtime): {serverEndpoint}</p>
    </div>
  );
}