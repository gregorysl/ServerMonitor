import React from "react";
import ReactTable from "react-table";
import "react-table/react-table.css";
import PropTypes from "prop-types";
import TooltipButon from "../TooltipButon";
import ActionsButtons from "./ActionsButtons";

const AppPoolList = props => {
  if (props.items.length === 0) {
    return <h1>No IIS applications found.</h1>;
  }
  return (
    <>
      <h3>Days old: {props.app.daysOld} created build date {props.app.createdDateTime.split("T")[0]}</h3>
      <ReactTable
        showPagination={false}
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
              <font className={`state-${row.value ? "started" : "stopped"}`}>
                {row.value ? "Started" : "Stopped"}
              </font>
            )
          },
          {
            Header: "Action",
            accessor: "name",
            Cell: row => (
              <>
                <ActionsButtons {...row.original} />
                <TooltipButon
                  title="recycle"
                  icon="reload"
                  click={() => props.recycle(row.value)}
                />
              </>
            ),
            width: 100
          }
        ]}
        SubComponent={row => (
          <div className="app-pool-children">
            {row.original.children.map(x => (
              <span key={x}>{x}</span>
            ))}
          </div>
        )}
      />
    </>
  );
};

AppPoolList.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  recycle: PropTypes.func.isRequired
};

export default AppPoolList;
