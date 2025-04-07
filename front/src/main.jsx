import React from "react";
import { Routes, Route, HashRouter } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GlobalProvider } from "./context/GlobalProvider";
import { AuthProvider } from "./context/AuthProvider"
import { EventsProvider } from "./context/EventsProvider";
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
                <Routes>
                  <Route path="/*" element={<App />}/>
                </Routes>
              </UIStateProvider>
            {/* </EventsProvider> */}
          </AuthProvider>
        </GlobalProvider>
      </HashRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
reportWebVitals();
