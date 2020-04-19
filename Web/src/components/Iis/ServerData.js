import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ServerLinks from "../Links/ServerLinks";
import Hardware from "../Hardware";
import IisSection from "./IisSection";
import { getHeartbeat } from "../../actions/actions";
import ErrorCard from "../ErrorCard";
const ServerData = ({ name, url }) => {
  const heartbeat = useSelector(state => state.heartbeat[name]);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!heartbeat || (!heartbeat.loaded && !heartbeat.loading)) {
      dispatch(getHeartbeat(name, url));
    }
  }, [dispatch, heartbeat, name, url]);

  const working = heartbeat && heartbeat.working;
  return (
    <div style={{ marginBottom: 5 }}>
      <span className="app-title">{name}</span>
      {working && (
        <>
          <ServerLinks url={url} />
          <Hardware name={name} url={url} />
          <IisSection name={name} url={url} />
        </>
      )}
      {!working && <ErrorCard title="Connection Error!" />}
    </div>
  );
};
export default ServerData;
