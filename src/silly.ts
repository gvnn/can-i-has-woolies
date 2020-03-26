import figlet from "figlet";
import config from "config";

export const displayTitle = async (): Promise<void> =>
  new Promise((resolve, reject) =>
    figlet(config.get("name"), (err, data) => {
      if (err) {
        reject(err);
      }
      console.log(data);
      resolve();
    })
  );
