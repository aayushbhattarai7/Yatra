import path from "path";
import { Environment } from "../constant/enum";
import fs from "fs";

export const getUploadFolderpathForGuide = (): string => {
  if (process.env.NODE_ENV === Environment.PRODUCTION)
    return path.resolve(process.cwd(), "public", "guide");
  return path.join(__dirname, "..", "..", "public", "guide");
};

export const getTempFolderPathForGuide = (): string => {
  return path.resolve(process.cwd(), "public", "temp");
};

export const getUploadFolderpathForplace = (): string => {
  `QAAA`;
  if (process.env.NODE_ENV === Environment.PRODUCTION)
    return path.resolve(process.cwd(), "public");
  return path.join(__dirname, "..", "..", "public");
};

export const getTempFolderPathForPlace = (): string => {
  return path.resolve(process.cwd(), "public", "temp");
};

export const getUploadFolderpathForTravel = (): string => {
  if (process.env.NODE_ENV === Environment.PRODUCTION)
    return path.resolve(process.cwd(), "public","travel");
  return path.join(__dirname, "..", "..", "public","travel");
};

export const getTempFolderPathForTravel = (): string => {
  return path.resolve(process.cwd(), "public", "temp");
};

export const getUploadFolderpathForHotel = (): string => {
  if (process.env.NODE_ENV === Environment.PRODUCTION)
    return path.resolve(process.cwd(), "public", "hotel");
  return path.join(__dirname, "..", "..", "public", "hotel");
};

export const getTempFolderPathForHotel = (): string => {
  return path.resolve(process.cwd(), "public", "temp");
};

export const getTempFolderPathForUser = (): string => {
  return path.resolve(process.cwd(), "public", "temp");
};
export const getUploadFolderpathForUser = (): string => {
  if (process.env.NODE_ENV === Environment.PRODUCTION)
    return path.resolve(process.cwd(), "public");
  return path.join(__dirname, "..", "..", "public");
};

export const getTempFolderPathForReport = (): string => {
  return path.resolve(process.cwd(), "public", "temp");
};
export const getUploadFolderpathForReport = (): string => {
  if (process.env.NODE_ENV === Environment.PRODUCTION)
    return path.resolve(process.cwd(), "public");
  return path.join(__dirname, "..", "..", "public");
};

export const transferImageFromUploadToTemp = (
  id: string,
  name: string,
  type: string,
): void => {
  const UPLOAD_FOLDER_PATH = path.join(
    getUploadFolderpathForUser(),
    type.toLowerCase(),
    id.toString(),
  );
  const TEMP_FOLDER_PATH = path.join(getTempFolderPathForUser(), id.toString());
  if (!fs.existsSync(TEMP_FOLDER_PATH))
    fs.mkdirSync(TEMP_FOLDER_PATH, { recursive: true });
  const imageName = path.basename(name);
  try {
    fs.renameSync(
      path.join(UPLOAD_FOLDER_PATH, imageName),
      path.join(TEMP_FOLDER_PATH, imageName),
    );
  } catch (err) {
    console.log("🚀 ~ transferImageFromUploadTOTempFolder ~ err", err);
  }
};

export const transferGuideImageFromUploadToTemp = (
  id: string,
  name: string,
  type: string,
): void => {
  const UPLOAD_FOLDER_PATH = path.join(
    getUploadFolderpathForGuide(),
    type.toLowerCase(),
    id.toString(),
  );
  const TEMP_FOLDER_PATH = path.join(getTempFolderPathForGuide(), id.toString());
  if (!fs.existsSync(TEMP_FOLDER_PATH))
    fs.mkdirSync(TEMP_FOLDER_PATH, { recursive: true });
  const imageName = path.basename(name);
  try {
    fs.renameSync(
      path.join(UPLOAD_FOLDER_PATH, imageName),
      path.join(TEMP_FOLDER_PATH, imageName),
    );
  } catch (err) {
    console.log("🚀 ~ transferImageFromUploadTOTempFolder ~ err", err);
  }
};
export const transferTravelImageFromUploadToTemp = (
  id: string,
  name: string,
  type: string,
): void => {
  const UPLOAD_FOLDER_PATH = path.join(
    getUploadFolderpathForTravel(),
    type.toLowerCase(),
    id.toString(),
  );
  const TEMP_FOLDER_PATH = path.join(getTempFolderPathForTravel(), id.toString());
  if (!fs.existsSync(TEMP_FOLDER_PATH))
    fs.mkdirSync(TEMP_FOLDER_PATH, { recursive: true });
  const imageName = path.basename(name);
  try {
    fs.renameSync(
      path.join(UPLOAD_FOLDER_PATH, imageName),
      path.join(TEMP_FOLDER_PATH, imageName),
    );
  } catch (err) {
    console.log("🚀 ~ transferImageFromUploadTOTempFolder ~ err", err);
  }
};
