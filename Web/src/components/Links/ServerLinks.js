import React, { useState, useEffect } from "react";
import { getSettings } from "../../api/api_new";
import LinkStatus from "../LinkStatus";
import { Grid } from "@material-ui/core";

const ServerLinks = ({ url }) => {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const settingsUrl = `${url}Settings/`;
      const result = await getSettings(false, settingsUrl);
      const linkData = result.data.links;
      setLinks(linkData);
    }
    fetchData();
  }, [url]);
  const data = links.map(x => (
    <Grid item key={x.name}>
      <LinkStatus data={x} url={url} />
    </Grid>
  ));
  return (
    <Grid container spacing={1}>
      {data}
    </Grid>
  );
};

export default ServerLinks;
