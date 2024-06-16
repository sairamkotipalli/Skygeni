import React, { useEffect, useState } from "react";
import PieChart from "./Components/PieChart";
import "./app.css";
import BarChart from "./Components/BarChart";
import Table from "./Components/Table";
import axios from "axios";

const App = () => {
  const [data, setData] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const response = await axios.get("http://localhost:8000/data");
    setData(response.data);
  };
  const totalAcv = data.reduce((acc, curr) => acc + curr.acv, 0);

  const groupedData = data.reduce((acc, curr) => {
    const { Cust_Type, acv } = curr;
    if (!acc[Cust_Type]) {
      acc[Cust_Type] = { Cust_Type, acv: 0, percent: 0 };
    }
    acc[Cust_Type].acv += acv;
    acc[Cust_Type].percent = ((acc[Cust_Type].acv / totalAcv) * 100).toFixed(2);
    return acc;
  }, {});

  const result = Object.values(groupedData);
  const aggregatedData = data.reduce(
    (acc, { count, acv, closed_fiscal_quarter, Cust_Type }) => {
      const key = `${closed_fiscal_quarter}-${Cust_Type}`;
      if (!acc[key]) {
        acc[key] = { closed_fiscal_quarter, Cust_Type, count: 0, acv: 0 };
      }
      acc[key].count += count;
      acc[key].acv += acv;
      return acc;
    },
    {}
  );

  const resultArray = Object.values(aggregatedData);

  // Step 2: Calculate the total ACV per quarter
  const totalAcvPerQuarter = resultArray.reduce(
    (acc, { closed_fiscal_quarter, acv }) => {
      if (!acc[closed_fiscal_quarter]) {
        acc[closed_fiscal_quarter] = 0;
      }
      acc[closed_fiscal_quarter] += acv;
      return acc;
    },
    {}
  );

  // Step 3: Calculate percentage share for each customer type within the same quarter
  const finalResult = resultArray.map(
    ({ closed_fiscal_quarter, Cust_Type, count, acv }) => {
      const totalAcv = totalAcvPerQuarter[closed_fiscal_quarter];
      const percentageShare = ((acv / totalAcv) * 100).toFixed(2);
      return {
        closed_fiscal_quarter,
        Cust_Type,
        count,
        acv,
        percentageShare: `${percentageShare}%`,
      };
    }
  );
  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <BarChart data={data} />
        <div style={{ flex: 1, width: "100%", textAlign: "center" }}>
          <div>
            <PieChart data={result} />
          </div>
        </div>
      </div>
      <Table data={finalResult} />
    </div>
  );
};

export default App;
