/* eslint-disable */
// @ts-nocheck
import colors from "colors";

export abstract class loggerV2 {
  private static displayLog(
    logColor: string,
    logSource: string,
    logTitle: string,
    logDetail?: string,
  ): void {
    if (logTitle && logDetail) {
      console.log(colors[logColor]("\n****************"));
      console.log(
        colors[logColor](logSource),
        colors[logColor](`${logTitle}:`),
        colors.white(logDetail),
      );
      console.log(colors[logColor]("****************\n"));
    } else {
      console.log(colors[logColor]("\n****************"));
      console.log(colors[logColor](logSource), colors.white(logTitle));
      console.log(colors[logColor]("****************\n"));
    }
  }

  public static info(
    logSource: string,
    logTitle: string,
    logDetail?: string,
  ): void {
    this.displayLog("cyan", logSource, logTitle, logDetail);
  }

  public static warn(
    logSource: string,
    logTitle: string,
    logDetail?: string,
  ): void {
    this.displayLog("yellow", logSource, logTitle, logDetail);
  }

  public static danger(
    logSource: string,
    logTitle: string,
    logDetail?: string,
  ): void {
    this.displayLog("red", logSource, logTitle, logDetail);
  }

  public static success(
    logSource: string,
    logTitle: string,
    logDetail?: string,
  ): void {
    this.displayLog("green", logSource, logTitle, logDetail);
  }
}
