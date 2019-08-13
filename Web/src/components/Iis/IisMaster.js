import React, { useState, useEffect } from "react";
import { Row } from "antd";
import { getAllUrls } from "../../api/api_new";
import "react-table/react-table.css";
import IisSection from "./IisSection";

const commonName = "?iisCommonName=";

const IisServicesList = props => {
  const [iisData, setIisData] = useState([]);
  const [forceRefresh, setforceRefresh] = useState(false);

  useEffect(() => {
    const urls = props.settings.hardwareList.map(x => ({
      key: x.name,
      url: `${x.url}Iis/${commonName}${x.name}`,
      ref: forceRefresh
    }));
    async function fetchData(urls) {
      const result = await getAllUrls(urls);
      const newData = result.map(a => ({
        key: a.request.responseURL.split(commonName)[1],
        homeUrl: a.request.responseURL.split(commonName)[0],
        data: a.data.data
      }));
      setIisData(newData);
      setforceRefresh(false);
    }
    fetchData(urls);
  }, [forceRefresh, props.settings]);

  const data = iisData.map(x => (
    <Row key={x.key}>
      <h3>{x.key}</h3>
      <IisSection iisData={x} refresh={setforceRefresh} />
    </Row>
  ));
  return (
    <Row>
      <h1 className='table-title'>IIS Applications</h1>
      {data}
    </Row>
  );
};

export default IisServicesList;
