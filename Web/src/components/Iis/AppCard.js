import React, { useState } from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Collapse from "@material-ui/core/Collapse";
import IconButton from "@material-ui/core/IconButton";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import EditIcon from "@material-ui/icons/Edit";
import { makeStyles } from "@material-ui/core/styles";

import AppPoolList from "./AppPoolList";
import NoteControl from "./NoteControl";
import WhitelistButton from "./WhitelistButton";
import AppName from "./AppName";
import StartStopButton from "./StartStopButton";
import Divider from "@material-ui/core/Divider";
import ApplicationStatus from "./ApplicationStatus";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles(theme => ({
  root: {
    width: 350
  },
  title: {
    paddingLeft: 5
  },
  header: {
    paddingBottom: 0
  },
  actions: {
    paddingTop: 0
  },
  expandPanel: {
    paddingTop: 0,
    paddingBottom: 0
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: "rotate(180deg)"
  }
}));

const AppCard = ({ x, click, url }) => {
  const [expanded, setExpanded] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const classes = useStyles();

  const location = url.split("/").splice(0, 3).join("/");
  return (
    <Card elevation={3} className={classes.root}>
      <CardHeader
        className={classes.header}
        title={
          <Grid container spacing={1}>
            <Grid item>
              <AppName location={location} name={x.name} running={x.running} />
            </Grid>
            <Grid item>
              <ApplicationStatus state={x.state} className={classes.title} />
            </Grid>
          </Grid>
        }
        subheader={
          <NoteControl
            build={x}
            url={url}
            isEdit={isEdit}
            setIsEdit={setIsEdit}
          />
        }
      />
      <CardActions disableSpacing className={classes.actions}>
        <StartStopButton build={x} click={click} running={x.running} />
        <WhitelistButton build={x} click={click} whitelisted={x.whitelisted} />
        <IconButton
          disabled={isEdit}
          aria-label="share"
          color="primary"
          onClick={() => setIsEdit(!isEdit)}
        >
          <EditIcon />
        </IconButton>
        <IconButton
          className={
            classes.expand + " " + (expanded ? classes.expandOpen : "")
          }
          onClick={() => setExpanded(!expanded)}
          aria-expanded={expanded}
        >
          <ExpandMoreIcon />
        </IconButton>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent className={classes.expandPanel}>
          <Divider />
          <AppPoolList org={x} url={url} items={x.apps} />
        </CardContent>
      </Collapse>
    </Card>
  );
};
export default AppCard;
