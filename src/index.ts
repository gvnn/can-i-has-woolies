import { displayTitle } from "./silly";
import { program } from "commander";

import { checkTimeSlots } from "./commands/timeSlots";
import { checkAddress } from "./commands/address";
import { logPolling } from "./commands/logPolling";

const main = async (): Promise<void> => {
  await displayTitle();

  program
    .option("-c, --check", "check time slots", () => checkTimeSlots("check"))
    .option("-l, --list", "full timeslots output", () => checkTimeSlots("list"))
    .option("-p, --polling <minutes>", "long polling time slots", logPolling)
    .option("-a, --addr <type>", "search your address", checkAddress)
    .parse(process.argv);
};

main();
