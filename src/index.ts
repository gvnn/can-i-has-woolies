import { displayTitle } from "./silly";
import { program } from "commander";

import { checkTimeSlots } from "./commands/timeSlots";
import { checkAddress } from "./commands/address";

const main = async (): Promise<void> => {
  await displayTitle();

  program
    .option("-c, --check", "check time slots", checkTimeSlots)
    .option("-a, --addr <type>", "search your address", checkAddress)
    .allowUnknownOption(false)
    .parse(process.argv);
};

main();
