/**
 * @author Ahmed Rowaihi
 * @description M3U8 to MP4 Converter
 * @version 0.0.1
 */

import ffmpeg from "fluent-ffmpeg";
import { createSpinner } from "nanospinner";

/**
 * A class to convert M3U8 to MP4
 * @class
 */
class FFmpegm3uToMp4 {
  #progress = createSpinner("Download & Processing: 0%").start();
  constructor({ InputFile, OutputFile, Headers }) {
    if (InputFile) this.setInputFile(InputFile);
    if (OutputFile) this.setOutputFile(OutputFile);
    if (Headers) this.setHeaders(Headers);
    return this;
  }
  /**
   * For Remote M3U8 Files:
   * Maps inputs headers config Object into inline headers config
   * @param {Object} config
   * Example
   * config = {
   * Authorization: Bearer AAAAAAAAAAAAAAAAAAAXXXXXXXX,
   * "User-Agent":
   *   "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:84.0) Gecko/20100101 Firefox/84.0",
   * "Accept-Language": "de,en-US;q=0.7,en;q=0.3",
   * "Accept-Encoding": "gzip, deflate, br", TE: "trailers",
   * }
   * @returns {Function}
   */
  setHeaders(config) {
    if (config && typeof config !== "object")
      throw new Error("Headers config must be an object");
    else
      this.headers = Object.keys(config)
        .map((k) => k + ": " + config[k])
        .join("\r\n");
    return this;
  }
  /**
   * Sets the input file
   * @param {String || URL} InputFile M3U8 file path or remote URL such as https://<SourceWebsite.com/<FilePath.M3U8>.
   * @returns {Function}
   */
  setInputFile(InputFile) {
    if (!InputFile) throw new Error("You must specify the M3U8 file address");
    this.M3U8_FILE = InputFile;
    return this;
  }
  /**
   * Sets the output file
   * @param {String} OutputFile Output file path. Has to be local local path.
   * @returns {Function}
   */
  setOutputFile(OutputFile) {
    if (!OutputFile) throw new Error("You must specify the file path and name");
    this.OUTPUT_FILE = OutputFile;
    return this;
  }

  /**
   * Starts the process
   */
  start() {
    return new Promise((resolve, reject) => {
      if (!this.M3U8_FILE || !this.OUTPUT_FILE) {
        reject(new Error("You must specify the input and the output files"));
        return;
      }
      ffmpeg(this.M3U8_FILE)
        .inputOption("-headers", this.headers ?? "")
        .on("error", (error) => {
          this.#progress.stop({ text: error });
          reject(new Error(error));
        })
        .on("progress", (progress) =>
          this.#progress.update({
            text: `Download & Processing: ${Math.floor(progress.percent)}%`,
          })
        )
        .on("end", () => {
          this.#progress.success({
            text: "Twitter Space Has been downloaded successfully! :)",
          });
          resolve();
        })
        .outputOptions("-c copy")
        .outputOptions("-bsf:a aac_adtstoasc")
        .output(this.OUTPUT_FILE)
        .run();
    });
  }
}

export default FFmpegm3uToMp4;
