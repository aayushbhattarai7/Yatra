"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transferImageFromUploadToTemp = exports.getUploadFolderpathForUser = exports.getTempFolderPathForUser = exports.getTempFolderPathForHotel = exports.getUploadFolderpathForHotel = exports.getTempFolderPathForTravel = exports.getUploadFolderpathForTravel = exports.getTempFolderPathForPlace = exports.getUploadFolderpathForplace = exports.getTempFolderPathForGuide = exports.getUploadFolderpathForGuide = void 0;
const path_1 = __importDefault(require("path"));
const enum_1 = require("../constant/enum");
const fs_1 = __importDefault(require("fs"));
const getUploadFolderpathForGuide = () => {
    if (process.env.NODE_ENV === enum_1.Environment.PRODUCTION)
        return path_1.default.resolve(process.cwd(), "public", "guide");
    return path_1.default.join(__dirname, "..", "..", "public", "guide");
};
exports.getUploadFolderpathForGuide = getUploadFolderpathForGuide;
const getTempFolderPathForGuide = () => {
    return path_1.default.resolve(process.cwd(), "public", "temp");
};
exports.getTempFolderPathForGuide = getTempFolderPathForGuide;
const getUploadFolderpathForplace = () => {
    `QAAA`;
    if (process.env.NODE_ENV === enum_1.Environment.PRODUCTION)
        return path_1.default.resolve(process.cwd(), "public");
    return path_1.default.join(__dirname, "..", "..", "public");
};
exports.getUploadFolderpathForplace = getUploadFolderpathForplace;
const getTempFolderPathForPlace = () => {
    return path_1.default.resolve(process.cwd(), "public", "temp");
};
exports.getTempFolderPathForPlace = getTempFolderPathForPlace;
const getUploadFolderpathForTravel = () => {
    if (process.env.NODE_ENV === enum_1.Environment.PRODUCTION)
        return path_1.default.resolve(process.cwd(), "public");
    return path_1.default.join(__dirname, "..", "..", "public");
};
exports.getUploadFolderpathForTravel = getUploadFolderpathForTravel;
const getTempFolderPathForTravel = () => {
    return path_1.default.resolve(process.cwd(), "public", "temp");
};
exports.getTempFolderPathForTravel = getTempFolderPathForTravel;
const getUploadFolderpathForHotel = () => {
    if (process.env.NODE_ENV === enum_1.Environment.PRODUCTION)
        return path_1.default.resolve(process.cwd(), "public", "hotel");
    return path_1.default.join(__dirname, "..", "..", "public", "hotel");
};
exports.getUploadFolderpathForHotel = getUploadFolderpathForHotel;
const getTempFolderPathForHotel = () => {
    return path_1.default.resolve(process.cwd(), "public", "temp");
};
exports.getTempFolderPathForHotel = getTempFolderPathForHotel;
const getTempFolderPathForUser = () => {
    return path_1.default.resolve(process.cwd(), "public", "temp");
};
exports.getTempFolderPathForUser = getTempFolderPathForUser;
const getUploadFolderpathForUser = () => {
    if (process.env.NODE_ENV === enum_1.Environment.PRODUCTION)
        return path_1.default.resolve(process.cwd(), "public");
    return path_1.default.join(__dirname, "..", "..", "public");
};
exports.getUploadFolderpathForUser = getUploadFolderpathForUser;
const transferImageFromUploadToTemp = (id, name, type) => {
    const UPLOAD_FOLDER_PATH = path_1.default.join((0, exports.getUploadFolderpathForUser)(), type.toLowerCase(), id.toString());
    const TEMP_FOLDER_PATH = path_1.default.join((0, exports.getTempFolderPathForUser)(), id.toString());
    if (!fs_1.default.existsSync(TEMP_FOLDER_PATH))
        fs_1.default.mkdirSync(TEMP_FOLDER_PATH, { recursive: true });
    const imageName = path_1.default.basename(name);
    try {
        fs_1.default.renameSync(path_1.default.join(UPLOAD_FOLDER_PATH, imageName), path_1.default.join(TEMP_FOLDER_PATH, imageName));
    }
    catch (err) {
        console.log("🚀 ~ transferImageFromUploadTOTempFolder ~ err", err);
    }
};
exports.transferImageFromUploadToTemp = transferImageFromUploadToTemp;
