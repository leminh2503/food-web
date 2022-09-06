import "./index.scss";
import ApiBirthday from "@app/api/ApiBirthday";
import {IProfile} from "@app/types";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {useQuery} from "react-query";
import {FilterBirthday} from "./FilterBirthday";
import {Card, Empty, Image} from "antd";

const {Meta} = Card;

export function Birthday(): JSX.Element {
  const [filterYear, setFilterYear] = useState<number>(moment().year());
  const [filterMonth, setFilterMonth] = useState<number>(moment().month() + 1);

  const getBirthday = (): Promise<IProfile[]> => {
    return ApiBirthday.getBirthday({
      filter: {
        dateOfBirth_MONTH: filterMonth,
      },
    });
  };
  const dataBirthday = useQuery("listBirthday", getBirthday);

  const dataRefetch = (): void => {
    dataBirthday.refetch();
  };

  useEffect(() => {
    dataRefetch();
  }, [filterYear, filterMonth]);

  return (
    <div className="container">
      <FilterBirthday
        setFilterYear={setFilterYear}
        setFilterMonth={setFilterMonth}
      />
      <div className="flex flex-wrap">
        {dataBirthday.data && dataBirthday.data?.length > 0 ? (
          dataBirthday.data?.map((item, index) => (
            <div className="p-5" key={index}>
              <Card
                className="birthday-card flex flex-col items-center w-60 rounded-xl"
                cover={
                  <Image
                    className="birthday-avatar"
                    src={item.avatar ? item.avatar : "/img/avatar/avatar.jpg"}
                    alt="avatar"
                  />
                }
              >
                <Meta
                  className="birthday-text"
                  title={item.fullName}
                  description={
                    moment(item.dateOfBirth).format("DD-MM") + "-" + filterYear
                  }
                />
              </Card>
            </div>
          ))
        ) : (
          <Empty
            className="m-auto mt-52"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        )}
      </div>
    </div>
  );
}
