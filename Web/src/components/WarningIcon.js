import React from "react";
import { Icon, Tooltip } from "antd";

const WarningIcon = ({ text, show }) =>
  show && (
    <Tooltip title={text}>
      <Icon
        className="icon-large"
        type="warning"
        theme="twoTone"
        twoToneColor="red"
      />
    </Tooltip>
  );

export default WarningIcon;
