"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentType = exports.RoomType = exports.Gender = exports.FileType = exports.MediaType = exports.Environment = exports.KycType = exports.RequestStatus = exports.Status = exports.Role = void 0;
var Role;
(function (Role) {
    Role["USER"] = "USER";
    Role["ADMIN"] = "ADMIN";
    Role["GUIDE"] = "GUIDE";
    Role["TRAVEL"] = "TRAVEL";
    Role["HOTEL"] = "HOTEL";
})(Role || (exports.Role = Role = {}));
var Status;
(function (Status) {
    Status["PENDING"] = "PENDING";
    Status["ACCEPTED"] = "ACCEPTED";
    Status["REJECTED"] = "REJECTED";
})(Status || (exports.Status = Status = {}));
var RequestStatus;
(function (RequestStatus) {
    RequestStatus["PENDING"] = "PENDING";
    RequestStatus["ACCEPTED"] = "ACCEPTED";
    RequestStatus["REJECTED"] = "REJECTED";
    RequestStatus["COMPLETED"] = "COMPLETED";
    RequestStatus["CANCELLED"] = "CANCELLED";
    RequestStatus["CONFIRMATION_PENDING"] = "CONFIRMATION_PENDING";
})(RequestStatus || (exports.RequestStatus = RequestStatus = {}));
var KycType;
(function (KycType) {
    KycType["CITIZENSHIP"] = "CITIZENSHIP";
    KycType["PASSPORT"] = "PASSPORT";
    KycType["VOTERCARD"] = "VOTERCARD";
})(KycType || (exports.KycType = KycType = {}));
var Environment;
(function (Environment) {
    Environment["DEVELOPMENT"] = "DEVELOPMENT";
    Environment["PRODUCTION"] = "PRODUCTION";
})(Environment || (exports.Environment = Environment = {}));
var MediaType;
(function (MediaType) {
    MediaType["PROFILE"] = "PROFILE";
    MediaType["COVER"] = "COVER";
    MediaType["PLACE"] = "PLACE";
})(MediaType || (exports.MediaType = MediaType = {}));
var FileType;
(function (FileType) {
    FileType["PASSPHOTO"] = "PASSPHOTO";
    FileType["CITIZENSHIPFRONT"] = "CITIZENSHIPFRONT";
    FileType["CITIZENSHIPBACK"] = "CITIZENSHIPBACK";
    FileType["LICENSE"] = "LICENSE";
    FileType["VEHICLEREGISTRATION"] = "VEHICLEREGISTRATION";
    FileType["PASSPORT"] = "PASSPORT";
    FileType["VOTERCARD"] = "VOTERCARD";
    FileType["HOTELPANCARD"] = "HOTELPANCARD";
})(FileType || (exports.FileType = FileType = {}));
var Gender;
(function (Gender) {
    Gender["MALE"] = "MALE";
    Gender["FEMALE"] = "FEMALE";
    Gender["NONE"] = "NONE";
})(Gender || (exports.Gender = Gender = {}));
var RoomType;
(function (RoomType) {
    RoomType["STANDARD"] = "STANDARD";
    RoomType["FAMILY"] = "FAMILY";
})(RoomType || (exports.RoomType = RoomType = {}));
var PaymentType;
(function (PaymentType) {
    PaymentType["ESEWA"] = "ESEWA";
    PaymentType["KHALTI"] = "KHALTI";
    PaymentType["CARD"] = "CARD";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
