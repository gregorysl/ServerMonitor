import React, { useState, useEffect } from "react";
import { getSettings } from "../../api/api_new";
import LinkStatus from "../LinkStatus";

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
  const data = links.map(x => <LinkStatus data={x} key={x.name} url={url} />);
  return <>{data}</>;
};

export default ServerLinks;
