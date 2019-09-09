import React from "react";
import ReactTable from "react-table";
import dateformat from "dateformat";
import "react-table/react-table.css";
import TooltipButton from "../TooltipButton";
import StartStopButton from "./StartStopButton";
import ApplicationStatus from "./ApplicationStatus";

const AppPoolList = props => {
  if (props.items.length === 0) {
    return <h1>No IIS applications found.</h1>;
  }
  return (
    <>
      <h3>
        {props.org.daysOld} days old, created
        {dateformat(props.org.createdDateTime, " dd.mm.yyyy, dddd")}
      </h3>
      <ReactTable
        showPagination={false}
        sortable={false}
        minRows={1}
        data={props.items}
        columns={[
          {
            Header: "Name",
            accessor: "name"
          },
          {
            Header: "State",
            accessor: "running",
            Cell: row => (
              <ApplicationStatus
                state={row.value ? "Running" : "Stopped"}
                {...row.original}
              />
            )
          },
          {
            Header: "Action",
            accessor: "name",
            Cell: row => (
              <>
                <StartStopButton
                  click={props.click}
                  org={{ apps: [row.original] }}
                  url={props.url}
                  refresh={props.refresh}
                  running={props.org.running}
                />
                {row.original.running && (
                  <TooltipButton
                    tooltip="recycle"
                    icon="reload"
                    click={() => props.recycle(row.value, props.url)}
                  />
                )}
              </>
            ),
            width: 100
          }
        ]}
      />
    </>
  );
};

export default AppPoolList;
