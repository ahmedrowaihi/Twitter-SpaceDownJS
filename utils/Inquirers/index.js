import inquirer from "inquirer";
import { spaceIDRegExp } from "../../constants/index.js";

const ExecSpaceID = (SpaceID) => spaceIDRegExp.exec(SpaceID)?.[0].trim?.();

export const GetSpaceIDPropmpt = async () => {
  const { spaceID } = await new inquirer.prompt({
    message: "Paste Space ID:",
    name: "spaceID",
    type: "input",
    validate: (text) => spaceIDRegExp.test(text),
    transformer: ExecSpaceID,
  });
  return ExecSpaceID(spaceID);
};
