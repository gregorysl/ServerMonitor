import React, { Component } from "react";
import { Icon, Layout } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./Home";
import Settings from "./Settings";

const { Header, Content } = Layout;

class App extends Component {
  render() {
    return (
      <Router>
        <Layout className="layout">
          <Header>
            <div className="logo" />

            <Link className="text-colored" to="/">Home</Link>

            <Link className='settings' to="/settings">
              <Icon type="setting" />
            </Link>
          </Header>
          <Content style={{ padding: "0 50px" }}>
            <Route exact path="/" component={Home} />
            <Route path="/settings" component={Settings} />
          </Content>
        </Layout>
      </Router>
    );
  }
}

export default App;
