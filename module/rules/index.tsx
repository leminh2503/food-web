import type {ColumnsType} from "antd/es/table";
import {Button, Image, Modal, Table} from "antd";
import {IRules} from "@app/types";
import React, {useEffect, useState} from "react";
import data_rules from "./data.js"

export function Rules(): JSX.Element {

    const onRow = (): {onDoubleClick: () => void} => {
        return {
          onDoubleClick: (): void => {
            (<h1>dsdsd</h1>)
          },
        };
      };


    const columns: ColumnsType<IRules>=[
        {
            title: "STT",
            dataIndex: "index",
            key: "index",
            align: "center",
            render: (_, record, index) => <div>{index + 1}</div>,
        },
        {
            title: "Nội quy/Quy định",
            dataIndex: "tittle",
            key: "tittle",
            align: "center",
        },
        {
            title: "Ngày bắt đầu hiệu lực",
            dataIndex: "startTime",
            key: "startTime",
            align: "center",
        },
        {
                
            title: "Tải xuống",
            dataIndex: "link",
            key: "link",
            align: "center",
        },
        
    ]

    return(

        <>
        <Table
        columns={columns}
        dataSource={data_rules}
        bordered
        onRow={onRow}
      />
        </>
    )
}