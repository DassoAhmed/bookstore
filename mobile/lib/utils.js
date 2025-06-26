//this function will convert the createdAt to this format: "May 2023"
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'short' });
  const year = date.getFullYear();
  return `${month} ${year}`;
};

//this function will convert the createdAt to this format: "May 20, 2023"
export const formatDateWithDay = (dateString) => {
const date = new Date(dateString);
  const month = date.toLocaleString('default', { month: 'long' });
  const day = date.getDate();
  const year = date.getFullYear();
  return `${month} ${year}`;
}