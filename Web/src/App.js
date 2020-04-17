import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";
import { Toolbar, Typography, AppBar } from "@material-ui/core/";
import { HashRouter as Router, Route, Link, Switch } from "react-router-dom";
import Home from "./Home";
import Settings from "./Settings";
import * as actions from "./actions/actions";
const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  }
}));
const App = props => {
  const classes = useStyles();
  const { errors, settings } = useSelector(state => state);
  const dispatch = useDispatch();
  //   useEffect(() => {
  //     errors.data.forEach(item => {
  //       if (item.type === "Success") {
  //         notification.success(item);
  //       } else {
  //         notification.error(item);
  //       }
  //     });
  //   }, [errors]);
  if (!settings.loaded) {
    dispatch(actions.getSettings());
  }
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link to="/">Server Monitor</Link>
          </Typography>
          <Link to="/settings">
            <SettingsIcon />
          </Link>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route exact path="/settings" component={Settings} />
        <Route component={Home} />
      </Switch>
    </Router>
  );
};

export default App;
