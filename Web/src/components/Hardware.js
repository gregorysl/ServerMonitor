import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { usePageVisibility } from "react-page-visibility";
import { getHardwareAction } from "../actions/actions";
import { AreaChart, Area, YAxis } from "recharts";
import { makeStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ErrorCard from "./ErrorCard";

const useStyles = makeStyles(theme => ({
  root: { padding: 0, paddingRight: 5 }
}));

const ResponsiveAreaChart = ({ data, dataKey, color }) => (
  <AreaChart
    height={40}
    width={60}
    data={data}
    margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
  >
    <YAxis type="number" domain={[0, 100]} hide />
    <Area
      type="natural"
      dataKey={dataKey}
      stroke="none"
      fill={color}
      dot={false}
    />
  </AreaChart>
);
const Hardware = props => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const isVisible = usePageVisibility();
  useEffect(() => {
    const interval = setInterval(() => {
      isVisible && dispatch(getHardwareAction(props.name, props.url));
    }, 5000);
    return () => clearInterval(interval);
  }, [dispatch, isVisible, props.name, props.url]);

  const hardware = useSelector(state => {
    let namedHardware = state.hardware[props.name];
    if (!namedHardware) {
      namedHardware = { data: [], current: [] };
    }
    return namedHardware;
  });

  const data2 = hardware.current.map(x => (
    <Grid item key={x.key}>
      <Card>
        <CardHeader
          className={classes.root}
          title={x.key}
          subheader={x.value + "%"}
          avatar={
            <ResponsiveAreaChart
              data={hardware.data}
              dataKey={x.key}
              color="#8884d8"
            />
          }
        />
      </Card>
    </Grid>
  ));
  return !hardware || !hardware.data ? (
    <ErrorCard title="Connection Error!" />
  ) : (
    <Grid container spacing={1}>
      {data2}
    </Grid>
  );
};

export default Hardware;
