import { Timeslot } from "../services/woolies";

export const getAvailableTimeSlots = (data: Timeslot[]): Timeslot[] =>
  data.reduce((accum, current) => {
    const avTimes = current.Times.filter((t) => t.Available);
    if (avTimes.length > 0) {
      accum.push({ Date: current.Date, Times: avTimes });
    }
    return accum;
  }, [] as Timeslot[]);
