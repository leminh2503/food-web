import "./index.scss";
import {Filter} from "@app/components/Filter";
import React, {useEffect, useState} from "react";
import {Table} from "antd";
import {DownloadOutlined} from "@ant-design/icons";
import baseURL from "@app/config/baseURL";
import {useRouter} from "next/router";
import moment from "moment";

const dataRule = [
  {
    id: 1,
    name: "Quy định về thuế thu nập cá nhân",
    effectiveDate: "12-02-2019",
  },
  {
    id: 2,
    name: "Quy định thưởng cho nhân viên giới thiệu ứng viên ",
    effectiveDate: "12-02-2022",
  },
  {
    id: 3,
    name: "Quy định về bảo hiểm ",
    effectiveDate: "12-02-2019",
  },
];

export function Rule(): JSX.Element {
  const router = useRouter();
  const [searchString, setSearchString] = useState("");
  const [onSearch, setOnSerch] = useState(false);
  const [dataSearch, setDateSearch] = useState(dataRule);

  useEffect(() => {
    setDateSearch(
      dataRule.filter((item) =>
        item.name.toLowerCase().includes(searchString.toLowerCase())
      )
    );
  }, [onSearch]);

  return (
    <div className="container-rule">
      <div className="mb-5">
        <Filter
          listSearch={[
            {
              isSearch: true,
              visible: true,
              placeholder: "Nhập từ khóa tìm kiếm",
              handleOnChangeSearch: (e) => setSearchString(e.target.value),
              handleOnSearch: (value) => {
                setSearchString(value);
                setOnSerch(!onSearch);
              },
            },
          ]}
        />
      </div>
      <Table
        columns={[
          {
            title: "STT",
            dataIndex: "index",
            key: "index",
            align: "center",
            width: "5%",
            render: (_, record, index) => <div>{index + 1}</div>,
          },
          {
            title: "Nội quy quy định",
            dataIndex: "name",
            key: "name",
            width: "40%",
            align: "center",
          },
          {
            title: "Ngày có hiệu lực",
            dataIndex: "effectiveDate",
            key: "effectiveDate",
            width: "40%",
            align: "center",
            render: (date) => moment(date).format("DD-MM-YYYY"),
          },
          {
            title: "Tải xuống",
            align: "center",
            width: "15%",
            render: (_, record) => (
              <button type="button">
                <DownloadOutlined style={{fontSize: 20, color: "#0092ff"}} />
              </button>
            ),
          },
        ]}
        dataSource={dataSearch}
        pagination={false}
        bordered
        onRow={(record): {onDoubleClick: () => void} => {
          return {
            onDoubleClick: (): void => {
              router.push({
                pathname:
                  record.id === 1
                    ? baseURL.RULE.QUY_DINH_VE_THUE_THU_NHAP_CA_NHAN
                    : record.id === 2
                    ? baseURL.RULE.QUY_DINH_VE_THUONG_GIOI_THIEU
                    : record.id === 3
                    ? baseURL.RULE.QUY_DINH_VE_BAO_HIEM
                    : "",
              });
            },
          };
        }}
      />
    </div>
  );
}
