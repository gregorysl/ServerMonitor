import React, { useState, useEffect } from "react";
import { getIisApp } from "../../api/api_new";
import { connect } from "react-redux";
import ReactTable from "react-table";
import * as actions from "../../actions/actions";
import AppPoolList from "./AppPoolList";
import NoteControl from "./NoteControl";
import ApplicationStatus from "./ApplicationStatus";
import ActionPanel from "./ActionPanel";
import AppName from "./AppName";

const IisSection = props => {
  const [iisData, setIisData] = useState([]);
  const [forceRefresh, setforceRefresh] = useState(false);

  useEffect(() => {
    async function fetchData(url, name) {
      const result = await getIisApp(url);
      setIisData(result.data.data);
      setforceRefresh(false);
    }
    fetchData(props.url, forceRefresh);
  }, [forceRefresh, props.url]);
  const location = props.url
    .split("/")
    .splice(0, 4)
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
                org={row.original}
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
            Cell: row => (
              <NoteControl
                click={props.set}
                org={row.original}
                url={location}
                refresh={setforceRefresh}
              />
            ),
            width: 310
          },
          {
            Header: "Actions",
            accessor: "x",
            Cell: row => (
              <ActionPanel
                click={props.set}
                org={row.original}
                url={location}
                refresh={setforceRefresh}
                running={row.original.running}
                whitelisted={row.original.whitelisted}
              />
            ),
            width: 100
          }
        ]}
        SubComponent={row => (
          <AppPoolList
            click={props.set}
            org={row.original}
            url={location}
            refresh={setforceRefresh}
            items={row.original.apps}
            recycle={props.recycle}
          />
        )}
      />
    </React.Fragment>
  );
};

const mapStateToProps = state => ({
  iis: state.table
});

const mapDispatchToProps = dispatch => ({
  recycle: (name, url) => dispatch(actions.recycleApp(name, url)),
  set: (item, url, refresh, action) => {
    const data = {
      build: item,
      action: action
    };
    dispatch(actions.setIisAction(data, url));
    refresh(true);
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(IisSection);
