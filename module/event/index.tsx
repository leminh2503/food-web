import "./index.scss";
import React, {useEffect} from "react";
import ApiEvent from "@app/api/ApiEvent";
import {IEvent} from "@app/types";
import {useQuery} from "react-query";
import {EventCalendar} from "@app/module/event/components/EventCalendar";
import {queryKeys} from "@app/utils/constants/react-query";
import {IMetadata} from "@app/api/Fetcher";

export function Event(): JSX.Element {
  const getEvent = (): Promise<{data: IEvent[]; meta: IMetadata}> => {
    return ApiEvent.getEvent({
      sort: ["-startDate"],
    });
  };

  const {data: dataEvent, refetch} = useQuery(
    queryKeys.GET_LIST_EVENT,
    getEvent
  );

  useEffect(() => {
    refetch();
  }, []);

  return (
    <div className="container-event">
      {dataEvent && <EventCalendar dataEvent={dataEvent} />}
    </div>
  );
}
