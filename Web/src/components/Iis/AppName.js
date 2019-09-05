import React from "react";

const AppName = props => {
  const item = props.running ? (<a
  target='_blank'
  rel='noopener noreferrer'
  href={`${props.location}/${props.name}/`}
>
  {props.name}
  </a>) :
(<p>{props.name}</p>)
  return item;
};


export default AppName;
