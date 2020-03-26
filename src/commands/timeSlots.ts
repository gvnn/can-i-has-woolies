import chalk from "chalk";
import { log, logTimeSlots } from "../utils/log";
import config from "config";
import { timeSlots, Address } from "../services/woolies";

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

  const slots = await timeSlots(addressConfig);

  logTimeSlots(slots.data, output);
};
