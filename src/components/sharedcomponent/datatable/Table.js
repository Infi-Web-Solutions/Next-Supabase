"use client";

import { useEffect, useState } from "react";
import DataTable from "react-data-table-component";

export default function CustomDataTable({ title, columns, data }) {
  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState(data);

  useEffect(() => {
    const lowerSearch = search.toLowerCase();
    const filtered = data.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(lowerSearch)
    );
    setFilteredData(filtered);
  }, [search, data]);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between mb-2">
        <h4>{title}</h4>
        <input
          type="text"
          className="form-control w-25"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filteredData}
        pagination
        highlightOnHover
        responsive
        striped
        persistTableHead
        noDataComponent={<div>No matching data found.</div>}
      />
    </div>
  );
}
