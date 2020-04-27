import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../actions/actions";
import AppCard from "./AppCard";
import Grid from "@material-ui/core/Grid";
import ErrorCard from "../ErrorCard";

const IisSection = props => {
  const iisData = useSelector(state => {
    const key = state.table.keys.indexOf(props.url);
    if (key === -1) return [];
    else return state.table.data[key];
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.getIisAction(props.url));
  }, [dispatch, props.url]);
  const click = data => dispatch(actions.setIisAction(data, props.url));
  const displayData = iisData.map(x => (
    <Grid item key={x.name}>
      <AppCard x={x} click={click} url={props.url} />
    </Grid>
  ));
  return iisData.length === 0 ? (
    <ErrorCard title="No data!" />
  ) : (
    <Grid container spacing={2}>
      {displayData}
    </Grid>
  );
};

export default IisSection;
