import { useCallback, useEffect, useState } from "react";

const data = [
  "Apple",
  "Banana",
  "Mango",
  "Orange",
  "Peach",
  "Pineapple",
  "Strawberry",
];

const debounce = (func, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
};

const AutoComplete = () => {
  const [val, setVal] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchData = (val) => {
    return new Promise((resolve, reject) => {
      try {
        const res = data.filter(
          (d) =>
            d.toLowerCase().substring(0, val.length) === val.toLocaleLowerCase()
        );
        resolve(res);
      } catch (err) {
        console.log(err);
        reject(err);
      }
    });
  };

  const searchHandler = async (query) => {
    try {
      if (query === "") {
        setSearchedData([]);
        setLoading(false);
        return;
      }
      const res = await fetchData(query);
      setSearchedData(res);
      console.log(res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };
  const debounceSearch = useCallback(debounce(searchHandler, 300), []);

  return (
    <div>
      <input
        value={val}
        onChange={(e) => {
          const query = e.target.value;
          setVal(query);
          setLoading(true);

          debounceSearch(query);
        }}
        type="text"
        placeholder="Search..."
      />
      {loading && <div>Loading...</div>}
      {!loading && searchedData.map((s, ind) => <div key={ind}>{s}</div>)}
      {!loading && val && searchedData.length === 0 && (
        <div>No data matched.</div>
      )}
    </div>
  );
};

export default AutoComplete;
