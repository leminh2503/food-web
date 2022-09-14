import "./index.scss";
import ApiBirthday from "@app/api/ApiBirthday";
import {IProfile} from "@app/types";
import moment from "moment";
import React, {useEffect, useState} from "react";
import {useQuery} from "react-query";
import {FilterBirthday} from "./FilterBirthday";
import {Carousel} from "antd";

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
  const data = [1, 2, 3, 4];

  return (
    <div className="container">
      <FilterBirthday
        setFilterYear={setFilterYear}
        setFilterMonth={setFilterMonth}
      />
      <div className="w-[100%] h-[70%] pt-24 slider">
        <Carousel
          autoplay
          slidesToShow={3}
          touchMove
          dots
          centerMode
          speed={2000}
          autoplaySpeed={4000}
        >
          {data?.map((item, index) => (
            <div key={index} className="w-[40%]">
              <img src="img/birthday/bg-birthday.png" key={index} alt="swipe" />
              <img
                src={
                  dataBirthday.data && dataBirthday.data[index]
                    ? dataBirthday.data[index]?.avatar
                    : "img/avatar/avatar.jpg"
                }
                className="avatar"
                key={index}
                alt="swipe"
              />
              <span className="name">
                {dataBirthday.data && dataBirthday.data[index]
                  ? dataBirthday.data[index]?.fullName
                  : ""}
              </span>
            </div>
          ))}
        </Carousel>
        <div className="shadow mt-36" />
      </div>
      {/* <div className="flex flex-wrap"> */}
      {/*  {dataBirthday.data && dataBirthday.data?.length > 0 ? ( */}
      {/*    dataBirthday.data?.map((item, index) => ( */}
      {/*      <div className="p-5" key={index}> */}
      {/*        <Card */}
      {/*          className="birthday-card flex flex-col items-center w-60 rounded-xl" */}
      {/*          cover={ */}
      {/*            <Image */}
      {/*              className="birthday-avatar" */}
      {/*              src={item.avatar ? item.avatar : "/img/avatar/avatar.jpg"} */}
      {/*              alt="avatar" */}
      {/*            /> */}
      {/*          } */}
      {/*        > */}
      {/*          <Meta */}
      {/*            className="birthday-text" */}
      {/*            title={item.fullName} */}
      {/*            description={ */}
      {/*              moment(item.dateOfBirth).format("DD-MM") + "-" + filterYear */}
      {/*            } */}
      {/*          /> */}
      {/*        </Card> */}
      {/*      </div> */}
      {/*    )) */}
      {/*  ) : ( */}
      {/*    <Empty */}
      {/*      className="m-auto mt-52" */}
      {/*      image={Empty.PRESENTED_IMAGE_SIMPLE} */}
      {/*    /> */}
      {/*  )} */}
      {/* </div> */}
    </div>
  );
}
