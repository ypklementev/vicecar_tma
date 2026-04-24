import {StrictMode} from 'react'
import { createRoot } from 'react-dom/client'
import App from './app/App.tsx'
import {AppProvider} from "@/app/context/AppContext.tsx";
import {QueryClientProvider, QueryClient} from "@tanstack/react-query";


const queryClient = new QueryClient();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <App />
      </AppProvider>
    </QueryClientProvider>
  </StrictMode>,
)
