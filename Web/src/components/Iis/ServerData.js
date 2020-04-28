import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ServerLinks from "../Links/ServerLinks";
import Hardware from "../Hardware";
import IisSection from "./IisSection";
import { getHeartbeat } from "../../actions/actions";
import ErrorCard from "../ErrorCard";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  root: {
    paddingBottom: 0
  }
}));
const ServerData = ({ name, url }) => {
  const classes = useStyles();
  const heartbeat = useSelector(state => state.heartbeat[name]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!heartbeat || (!heartbeat.loaded && !heartbeat.loading)) {
      dispatch(getHeartbeat(name, url));
    }
  }, [dispatch, heartbeat, name, url]);

  const working = heartbeat && heartbeat.working;
  return !working ? (
    <ErrorCard title={`${name} connection Error!`} />
  ) : (
    <Card>
      <CardHeader
        className={classes.root}
        title={name}
        subheader={<ServerLinks url={url} />}
        action={<Hardware name={name} url={url} />}
      />
      <CardContent>
        <IisSection name={name} url={url} />
      </CardContent>
    </Card>
  );
};
export default ServerData;
