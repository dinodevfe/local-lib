import { useMediaQuery } from "react-responsive";

export const KeyExtractor = (item: any, index: number) => {
  return `key${index}`;
};
export const Sleep = (sec: number) =>
  new Promise((resolve) => setTimeout(resolve, sec));
export const FetchDelay = async function <TModel>(
  action: () => Promise<TModel>,
  sec: number
) {
  const [res] = await Promise.all([action(), Sleep(sec)]);
  return res;
};
export const FormatterUSD = () =>
  Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",

    // These options are needed to round to whole numbers if that's what you want.
    //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
    //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
  });
export const CreateUseMediaQuery = () => {
  return useMediaQuery({ maxWidth: 767 });
};
if (!Object.getOwnPropertyDescriptor(Number.prototype, "toHHMMSS")) {
  // eslint-disable-next-line no-extend-native
  Object.defineProperty(Number.prototype, "toHHMMSS", {
    value: function () {
      const sec_num = this; // don't forget the second param
      let hours: number | string = Math.floor(sec_num / 3600);
      let minutes: number | string = Math.floor((sec_num - hours * 3600) / 60);
      let seconds: number | string = Math.floor(sec_num - hours * 3600 - minutes * 60);

      if (hours < 10) {
        hours = "0" + hours;
      }
      if (minutes < 10) {
        minutes = "0" + minutes;
      }
      if (seconds < 10) {
        seconds = "0" + seconds;
      }
      return hours + ":" + minutes + ":" + seconds;
    },
  });
}
