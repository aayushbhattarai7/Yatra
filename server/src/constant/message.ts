export const Message = {
  error: "Error occurred",
  notAuthorized: " You are not Authorized",
  tokenExpire: "Token expired, Please signin again",
  LoggedIn: "LoggedIn Successfully",
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
