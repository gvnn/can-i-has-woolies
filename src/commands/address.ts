import chalk from "chalk";
import { log } from "../utils/log";
import { Address, AddressSearch } from "../types";
import config from "config";
import http from "../utils/http";
import inquirer from "inquirer";
import fs from "fs";
import { GaxiosResponse } from "gaxios";

const findAddress = async (
  Search: string
): Promise<
  GaxiosResponse<{
    Response: AddressSearch[];
  }>
> =>
  http.request<{ Response: AddressSearch[] }>({
    url: config.get("api.address"),
    method: "POST",
    data: {
      Search,
    },
  });

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

const findAddressData = async (selectedOption: {
  AddressId: string;
}): Promise<
  GaxiosResponse<{
    Address: Address;
  }>
> =>
  http.request<{ Address: Address }>({
    url: config.get("api.auto"),
    method: "POST",
    data: {
      AddressId: selectedOption.AddressId,
    },
  });

export const checkAddress = async (addr: string): Promise<void> => {
  log("Searching for:", addr);
  const addresses = await findAddress(addr);

  const selectedOption = await promptOptions(addresses.data);

  const selectedAddress = await findAddressData(selectedOption);

  fs.writeFileSync(
    "./config/local.json",
    JSON.stringify({ address: selectedAddress.data.Address })
  );

  log(chalk.red("Now you can search. Run yarn start -c"));
};
