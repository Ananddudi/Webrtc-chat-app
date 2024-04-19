export const d_formate = (newdate) => {
  const date = new Date(newdate);
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: false,
  };

  const formattedDate = date.toLocaleDateString("en-US", options);
  return formattedDate.replace(",", "");
};

export const time_formate = (newdate) => {
  const date = new Date(newdate);
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12; // Convert to 12-hour format
  const formattedTime = `${formattedHours}:${minutes} ${ampm}`;
  return formattedTime;
};
