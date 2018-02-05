import React from 'react';
import { Icon, Tooltip } from 'antd';
// import PropTypes from 'prop-types';


const ActionsButtons = props => (
  <div>
    <Tooltip title="start" ><Icon type="caret-right" /></Tooltip>
    <Tooltip title="stop" ><Icon type="close-square" /></Tooltip>
    <Tooltip title="whitelist" ><Icon type="star-o" /></Tooltip>
    <Tooltip title="notes" ><Icon type="edit" /></Tooltip>
  </div>
);

// ActionsButtons.propTypes = {
//   items: PropTypes.arrayOf(PropTypes.object).isRequired,
//   columns: PropTypes.arrayOf(PropTypes.object).isRequired
// };

export default ActionsButtons;
