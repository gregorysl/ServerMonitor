import React, { useEffect } from "react";
import { useSnackbar } from "notistack";
import { useDispatch, useSelector } from "react-redux";
import { makeStyles } from "@material-ui/core/styles";
import SettingsIcon from "@material-ui/icons/Settings";
import { Toolbar, Typography, AppBar } from "@material-ui/core/";
import {
  HashRouter as Router,
  Route,
  Link as RouterLink,
  Switch
} from "react-router-dom";
import Home from "./Home";
import Settings from "./Settings";
import * as actions from "./actions/actions";
import Link from "@material-ui/core/Link";

const useStyles = makeStyles(theme => ({
  title: {
    flexGrow: 1
  }
}));

const options = {
  anchorOrigin: {
    vertical: "top",
    horizontal: "right"
  }
};
const App = props => {
  const classes = useStyles();
  const { errors, settings } = useSelector(state => state);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  useEffect(() => {
    errors.data.forEach(item => {
      options.variant = item.type.toLowerCase();
      enqueueSnackbar(item.description, options);
    });
  }, [errors, enqueueSnackbar]);
  if (!settings.loaded) {
    dispatch(actions.getSettings());
  }
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            <Link color="textPrimary" component={RouterLink} to="/">
              Server Monitor
            </Link>
          </Typography>
          <Link color="textPrimary" component={RouterLink} to="/settings">
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
