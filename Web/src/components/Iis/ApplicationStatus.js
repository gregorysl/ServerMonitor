import React from "react";
import WarningIcon from "@material-ui/icons/Warning";
import Chip from "@material-ui/core/Chip";

const ApplicationStatus = ({ state, small }) =>
  state !== "Running" && (
    <Chip
      size={small ? "small" : "medium"}
      color="primary"
      className={state === "Stopped" ? "red" : "gold"}
      icon={<WarningIcon />}
      label={state}
    />
  );

export default ApplicationStatus;
