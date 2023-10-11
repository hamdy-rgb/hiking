import React, { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import { QueryClientProvider, QueryClient } from "react-query";

import App from "./App";
import store from "./store/app/app";
import theme from "./styles/theme";
import "./styles/normalize.css";
import "./styles/global.css";

const queryClient = new QueryClient();

const StyledApp = () => {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <StyledApp />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
