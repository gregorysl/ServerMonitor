import React from "react";
import Link from "@material-ui/core/Link";

const AppName = ({ name, running, location }) => {
  const title = <span className="app-title">{name}</span>;
  return running ? (
    <Link
      component="a"
      target="_blank"
      rel="noopener noreferrer"
      href={`${location}/${name}/`}
    >
      {title}
    </Link>
  ) : (
    title
  );
};

export default AppName;
