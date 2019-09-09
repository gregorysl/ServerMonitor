import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Icon, Layout } from "antd";
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import Home from "./Home";
import Settings from "./Settings";
import * as actions from "./actions/actions";

const { Header, Content } = Layout;
const App = props => {
  const result = useSelector(state => state.settings);
  const dispatch = useDispatch();
  if (!result.loaded) {
    dispatch(actions.getSettings());
  }
  return (
    <Router>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Link className="text-colored" to="/">
            Home
          </Link>
          <Link className="settings" to="/settings">
            <Icon type="setting" />
          </Link>
        </Header>
        <Content style={{ padding: "0 50px" }}>
          <Switch>
            <Route exact path="/settings" component={Settings} />
            <Route component={Home} />
          </Switch>
        </Content>
      </Layout>
    </Router>
  );
};

export default App;
