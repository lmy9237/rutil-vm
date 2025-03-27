import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { AuthProvider } from "./context/AuthProvider"
import { GlobalProvider } from "./context/GlobalProvider";

if (typeof global === 'undefined') {
  window.global = window;
}
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
const queryClient = new QueryClient()

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <GlobalProvider>
          <AuthProvider>
            <Routes>
              <Route path="/*" element={<App />}/>
            </Routes>
          </AuthProvider>
        </GlobalProvider>
      </BrowserRouter>
    </QueryClientProvider>
  </React.StrictMode>
);
reportWebVitals();
