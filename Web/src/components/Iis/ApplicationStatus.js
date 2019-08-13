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
      {props.name && props.pool && (props.name !== props.pool) && (
        <Tooltip title='Application pool has different name than IIS application. Check your configuration for errors'>
          <Icon className='icon-large' type='warning' />
        </Tooltip>
      )}
    </>
  );
};
export default ApplicationStatus;
