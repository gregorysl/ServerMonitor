import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Row, Col, Typography } from "antd";
import PageVisibility from "react-page-visibility";
import { getHardwareAction } from "../actions/actions";
import { AreaChart, Area, YAxis } from "recharts";

const { Text } = Typography;

const ResponsiveAreaChart = ({ data, dataKey, color }) => (
  <AreaChart
    height={40}
    width={60}
    data={data}
    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
  >
    <YAxis type="number" domain={[0, 100]} hide />
    <Area type="monotone" dataKey={dataKey} stroke={color} fill={color} />
  </AreaChart>
);
const Hardware = props => {
  const dispatch = useDispatch();
  useEffect(() => {
    const interval = setInterval(() => {
      dispatch(getHardwareAction(props.name, props.url));
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch, props.key, props.name, props.url]);
  const hardware = useSelector(state => state.hardware[props.name]);

  return !hardware ? null : (
    <Row style={{ marginLeft: "auto" }} type="flex" justify="start">
      <Col span={4} style={{ display: "flex", margin: 10, width: 120 }}>
        <ResponsiveAreaChart
          data={hardware.data}
          dataKey="CPU"
          color="#8884d8"
        />
        <Row style={{ marginLeft: 12 }}>
          <Text strong>CPU</Text>
          <br />
          <Text>{hardware.current[0].value}%</Text>
        </Row>
      </Col>
      <Col span={4} style={{ display: "flex", margin: 10, width: 120 }}>
        <ResponsiveAreaChart
          data={hardware.data}
          dataKey="RAM"
          color="#8884d8"
        />
        <Row style={{ marginLeft: 12 }}>
          <Text strong>RAM</Text>
          <br />
          <Text>{hardware.current[1].value}%</Text>
        </Row>
      </Col>
      <Col span={4} style={{ display: "flex", margin: 10, width: 120 }}>
        <ResponsiveAreaChart
          data={hardware.data}
          dataKey="HDD"
          color="#8884d8"
        />
        <Row style={{ marginLeft: 12 }}>
          <Text strong>HDD</Text>
          <br />
          <Text>{hardware.current[2].value}%</Text>
        </Row>
      </Col>
    </Row>
  );
};

export default Hardware;
