import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Result } from "antd";
import ServerLinks from "../Links/ServerLinks";
import Hardware from "../Hardware";
import IisSection from "./IisSection";
import { getHeartbeat } from "../../actions/actions";
const A = ({ name, url }) => {
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
      <Row type="flex" justify="start">
        <span className="app-title">{name}</span>
        {working && (
          <>
            <ServerLinks url={url} />
            <Hardware name={name} url={url} />
          </>
        )}
      </Row>
      {working && <IisSection name={name} url={url} />}
      {!working && <Result status="warning" title="Connection Error!" />}
    </div>
  );
};
const IisServicesList = props => {
  const data = props.settings.hardwareList.map(x => (
    <A key={x.name} name={x.name} url={x.url} />
  ));
  return (
    <Row>
      <h1 className="table-title">IIS Applications</h1>
      {data}
    </Row>
  );
};

export default IisServicesList;
