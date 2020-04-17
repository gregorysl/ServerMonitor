import React from "react";
import PropTypes from "prop-types";
import { ExclamationCircleFilled } from "@ant-design/icons";

const DataTableErrorMessage = ({ title }) => (
  <React.Fragment>
    <ExclamationCircleFilled style={{ color: "red" }} />
    <h3>{title}</h3>
  </React.Fragment>
);

DataTableErrorMessage.propTypes = {
  title: PropTypes.string.isRequired
};

export default DataTableErrorMessage;
