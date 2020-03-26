import notifier from "node-notifier";
import config from "config";
import open from "open";
import { Address, timeSlots } from "../services/woolies";
import chalk from "chalk";
import { log } from "../utils/log";
import { getAvailableTimeSlots } from "../utils/timeSlots";

const linkAnswer = "Go Go Go!";

const notify = (): Promise<boolean> =>
  new Promise((resolve, reject) => {
    notifier.notify(
      {
        title: config.get("name"),
        message: "New availability, quick!",
        closeLabel: "Don't worry",
        actions: linkAnswer,
      },
      (err, _response, metadata) => {
        if (err) {
          reject(err);
        }
        resolve(metadata?.activationValue === linkAnswer);
      }
    );
  });

const checkAvailability = async (addressConfig: Address): Promise<boolean> => {
  log("Started search for:", addressConfig.AddressText, "\n");
  const slots = await timeSlots(addressConfig);
  const available = getAvailableTimeSlots(slots.data);
  return available.length > 0;
};

const loop = (): boolean => true;

export const logPolling = async (): Promise<void> => {
  let addressConfig: Address;
  try {
    addressConfig = config.get("address");
  } catch (error) {
    log(chalk.red('No address config. Run yarn start -a "your address"'));
    return;
  }

  while (loop()) {
    const isThereAvailability = await checkAvailability(addressConfig);
    if (isThereAvailability) {
      log(
        chalk.green.bold(
          "YAY! Slots are open!",
          config.get("api.baseURL"),
          "\n"
        )
      );
      const openBrowser = await notify();
      if (openBrowser) {
        await open(config.get("api.baseURL"));
      }
    } else {
      log(
        chalk.red.bold("No available times for now. I'll check in 15 minutes."),
        "\n"
      );
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 * 60 * 15));
  }
};
