import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import App from "./App";
import store from "./store";
import "./styles/style.sass";

import { createMuiTheme, ThemeProvider } from "@material-ui/core/styles";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#40a9ff"
    },
    secondary: {
      main: "#0EC3A2"
    }
  }
});

const Item = (
  <ThemeProvider theme={theme}>
    <SnackbarProvider>
      <Provider store={store}>
        <App />
      </Provider>
    </SnackbarProvider>
  </ThemeProvider>
);
ReactDOM.render(Item, document.getElementById("root"));
