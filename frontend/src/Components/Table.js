import React from "react";
import {
  Table as MuiTable,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import "./TableStyle.css";

function Table({ data }) {
  const distinctQuarters = [
    ...new Set(data.map((item) => item.closed_fiscal_quarter)),
  ];
  const distinctCustType = [...new Set(data.map((item) => item.Cust_Type))];

  // Function to calculate the total for each quarter
  const calculateTotals = (quarter) => {
    const filteredData = data.filter(
      (item) => item.closed_fiscal_quarter === quarter
    );
    const totalCount = filteredData.reduce((acc, curr) => acc + curr.count, 0);
    const totalACV = filteredData.reduce((acc, curr) => acc + curr.acv, 0);
    return { totalCount, totalACV };
  };

  // Calculate overall totals
  const overallTotalCount = data.reduce((acc, curr) => acc + curr.count, 0);
  const overallTotalACV = data.reduce((acc, curr) => acc + curr.acv, 0);

  // Function to format numbers in American number system with $
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <TableContainer className="tableContainer">
      <MuiTable className="table" style={{ maxWidth: "100vw" }}>
        <TableHead>
          <TableRow className="tableHeader">
            <TableCell className="tableHeaderCell">
              Closed Fiscal Quarter
            </TableCell>
            {distinctQuarters.map((x) => (
              <TableCell colSpan={3} key={x} className="tableHeaderCell">
                {x}
              </TableCell>
            ))}
            <TableCell colSpan={3} className="tableHeaderCell">
              Total
            </TableCell>
          </TableRow>
          <TableRow className="tableHeader">
            <TableCell className="tableHeaderCell">Cust Type</TableCell>
            {distinctQuarters.map((x, index) => (
              <React.Fragment key={index}>
                <TableCell className="tableHeaderCell">#of Opps</TableCell>
                <TableCell className="tableHeaderCell">ACV</TableCell>
                <TableCell className="tableHeaderCell">% of Total</TableCell>
              </React.Fragment>
            ))}
            <TableCell className="tableHeaderCell">#of Opps</TableCell>
            <TableCell className="tableHeaderCell">ACV</TableCell>
            <TableCell className="tableHeaderCell">% of Total</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {distinctCustType.map((custType) => (
            <TableRow key={custType} className="tableRow">
              <TableCell className="tableCell">{custType}</TableCell>
              {distinctQuarters.map((quarter) => {
                const filteredData = data.find(
                  (item) =>
                    item.Cust_Type === custType &&
                    item.closed_fiscal_quarter === quarter
                );
                return (
                  <React.Fragment key={`${custType}-${quarter}`}>
                    <TableCell className="tableCell">
                      {filteredData ? filteredData.count : 0}
                    </TableCell>
                    <TableCell className="tableCell currencyCell">
                      {filteredData
                        ? formatCurrency(filteredData.acv)
                        : formatCurrency(0)}
                    </TableCell>
                    <TableCell className="tableCell">
                      {filteredData ? filteredData.percentageShare : 0}%
                    </TableCell>
                  </React.Fragment>
                );
              })}
              <TableCell className="tableCell">
                {data
                  .filter((item) => item.Cust_Type === custType)
                  .reduce((acc, curr) => acc + curr.count, 0)}
              </TableCell>
              <TableCell className="tableCell currencyCell">
                {formatCurrency(
                  data
                    .filter((item) => item.Cust_Type === custType)
                    .reduce((acc, curr) => acc + curr.acv, 0)
                )}
              </TableCell>
              <TableCell className="tableCell">
                {(
                  (data
                    .filter((item) => item.Cust_Type === custType)
                    .reduce((acc, curr) => acc + curr.acv, 0) /
                    overallTotalACV) *
                  100
                ).toFixed(2)}
                %
              </TableCell>
            </TableRow>
          ))}
          <TableRow className="totalRow">
            <TableCell className="tableCell">Total</TableCell>
            {distinctQuarters.map((quarter) => {
              const { totalCount, totalACV, percentageShare } =
                calculateTotals(quarter);
              return (
                <React.Fragment key={`total-${quarter}`}>
                  <TableCell className="tableCell">{totalCount}</TableCell>
                  <TableCell className="tableCell currencyCell">
                    {formatCurrency(totalACV)}
                  </TableCell>
                  <TableCell className="tableCell">100%</TableCell>
                </React.Fragment>
              );
            })}
            <TableCell className="tableCell">{overallTotalCount}</TableCell>
            <TableCell className="tableCell currencyCell">
              {formatCurrency(overallTotalACV)}
            </TableCell>
            <TableCell className="tableCell">100%</TableCell>
          </TableRow>
        </TableBody>
      </MuiTable>
    </TableContainer>
  );
}

export default Table;
