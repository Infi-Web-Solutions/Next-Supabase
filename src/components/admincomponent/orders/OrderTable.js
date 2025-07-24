

import DataTableWrapper from "../../sharedcomponent/datatable/Table";


export default function OrderTable({ orders }) {
  const columns = [
    { name: "Product Category", selector: row => row.productId?.category, sortable: true },
    {
      name: "Image",
      cell: row => (
        <img
          src={`/uploads/${row.productId?.image}`}
          alt={row.name}
          style={{
            width: "60px",
            height: "60px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />
      ),
    },
     {
      name: "Name",
      selector: row => row.productId?.name,
      sortable: true,
      wrap: true,
    },
    {
      name: "Price",
      selector: row => `₹${row.productId?.price}`,
      sortable: true,
      width: "100px",
    },
    {
      name: "Description",
      selector: row => row.productId?.description,
      sortable: false,
      wrap: true,
      grow: 2, 
      style: {
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
     
      },
    },
    {
      name: "Date",
      selector: row => new Date(row.createdAt).toLocaleString(),
      sortable: true,
      width: "180px",
    },
  ];

  return <DataTableWrapper title="Order List" columns={columns} data={orders} />;
}
