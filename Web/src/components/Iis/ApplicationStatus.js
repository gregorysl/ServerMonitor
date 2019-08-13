import React from "react";

import { Tag, Icon, Tooltip } from "antd";

const ApplicationStatus = props => {
  const color =
    props.state === "Running"
      ? "green"
      : props.state === "Stopped"
      ? "red"
      : "gold";
  return (
    <>
      <Tag color={color}>{props.state}</Tag>
      {props.cleanerMark && (
        <Tooltip title='This build matches criteria to be cleaned on next run'>
          <Icon className='icon-large' type='warning' />
        </Tooltip>
      )}
    </>
  );
};
export default ApplicationStatus;
