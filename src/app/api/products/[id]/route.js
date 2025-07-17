
import supabase from "../../../../lib/supabase/serveclient";

import { createServerClientWithCookies } from "@/lib/serverpayment"; // your server-side Supabase admin client
import { cookies } from 'next/headers';

import { NextResponse } from "next/server";
import path from "path";                                                                                       
import { writeFile } from "fs/promises";

export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 });
    }

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (!data) {
      return NextResponse.json({ error: "Product no sdfdst found" }, { status: 404 });
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}


// export async function PUT(req, { params }) {
//   try {
//     const formData = await req.formData();
//    const updateData = {};
//     for (const [key, value] of formData.entries()) {
//       if (key === "image" && value.size > 0) {
//         const filename = `${Date.now()}_${value.name}`;
//         const bytes = await value.arrayBuffer();
//         const buffer = Buffer.from(bytes);
//         const filePath = path.join(process.cwd(), "public", "uploads", filename);
//         await writeFile(filePath, buffer);
//         updateData.image = filename;
//       } else {
//         updateData[key] = value;
//       }
//     }

//     const { data, error } = await supabase
//       .from("products")
//       .update(updateData)
//       .eq("id", params.id)
//       .select()
//       .single();

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 500 });
//     }

//     return NextResponse.json({ success: true, data });
//   } catch (err) {
//     console.log("while updating ", err.message)
//     return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
//   }
// }


export async function PUT(req, { params }) {
 const supabase = createServerClientWithCookies();

  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data: sysUser } = await supabase
      .from("system_users")
      .select("role_id")
      .eq("id", user.id)
      .single();

    if (!sysUser) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { data: rolePermissions } = await supabase
      .from("role_permissions")
      .select("permission_id, permissions(module, action)")
      .eq("role_id", sysUser.role_id);

      console.log("permissions",rolePermissions)

    const perms = rolePermissions?.map((rp) => `${rp.permissions.module}.${rp.permissions.action}`) || [];

    if (!perms.includes("products.update")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const formData = await req.formData();
    const updateData = {};
    for (const [key, value] of formData.entries()) {
      if (key === "image" && value.size > 0) {
        const filename = `${Date.now()}_${value.name}`;
        const bytes = await value.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filePath = path.join(process.cwd(), "public", "uploads", filename);
        await writeFile(filePath, buffer);
        updateData.image = filename;
      } else {
        updateData[key] = value;
      }
    }

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", params.id)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (err) {
    console.log("while updating ", err.message);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}