import React, { useState, useEffect } from "react";
import { checkLink } from "../api/api_new";
import { CircularProgress, Tooltip, Link } from "@material-ui/core";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CloseIcon from "@material-ui/icons/Close";
import CheckIcon from "@material-ui/icons/Check";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  success: { backgroundColor: "#87d068" },
  error: { backgroundColor: "#f5222d" },
  avatar: { marginRight: 4 },
  header: { paddingLeft: 4, paddingRight: 8, paddingTop: 0, paddingBottom: 0 },
  link: { color: "#000", textTransform: "uppercase" }
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
  const cardClasses = `${classes.root} ${
    loading ? "" : status ? classes.success : classes.error
  }`;
  return (
    <Tooltip title={message}>
      <Card className={cardClasses}>
        <CardHeader
          classes={{ avatar: classes.avatar }}
          className={classes.header}
          title={
            <Link className={classes.link} href={data.url}>
              {data.name}
            </Link>
          }
          avatar={
            loading ? (
              <CircularProgress size={14} />
            ) : status ? (
              <CheckIcon fontSize="small" />
            ) : (
              <CloseIcon />
            )
          }
        />
      </Card>
    </Tooltip>
  );
};

export default LinkStatus;
