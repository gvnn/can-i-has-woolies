import { Gaxios } from "gaxios";
import config from "config";

const client = new Gaxios({
  baseURL: config.get("api.baseURL"),
});

export default client;
