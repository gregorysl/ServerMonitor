import React from "react";

const AppName = ({ name, running, location }) => {
  const title = <span className="app-title">{name}</span>;
  return running ? (
    <a target="_blank" rel="noopener noreferrer" href={`${location}/${name}/`}>
      {title}
    </a>
  ) : (
    title
  );
};

export default AppName;
