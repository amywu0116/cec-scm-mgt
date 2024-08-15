export default function updateQuery(obj = {}, setQuery = () => {}) {
  const newObj = {};

  Object.keys(obj).forEach((key) => {
    if (["", undefined].includes(obj[key])) {
      newObj[key] = null;
    } else {
      newObj[key] = obj[key];
    }
  });

  setQuery(newObj);
}
