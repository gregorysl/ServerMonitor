import React, { useState, useEffect } from "react";
import { checkLink } from "../api/api_new";
import { CircularProgress, Tooltip, Chip } from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  success: { backgroundColor: theme.palette.secondary.main },
  error: { backgroundColor: theme.palette.error.main }
}));

const LinkStatus = ({ data, url }) => {
  const classes = useStyles();
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const result = await checkLink(data, url);
      const linkData =
        result === null || result === undefined ? [] : result.data;
      setLoading(false);
      setMessage(linkData.message);
      setStatus(linkData.working);
    }
    fetchData();
  }, [data, url]);

  return (
    <Tooltip title={message}>
      <Chip
        size="small"
        icon={
          loading ? (
            <CircularProgress size={14} />
          ) : status ? (
            <CheckIcon />
          ) : (
            <CloseIcon />
          )
        }
        label={data.name}
        component="a"
        href={data.url}
        className={status ? classes.success : classes.error}
        clickable
      />
    </Tooltip>
  );
};

export default LinkStatus;
