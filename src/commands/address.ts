import chalk from "chalk";
import { log } from "../utils/log";
import {
  AddressSearch,
  findAddress,
  identifyAddress,
} from "../services/woolies";

import inquirer from "inquirer";
import fs from "fs";

import path from "path";

const promptOptions = async (addresses: {
  Response: AddressSearch[];
}): Promise<{
  AddressId: string;
}> =>
  inquirer.prompt({
    type: "list",
    name: "AddressId",
    message: "What is your address?",
    choices: addresses.Response.map((addr) => ({
      name: addr.Text,
      value: addr.Id,
    })),
  });

export const checkAddress = async (addr: string): Promise<void> => {
  log("Searching for:", addr, "\n");

  const addresses = await findAddress(addr);

  const selectedOption = await promptOptions(addresses.data);

  const selectedAddress = await identifyAddress(selectedOption);

  fs.writeFileSync(
    path.join(__dirname, "../../config/local.json"),
    JSON.stringify({ address: selectedAddress.data.Address })
  );

  log(chalk.red("Now you can search. Run yarn start -c"));
};
