import React from "react";
import { Tooltip } from "antd";
import { WarningTwoTone } from "@ant-design/icons";

const WarningIcon = ({ text, show }) =>
  show && (
    <Tooltip title={text}>
      <WarningTwoTone className="icon-large" twoToneColor="red" />
    </Tooltip>
  );

export default WarningIcon;
