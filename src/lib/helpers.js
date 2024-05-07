// Formats a string to lowercase, trims leading/trailing whitespaces,
// and replaces spaces with hyphens.
export function slugifyString(string) {
  if (string === "") return "";
  let formattedString = string.toLowerCase().trim();
  return formattedString.replace(/\s+/g, "-");
}

// Formats a number with commas for thousands separator
// and a specified number of decimal places.
export const numericFormat = (number, decimalNumbers = 2) => {
  if (!number) return "0.00";
  return number
    .toFixed(decimalNumbers)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
};
