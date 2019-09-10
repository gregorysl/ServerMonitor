import React from "react";
import { useDispatch } from "react-redux";
import ReactTable from "react-table";
import dateformat from "dateformat";
import "react-table/react-table.css";
import TooltipButton from "../TooltipButton";
import StartStopButton from "./StartStopButton";
import ApplicationStatus from "./ApplicationStatus";
import * as actions from "../../actions/actions";

const AppPoolList = props => {
  const dispatch = useDispatch();
  const toggle = data => dispatch(actions.setIisAction(data, props.url));
  const recycle = value => dispatch(actions.recycleApp(value, props.url));
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
                  build={{ apps: [row.original] }}
                  click={toggle}
                  running={row.original.running}
                />
                {row.original.running && (
                  <TooltipButton
                    tooltip="recycle"
                    icon="reload"
                    click={() => recycle(row.value)}
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
