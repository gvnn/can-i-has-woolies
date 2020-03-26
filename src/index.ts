import { parseJSON, format } from "date-fns";
import chalk from "chalk";
import http from "./http";
import config from "config";
import { displayTitle } from "./silly";
import { program } from "commander";
import { Timeslot, Address, AddressSearch } from "./types";
import inquirer from "inquirer";
import fs from "fs";

const log = console.log;

const printResult = (data: Timeslot[]) => {
  data.forEach(slot => {
    const date = parseJSON(slot.Date);
    const pattern = "dd.MM.yyyy";
    const output = format(date, pattern);
    log(chalk.blue(output));
    log(chalk.yellow(slot.ClosedText));

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

const checkTimeSlots = async () => {
  let addressConfig: Address;
  try {
    addressConfig = config.get("address");
  } catch (error) {
    log(chalk.red('No address config. Run yarn start -a "your address"'));
    return;
  }

  log("Searching for:", addressConfig.AddressText);

  const res = await http.request<Timeslot[]>({
    url: config.get("api.timeslots"),
    params: {
      addressId: addressConfig.AddressId,
      areaId: addressConfig.AreaId,
      fulfilmentMethod: "Courier",
      getMergedResults: false,
      suburbId: addressConfig.SuburbId
    }
  });

  printResult(res.data);
};

const checkAddress = async (addr: string) => {
  log("Searching for:", addr);
  const res = await http.request<{ Response: AddressSearch[] }>({
    url: config.get("api.address"),
    method: "POST",
    data: {
      Search: addr
    }
  });
  const inq = await inquirer.prompt({
    type: "list",
    name: "AddressId",
    message: "What is your address?",
    choices: res.data.Response.map(addr => ({
      name: addr.Text,
      value: addr.Id
    }))
  });

  const auto = await http.request<{ Address: Address }>({
    url: config.get("api.auto"),
    method: "POST",
    data: {
      AddressId: inq.AddressId
    }
  });

  fs.writeFileSync(
    "./config/local.json",
    JSON.stringify({ address: auto.data.Address })
  );

  log(chalk.red("Now you can search. Run yarn start -c"));
};

const main = async () => {
  await displayTitle();

  program
    .option("-c, --check", "check time slots", checkTimeSlots)
    .option("-a, --addr <type>", "search your address", checkAddress)
    .allowUnknownOption(false)
    .parse(process.argv);
};

main();
