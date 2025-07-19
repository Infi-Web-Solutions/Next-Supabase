// import { saveImageToUploads } from "../../../lib/saveimage";
// import  supabase  from "../../../lib/supabase/serveclient"; 
// import { NextResponse } from "next/server";


import { saveImageToUploads } from "../../../lib/saveimage";
import  supabase  from "../../../lib/supabase/serveclient";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// export async function POST(req) {
//   try {
//     const formData = await req.formData();

//     const name = formData.get("name");
//     const price = parseFloat(formData.get("price"));
//     const description = formData.get("description");
//     const stock = parseInt(formData.get("stock"));
//     const category = formData.get("category");
//     const imageFile = formData.get("image");

//     const savedFilename = await saveImageToUploads(imageFile);

//     const { data, error } = await supabase.from("products").insert([
//       {
//         name,
//         price,
//         description,
//         stock,
//         category,
//         image: savedFilename,
//       },
//     ]);

//     if (error) {
//       return NextResponse.json({ error: error.message }, { status: 400 });
//     }

//     return NextResponse.json({ message: "Product created", data }, { status: 201 });
//   } catch (err) {
//        console.log("meesgae ", err)
//     return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
 
//   }
// }


export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const price = parseFloat(formData.get("price"));
    const description = formData.get("description");
    const stock = parseInt(formData.get("stock"));
    const category = formData.get("category");
    const imageFile = formData.get("image");

    if (!name || !price || !imageFile) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const savedFilename = await saveImageToUploads(imageFile);


    const supabase = createRouteHandlerClient({ cookies });
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const host = req.headers.get("host") || "";
    const subdomain = host.split(".")[0];

    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id")
      .eq("slug", subdomain)
      .single();

    if (orgError || !org) {
      return NextResponse.json({ error: "Invalid organization/subdomain" }, { status: 400 });
    }

    const organization_id = org.id;

    const { data: insertData, error: insertError } = await supabase
      .from("products")
      .insert([
        {
          name,
          price,
          description,
          stock,
          category,
          image: savedFilename,
          organization_id,
        },
      ])
      .select();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Product created", product: insertData[0] }, { status: 201 });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const host = req.headers.get("host") || "";
    const subdomain = host.split(".")[0]; 

    const { data: org, error: orgError } = await supabase
      .from("organizations")
      .select("id")
      .eq("slug", subdomain)
      .single();

    if (orgError || !org) {
      return NextResponse.json(
        { error: "Invalid organization/subdomain" },
        { status: 400 }
      );
    }

    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .eq("organization_id", org.id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ products }, { status: 200 });
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}