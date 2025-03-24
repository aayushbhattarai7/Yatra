export const formatTimeDifference = (createdAt: string) => {
  if (!createdAt) return "Unknown time";

  const createdAtTime = new Date(createdAt);

  const localCreatedTime = new Date(
    createdAtTime.getFullYear(),
    createdAtTime.getMonth(),
    createdAtTime.getDate(),
    createdAtTime.getHours(),
    createdAtTime.getMinutes(),
    createdAtTime.getSeconds()
  ).getTime();

  if (isNaN(localCreatedTime)) return "Invalid date";

  const diffInMilliseconds = Date.now() - localCreatedTime;

  const diffInSeconds = Math.floor(diffInMilliseconds / 1000);
  if (diffInSeconds < 60) return `${diffInSeconds} sec ago`;

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes} min ago`;

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hrs ago`;

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} days ago`;

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) return `${diffInMonths} months ago`;

  const diffInYears = Math.floor(diffInDays / 365);
  return `${diffInYears} years ago`;
};
