import React from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from "./context/AuthProvider"
import { GlobalProvider } from "./context/GlobalProvider";
import { FooterStateProvider } from "./context/FooterStateProvider";
import { BoxStateProvider } from './context/BoxStateProvider'
import { TMIStateProvider } from "./context/TMIStateProvider";
import { UIStateProvider } from "./context/UIStateProvider";
import reportWebVitals from "./reportWebVitals";
import App from "./App";

if (typeof global === 'undefined') {
  window.global = window;
}
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
const queryClient = new QueryClient()

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <GlobalProvider>
          <AuthProvider>
            {/* <EventsProvider> */}
            <UIStateProvider>
              <FooterStateProvider>
                <BoxStateProvider>
                  <TMIStateProvider>
                    <Routes>
                      <Route path="/*" element={<App />}/>
                    </Routes>
                  </TMIStateProvider>
                </BoxStateProvider>
              </FooterStateProvider>
            </UIStateProvider>
            {/* </EventsProvider> */}
          </AuthProvider>
        </GlobalProvider>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
reportWebVitals();
