import React from "react";

import { Tag, Icon, Tooltip } from "antd";

const ApplicationStatus = props => {
  const color = props.state === "Stopped" ? "red" : "gold";
  return (
    props.state !== "Running" && (
      <Tag width={100} color={color}>
        {props.state}
      </Tag>
    )
  );
};
export default ApplicationStatus;
