#!/usr/bin/env node
import axios from "axios";
import "dotenv/config";

import chalk from "chalk";
import { createSpinner } from "nanospinner";
import inquirer from "inquirer";
/**
 * Fetch Headers
 */
const { TWITTER_API_KEY } = process.env;
const spaceIDReg = /([0-9][A-Z])\w+/;
const HeadersConfig = {
  headers: {
    Accept: "*/*",
    Authorization: TWITTER_API_KEY,
    "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
    "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
    "Accept-Encoding": "gzip, deflate, br",
    TE: "trailers",
  },
};
class Twitter {
  #config;
  #AxiosT;
  #isGuest;
  #spaceSRC;
  #spaceChunks;
  #sleep = async (ms = 2000) => new Promise((r) => setTimeout(r, ms));
  #logFail = (msg) => console.log(chalk.bgRed(msg));
  #logProgress = (msg) => console.log(chalk.bgGreenBright(msg));
  #logSuccess = (msg) => console.log(chalk.bgGreen(msg));

  constructor() {
    this.#config = HeadersConfig;
    this.#AxiosT = axios.create(this.#config);
    this.#GetGuestToken();
  }
  async #GetGuestToken() {
    // Generate Guest Token
    const spinner = createSpinner("Generating A Guest...").start();
    try {
      await this.#AxiosT
        .post("https://api.twitter.com/1.1/guest/activate.json")
        .then(async ({ data }) => {
          try {
            this.#config.headers["X-Guest-Token"] = data.guest_token;
            this.#AxiosT = axios.create(this.#config); // update headers with new guest config
            this.#isGuest = true;
          } catch (error) {}
        });

      if (this.#isGuest)
        spinner.success({ text: "Guest token was craeted successfully!" }),
          this.#getID();
      else throw Error();
    } catch (error) {
      spinner.error({ text: "Faild to generate guest token." });
    }
  }
  #getID = async () => {
    // Get SpaceID user Input
    const { spaceID } = await new inquirer.prompt({
      message: "Paste Space ID",
      name: "spaceID",
      type: "input",
      validate: (text) => RegExp(spaceIDReg).test(text),
      transformer: (text) => RegExp(spaceIDReg).exec(text)?.[0].trim?.(),
    });
    const cleanID = RegExp(spaceIDReg).exec(spaceID)?.[0].trim?.();
    if (!cleanID) return this.#logFail("Invalid Space ID");
    this.#logProgress("Valid Space ID: " + cleanID);
    return this.#getSpaceMetas(cleanID);
  };
  #getSpaceMetas = async (spaceID) => {
    // fetch media key
    const media_keySpinner = createSpinner("Fetching Media Key...").start();
    const media_key = await this.#AxiosT
      .get(
        `https://twitter.com/i/api/graphql/lFpix9BgFDhAMjn9CrW6jQ/AudioSpaceById?variables={"id":"${spaceID}","isMetatagsQuery":false,"withBirdwatchPivots":false,"withDownvotePerspective":false,"withReactionsMetadata":false,"withReactionsPerspective":false,"withReplays":false,"withScheduledSpaces":false,"withSuperFollowsTweetFields":false,"withSuperFollowsUserFields":false}`
      )
      .then((res) => res.data.data.audioSpace.metadata.media_key)
      .catch(() => null);
    if (!media_key)
      return media_keySpinner.stop({ text: "Failed to get Space Media Key" });
    media_keySpinner.success({
      text: "Success Fetch of Media Key: " + media_key,
    });
    return this.#fetchStream(media_key);
  };
  #fetchStream = async (media_key) => {
    const spaceSRCSpinner = createSpinner("Fetching Space details...").start();
    const spaceSRC = await this.#AxiosT
      .get(
        "https://twitter.com/i/api/1.1/live_video_stream/status/" + media_key
      )
      .catch(() => null)
      .then(({ data }) => data?.source?.noRedirectPlaybackUrl);
    if (!spaceSRC)
      spaceSRCSpinner.stop({ text: "Fetching Space details Fialed" });
    spaceSRCSpinner.success({ text: "Successful Space details fetched" });
    const CleanSpaceSRC = spaceSRC.split("playlist")?.[0];
    this.#spaceSRC = CleanSpaceSRC;
    return this.#GetSpaceChunks(spaceSRC);
  };
  #GetSpaceChunks = async (spaceMu) => {
    // Get/Filter  All Chunks
    const chunks = await this.#AxiosT
      .get(spaceMu)
      .then((res) =>
        res.data
          .toString()
          .split("\n")
          .filter((line) => line.startsWith("chunk"))
      )
      .catch(() => []);
  };
}

console.log(
  chalk.bgRed("STILL WORKING ON THE PROJECT... PLEASE WAIT FOR THE NEXT BUILD")
);
process.exit(0);

const twitter = new Twitter();
