"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.booked =
  exports.cancelRequest =
  exports.rejectRequest =
  exports.bookRequestMessage =
  exports.registeredMessage =
  exports.updatedMessage =
  exports.deletedMessage =
  exports.createdMessage =
  exports.Message =
    void 0;
exports.Message = {
  error: "Error occurred",
  notAuthorized: " You are not Authorized",
  tokenExpire: "Token expired, Please signin again",
  LoggedIn: "LoggedIn Successfully",
  priceSent: "Price sent successfully",
  locationSent: "Location sent successfully",
};
const createdMessage = (title) => {
  return `${title} created Successfully`;
};
exports.createdMessage = createdMessage;
const deletedMessage = (title) => {
  return `${title} deleted Successfully`;
};
exports.deletedMessage = deletedMessage;
const updatedMessage = (title) => {
  return `${title} updated Successfully`;
};
exports.updatedMessage = updatedMessage;
const registeredMessage = (title) => {
  return `${title} registered successfully`;
};
exports.registeredMessage = registeredMessage;
const bookRequestMessage = (title) => {
  return `${title} booking request sent successfully`;
};
exports.bookRequestMessage = bookRequestMessage;
const rejectRequest = (title) => {
  return ` Booking request rejected by ${title}`;
};
exports.rejectRequest = rejectRequest;
const cancelRequest = (title) => {
  return `${title} booking request cancelled successfully`;
};
exports.cancelRequest = cancelRequest;
const booked = (title) => {
  return `${title} booked successfully`;
};
exports.booked = booked;
