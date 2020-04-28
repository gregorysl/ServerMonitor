import React from "react";
import { useDispatch } from "react-redux";
import dateformat from "dateformat";
import Tooltip from "@material-ui/core/Tooltip";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ReportIcon from "@material-ui/icons/Report";
import ReplayIcon from "@material-ui/icons/Replay";

import StartStopButton from "./StartStopButton";
import TooltipIcon from "../TooltipIcon";
import ApplicationStatus from "./ApplicationStatus";
import * as actions from "../../actions/actions";

const AppPoolList = props => {
  const dispatch = useDispatch();
  const toggle = data => dispatch(actions.setIisAction(data, props.url));
  const recycle = value => dispatch(actions.recycleApp(value, props.url));
  if (props.items.length === 0) {
    return <h1>No IIS applications found.</h1>;
  }
  const data = props.items.map(value => (
    <ListItem key={value.name} dense disableGutters>
      {value.name && value.pool && value.name !== value.pool && (
        <Tooltip title="Application pool has different name than IIS application. Check your configuration for errors">
          <ListItemIcon>
            <ReportIcon />
          </ListItemIcon>
        </Tooltip>
      )}
      <ListItemText primary={value.name} />
      <ListItemSecondaryAction>
        {value.running && (
          <TooltipIcon
            tooltip="Recycle"
            icon={<ReplayIcon />}
            click={() => {
              recycle(value.name);
            }}
          />
        )}
        <StartStopButton
          running={value.running}
          build={{ apps: [value] }}
          click={toggle}
        />
      </ListItemSecondaryAction>
    </ListItem>
  ));
  const since = dateformat(props.org.createdDateTime, " dd.mm.yyyy");
  return (
    <List>
      <ListItem dense button disableGutters>
        <ListItemText primary={`${since} (${props.org.daysOld} day(s) old)`} />
      </ListItem>
      {data}
    </List>
  );
};

export default AppPoolList;
