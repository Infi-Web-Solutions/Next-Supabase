// import DataTableWrapper from "../../sharedcomponent/datatable/Table";
// import { useRouter } from "next/navigation";
// import { useState ,useEffect } from "react";

// export default function ProductTable({ product }) {
//   const router = useRouter();

//   const [permissions, setPermissions] = useState([]);

//   // useEffect(() => {
//   //   fetch("/api/userpermission")
//   //     .then(res => res.json())
//   //     .then(data => setPermissions(data.permissions || []))
//   //     .catch(err => console.error(err));
//   // }, []);



//    const baseColumns = [
//     {
//       name: "Product Category",
//       selector: row => row.category,
//       sortable: true,
//     },
//     {
//       name: "Image",
//       cell: row => (
//         <img
//           src={`/uploads/${row.image}`}
//           alt={row.name}
//           style={{
//             width: "60px",
//             height: "60px",
//             objectFit: "cover",
//             borderRadius: "8px",
//           }}
//         />
//       ),
//     },
//     { name: "Name", selector: row => row.name },
//     { name: "Price", selector: row => `₹${row.price}` },
//     { name: "Description", selector: row => row.description },
//   ];

//   //  Conditionally include "Action" column if permission exists
//   // const hasActionPermission = permissions.includes("product_update_product") || permissions.includes("product_delete");

//   // if (hasActionPermission) {
//     baseColumns.push({
//       name: "Action",
//       cell: row => (
//         <div className="d-flex gap-2">
//           {/* {permissions.includes("product_update_product") && ( */}
//             {/* <button
//               className="btn btn-sm btn-primary"
//               onClick={() => router.push(`/admin/products/${row._id}`)}
//             >
//               Update
//             </button> */}
//           {/* )} */}
//           {/* Uncomment if delete permission added in future */}
//           {/* {permissions.includes("product_delete") && (
//             <button
//               className="btn btn-sm btn-danger"
//               onClick={() => handleDelete(row._id)}
//             >
//               Delete
//             </button>
//           )} */}
//         </div>
//       ),
//     });
//   // }

//   return <DataTableWrapper title="Product List" columns={baseColumns} data={product} />;
// }


"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import DataTableWrapper from "../../sharedcomponent/datatable/Table";

export default function ProductTable() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [permissions, setPermissions] = useState([]);

  // ✅ Load permissions from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("permissions");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setPermissions(parsed);
      } catch (err) {
        console.error("Failed to parse permissions", err);
      }
    }
  }, []);

  // ✅ Fetch products
  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
      })
      .catch(err => console.error("Error fetching products", err));
  }, []);

  // ✅ Permission check utility
  const hasPermission = (perm) => permissions.includes(perm);

  // ✅ Columns with conditional "Update" button
  const baseColumns = useMemo(() => {
    const columns = [
      {
        name: "Category",
        selector: row => row.category,
        sortable: true,
      },
      {
        name: "Image",
        cell: row => (
          <img
            src={`/uploads/${row.image}`}
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
      { name: "Name", selector: row => row.name },
      { name: "Price", selector: row => `₹${row.price}` },
      { name: "Description", selector: row => row.description },
    ];

    // Conditionally add "Action" column
    if (hasPermission("products:update")) {
      columns.push({
        name: "Action",
        cell: row => (
          <div className="d-flex gap-2">
            <button
              className="btn btn-sm btn-primary"
              onClick={() => router.push(`/admin/products/${row.id}`)}
            >
              Update
            </button>
          </div>
        ),
      });
    }

    return columns;
  }, [permissions, router]);

  return (
    <DataTableWrapper
      title="Product List"
      columns={baseColumns}
      data={products}
    />
  );
}
