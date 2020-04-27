import React from "react";
import Chip from "@material-ui/core/Chip";

const ApplicationStatus = ({ state, small }) =>
  state !== "Running" && (
    <Chip
      size={small ? "small" : "medium"}
      color="primary"
      className={state === "Stopped" ? "red" : "gold"}
      label={state}
    />
  );

export default ApplicationStatus;
