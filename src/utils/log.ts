import { parseJSON, format } from "date-fns";
import chalk from "chalk";
import { Timeslot } from "../services/woolies";

export const log = console.log;

const pattern = "PPPP";

const printFullList = (slot: Timeslot): void => {
  const date = parseJSON(slot.Date);
  log(chalk.bold(format(date, pattern)), "\n");
  slot.Times.forEach((time) => {
    if (time.Available) {
      log(time.TimeWindow, "\t", chalk.green(time.TimeSlotStatus));
    } else {
      log(time.TimeWindow, "\t", chalk.red(time.TimeSlotStatus));
    }
  });

  log("");
};

const printAvailable = (data: Timeslot[]): void => {
  const available = data.reduce((accum, current) => {
    const avTimes = current.Times.filter((t) => t.Available);
    if (avTimes.length > 0) {
      accum.push({ Date: current.Date, Times: avTimes });
    }
    return accum;
  }, [] as Timeslot[]);

  if (available.length === 0) {
    log(chalk.red.bold("No available times for now, check later!"), "\n");
    return;
  }

  log(chalk.green.bold("YAY! Slots are open!", "\n"));
  available.forEach(printFullList);

  log("");
};

export const logTimeSlots = (
  data: Timeslot[],
  output: "list" | "check"
): void => {
  if (output === "list") {
    data.forEach(printFullList);
    return;
  }

  printAvailable(data);
};
