import React, { Component } from 'react';
import { render } from "react-dom";
import { Progress, Card } from 'antd';

const Chart = ({title}) => {
    return (
        <Card title={title} >
            <Progress type="dashboard" percent={75} />
        </Card>
    );
}

export default Chart;