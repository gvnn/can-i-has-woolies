import { request } from "gaxios";
import { parseJSON, format } from "date-fns";
import chalk from "chalk";

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
  const res = await request<Timeslot[]>({
    url:
      "https://www.woolworths.com.au/apis/ui/Timeslots?addressId=8167070&areaId=2046&fulfilmentMethod=Courier&getMergedResults=false&suburbId=3480"
  });

  printResult(res.data);
};

main();
