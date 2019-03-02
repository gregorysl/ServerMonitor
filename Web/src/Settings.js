import React, { useEffect  } from "react";
import { connect } from "react-redux";
import * as actions from "./actions/actions";

const Settings = (props) => {
  useEffect(() => {
    props.getSettings();
  }, []);
  return (
    <div style={{ background: "#fff", padding: 5, height: "100%" }}>
      <h1>Settings</h1>
      <p>{JSON.stringify(props.settings.data)}</p>
    </div>
  );
};

const mapStateToProps = state => ({
  settings: state.settings
});

const mapDispatchToProps = dispatch => ({
  getSettings: () => dispatch(actions.getSettings())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Settings);
