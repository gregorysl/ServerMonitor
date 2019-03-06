import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon, Layout } from "antd";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import Home from "./Home";
import Settings from "./CleanerSettings";
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
            <Route exact path="/" component={Home} />
            <Route
              path="/settings"
              render={() => <Settings settings={this.props.settings.data} save={this.props.setCleanerSettings} />}
            />
          </Content>
        </Layout>
      </Router>
    );
  }
}

const mapStateToProps = state => (
  {
    settings: state.settings
  });

const mapDispatchToProps = dispatch => ({
  getSettings: () => dispatch(actions.getSettings()),
  setCleanerSettings: (settings) => dispatch(actions.setCleanerSettings(settings))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
