import React from "react";

import { Tag } from "antd";

const ApplicationStatus = props => (
    <Tag color={props.running ? "#87d068" : "#f50"}>
                  {props.text}
                </Tag>
  );
;

export default ApplicationStatus;
