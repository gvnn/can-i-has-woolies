import chalk from "chalk";
import { log } from "../utils/log";
import { Address, AddressSearch } from "../types";
import config from "config";
import http from "../utils/http";
import inquirer from "inquirer";
import fs from "fs";

export const checkAddress = async (addr: string) => {
  log("Searching for:", addr);
  const res = await http.request<{ Response: AddressSearch[] }>({
    url: config.get("api.address"),
    method: "POST",
    data: {
      Search: addr,
    },
  });
  const inq = await inquirer.prompt({
    type: "list",
    name: "AddressId",
    message: "What is your address?",
    choices: res.data.Response.map((addr) => ({
      name: addr.Text,
      value: addr.Id,
    })),
  });

  const auto = await http.request<{ Address: Address }>({
    url: config.get("api.auto"),
    method: "POST",
    data: {
      AddressId: inq.AddressId,
    },
  });

  fs.writeFileSync(
    "./config/local.json",
    JSON.stringify({ address: auto.data.Address })
  );

  log(chalk.red("Now you can search. Run yarn start -c"));
};
