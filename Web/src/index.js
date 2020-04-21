import "antd/dist/antd.less";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import App from "./App";
import store from "./store";
import "./styles/style.sass";

const Item = (
  <SnackbarProvider>
    <Provider store={store}>
      <App />
    </Provider>
  </SnackbarProvider>
);
ReactDOM.render(Item, document.getElementById("root"));
