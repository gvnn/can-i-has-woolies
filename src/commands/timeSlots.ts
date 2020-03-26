import { parseJSON, format } from "date-fns";
import chalk from "chalk";
import { log } from "../utils/log";
import { Timeslot, Address } from "../types";
import config from "config";
import http from "../utils/http";
import { GaxiosResponse } from "gaxios";

const printResult = (data: Timeslot[]): void => {
  data.forEach(slot => {
    const date = parseJSON(slot.Date);
    const pattern = "dd.MM.yyyy";

    log(chalk.blue(format(date, pattern)));

    slot.Times.forEach(time => {
      log(
        time.TimeWindow,
        time.Available
          ? chalk.green(time.TimeSlotStatus)
          : chalk.red(time.TimeSlotStatus)
      );
    });
  });
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
      suburbId: addressConfig.SuburbId
    }
  });

export const checkTimeSlots = async (): Promise<void> => {
  let addressConfig: Address;
  try {
    addressConfig = config.get("address");
  } catch (error) {
    log(chalk.red('No address config. Run yarn start -a "your address"'));
    return;
  }

  log("Searching for:", addressConfig.AddressText);

  const slots = await loadTimeSlot(addressConfig);

  printResult(slots.data);
};
