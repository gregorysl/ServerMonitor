import React from "react";
import ReactTable from "react-table";
import dateformat from "dateformat";
import "react-table/react-table.css";
import PropTypes from "prop-types";
import TooltipButon from "../TooltipButon";
import ActionsButtons from "./ActionsButtons";
import ApplicationStatus from './ApplicationStatus';

const AppPoolList = props => {
  if (props.items.length === 0) {
    return <h1>No IIS applications found.</h1>;
  }
  return (
    <>
      <h3>{props.app.daysOld} days old, created {dateformat(props.app.createdDateTime, "dd.mm.yyyy, dddd")}</h3>
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
            Cell: row => <ApplicationStatus running={row.value} text={row.value ? "Started" : "Stopped"} />
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
