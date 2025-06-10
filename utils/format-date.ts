export default function formatDate(value: number | string, forInput = false) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1);
  const day = date.getDate().toString().padStart(2, "0");
  const monthMap = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  let formatted = `${day} ${monthMap[month - 1]} ${year}`;
  if (forInput) {
    formatted = `${year}-${month.toString().padStart(2, "0")}-${day}`;
  }
  return formatted;
}
