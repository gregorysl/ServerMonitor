import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row } from "antd";
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

  if (!heartbeat) return null;
  const shouldLoad = heartbeat.working;
  return (
    <div style={{ marginBottom: 5 }}>
      <Row type="flex" justify="start">
        <Row>
          <Row>
            <span className="app-title">{name}</span>
          </Row>
          <Row>{shouldLoad && <ServerLinks url={url} />}</Row>
        </Row>
        {shouldLoad && <Hardware name={name} url={url} />}
      </Row>
      <Row>{shouldLoad && <IisSection name={name} url={url} />}</Row>
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
