export default (ISODate) => {
  const date = new Date(ISODate);
  const year = date.getFullYear();
  let month = date.getMonth() + 1; // +1 because month indexing starts from 0
  let day = date.getDate().toString();
  let hour = date.getHours();
  let minutes = date.getMinutes();

  return (
    day.toString().padStart(2, "0") + //padStart concatenates 0 if the length of the string isn't of 2 chars
    "/" +
    month.toString().padStart(2, "0") +
    "/" +
    year +
    " - " +
    hour.toString().padStart(2, "0") +
    ":" +
    minutes.toString().padStart(2, "0")
  );
};
