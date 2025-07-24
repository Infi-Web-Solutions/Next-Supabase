

"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import DataTableWrapper from "../../sharedcomponent/datatable/Table";

export default function ProductTable() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [permissions, setPermissions] = useState([]);

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

  useEffect(() => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data.products || []);
      })
      .catch(err => console.error("Error fetching products", err));
  }, []);

  const hasPermission = (perm) => permissions.includes(perm);

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

       {
      name: "Name",
      selector: row => row.name,
      sortable: true,
      wrap: true,
    },
   
       {
      name: "Price",
      selector: row => `₹${row.price}`,
      sortable: true,
      width: "100px",
    },
 
       {
      name: "Description",
      selector: row => row.description,
      sortable: false,
      wrap: true,
      grow: 2, 
       cell: row => (
    <div
      style={{
        maxHeight: "60px",          
        overflowY: "auto",           
        whiteSpace: "normal",       
        textOverflow: "ellipsis",
      }}
    >
      {row.description}
    </div>
  ),
    },
    ];

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
