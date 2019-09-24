import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as actions from "../../actions/actions";
import ReactTable from "react-table";
import AppPoolList from "./AppPoolList";
import NoteControl from "./NoteControl";
import ApplicationStatus from "./ApplicationStatus";
import ActionPanel from "./ActionPanel";
import AppName from "./AppName";

const IisSection = props => {
  const iisData = useSelector(state => {
    const key = state.table.keys.indexOf(props.url);
    if (key === -1) return [];
    else return state.table.data[key];
  });
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.getIisAction(props.url));
  }, [dispatch, props.url]);
  const location = props.url
    .split("/")
    .splice(0, 3)
    .join("/");
  return (
    <React.Fragment>
      <ReactTable
        showPagination={false}
        noDataText="No IIS applications found"
        sortable={false}
        minRows={1}
        data={iisData}
        defaultSorted={[{ id: "key" }]}
        className="-highlight"
        getTdProps={() => ({
          style: {
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }
        })}
        columns={[
          {
            Header: "Name",
            accessor: "name",
            Cell: row => (
              <AppName
                location={location}
                name={row.original.name}
                running={row.original.running}
              />
            )
          },
          {
            Header: "State",
            accessor: "state",
            className: "state",
            Cell: row => (
              <ApplicationStatus
                state={row.original.state}
                cleanerMark={row.original.cleanerMark}
              />
            ),
            width: 200
          },
          {
            Header: "Note",
            accessor: "note",
            Cell: row => <NoteControl org={row.original} url={props.url} />,
            width: 310
          },
          {
            Header: "Actions",
            accessor: "x",
            Cell: row => (
              <ActionPanel
                org={row.original}
                url={props.url}
                running={row.original.running}
                whitelisted={row.original.whitelisted}
              />
            ),
            width: 100
          }
        ]}
        SubComponent={row => (
          <AppPoolList
            org={row.original}
            url={props.url}
            items={row.original.apps}
          />
        )}
      />
    </React.Fragment>
  );
};

export default IisSection;
