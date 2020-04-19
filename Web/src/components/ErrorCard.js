import React from "react";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import ErrorOutlineIcon from "@material-ui/icons/ErrorOutline";
const ErrorCard = ({ title }) => {
  return (
    <Card>
      <CardHeader avatar={<ErrorOutlineIcon />} title={title} />
    </Card>
  );
};
export default ErrorCard;
