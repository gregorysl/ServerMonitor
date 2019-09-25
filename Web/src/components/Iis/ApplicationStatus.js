import React from "react";

import { Tag } from "antd";

const ApplicationStatus = ({ state }) =>
  state !== "Running" && (
    <Tag width={100} color={state === "Stopped" ? "red" : "gold"}>
      {state}
    </Tag>
  );

export default ApplicationStatus;
