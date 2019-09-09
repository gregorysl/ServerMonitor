import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Layout } from "antd";
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import Home from "./Home";
import Settings from "./Settings";
import * as actions from "./actions/actions";

const { Header, Content } = Layout;

class App extends Component {
  componentDidMount() {
    this.props.getSettings();
  }
  render() {
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
              <Route
                exact
                path="/settings"
                render={() => (
                  <Settings
                    settings={this.props.settings}
                    save={this.props.setSettings}
                  />
                )}
              />
              <Route component={Home} />
            </Switch>
          </Content>
        </Layout>
      </Router>
    );
  }
}

const mapStateToProps = state => ({
  settings: state.settings
});

const mapDispatchToProps = dispatch => ({
  getSettings: () => dispatch(actions.getSettings()),
  setSettings: settings => dispatch(actions.setSettings(settings))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
