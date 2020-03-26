import { parseJSON, format } from "date-fns";
import chalk from "chalk";
import { log } from "../utils/log";
import { Timeslot, Address } from "../types";
import config from "config";
import http from "../utils/http";
import { GaxiosResponse } from "gaxios";

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
    log(chalk.red("No available times for now, check later!"));
    return;
  }

  log(chalk.green.bold("YAY! Slots are open!", "\n"));
  available.forEach(printFullList);

  log("");
};

const printResult = (data: Timeslot[], output: "list" | "check"): void => {
  if (output === "list") {
    data.forEach(printFullList);
    return;
  }

  printAvailable(data);
};

const loadTimeSlot = async (
  addressConfig: Address
): Promise<GaxiosResponse<Timeslot[]>> =>
  http.request<Timeslot[]>({
    url: config.get("api.timeslots"),
    params: {
      addressId: addressConfig.AddressId,
      areaId: addressConfig.AreaId,
      fulfilmentMethod: "Courier",
      getMergedResults: false,
      suburbId: addressConfig.SuburbId,
    },
  });

export const checkTimeSlots = async (
  output: "list" | "check"
): Promise<void> => {
  let addressConfig: Address;
  try {
    addressConfig = config.get("address");
  } catch (error) {
    log(chalk.red('No address config. Run yarn start -a "your address"'));
    return;
  }

  log("Searching for:", addressConfig.AddressText, "\n");

  const slots = await loadTimeSlot(addressConfig);

  printResult(slots.data, output);
};
