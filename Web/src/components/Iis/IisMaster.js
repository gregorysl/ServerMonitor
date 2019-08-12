import React, { useState, useEffect } from "react";
import { Row } from "antd";
import { getAllUrls } from "../../api/api_new";
import ReactTable from "react-table";
import "react-table/react-table.css";
import IisSection from "./IisSection";

const commonName = "?iisCommonName=";
const noExpander = () => ({ "data-qnt": 0 });

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

  const expandedRows = iisData.map((x, i) => i + 1);
  return (
    <Row>
      <h1 className='table-title'>IIS Applications</h1>
      <ReactTable
        minRows={0}
        showPagination={false}
        TheadComponent={()=>null}
        noDataText='No IIS applications found'
        getTrProps={noExpander}
        data={iisData}
        columns={[
          {
            Header: "Name",
            accessor: "key",
            Cell: row => <h1>{row.value}</h1>
          }
        ]}
        expanded={expandedRows}
        SubComponent={row => <IisSection iisData={row.original} refresh={setforceRefresh} />}
      />
    </Row>
  );
};

export default IisServicesList;
