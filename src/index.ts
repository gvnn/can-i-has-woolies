import { parseJSON, format } from "date-fns";
import chalk from "chalk";
import http from "./http";
import config from "config";
import { displayTitle } from "./silly";

const log = console.log;

interface TimeslotTime {
  Status: string;
  NormalAllocationStatus: string;
  TimeWindow: string;
  Available: boolean;
  TimeSlotStatus: string;
}

interface Timeslot {
  Times: TimeslotTime[];
  Date: string;
  ClosedText: string;
}

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

const main = async () => {
  await displayTitle();
  const res = await http.request<Timeslot[]>({
    url: config.get("api.timeslots"),
    params: {
      addressId: 8167070,
      areaId: 2046,
      fulfilmentMethod: "Courier",
      getMergedResults: false,
      suburbId: 3480
    }
  });

  printResult(res.data);
};

main();
