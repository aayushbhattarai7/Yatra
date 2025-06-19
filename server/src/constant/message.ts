export const Message = {
  error: "Error occurred",
  notAuthorized: " You are not Authorized",
  tokenExpire: "Token expired, Please signin again",
  LoggedIn: "LoggedIn Successfully",
  priceSent: "Price sent successfully",
  locationSent: "Location sent successfully",
};
export const createdMessage = (title: string) => {
  return `${title} created Successfully`;
};
export const deletedMessage = (title: string) => {
  return `${title} deleted Successfully`;
};
export const updatedMessage = (title: string) => {
  return `${title} updated Successfully`;
};

export const registeredMessage = (title: string) => {
  return `${title} registered successfully`;
};
export const bookRequestMessage = (title: string) => {
  return `${title} booking request sent successfully`;
};
export const rejectRequest = (title: string) => {
  return ` Booking request rejected by ${title}`;
};
export const acceptRequest = (title: string) => {
  return ` Booking request accepted by ${title}`;
};
export const cancelRequest = (title: string) => {
  return `${title} booking request cancelled successfully`;
};
export const booked = (title: string) => {
  return `${title} booked successfully`;
};
