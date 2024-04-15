import React from 'react';
import ReactDOM from 'react-dom/client';

import { QueryClient } from '@tanstack/react-query';

import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';

import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import App from './App.tsx';

const queryClient = new QueryClient();

const persister = createSyncStoragePersister({
  storage: window.localStorage,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister }}>
      <App />
      <ReactQueryDevtools />
    </PersistQueryClientProvider>
  </React.StrictMode>,
);
