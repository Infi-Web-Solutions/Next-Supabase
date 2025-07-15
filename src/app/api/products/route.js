import { saveImageToUploads } from "../../../lib/saveimage";
import  supabase  from "../../../lib/supabase/serveclient"; 
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const formData = await req.formData();

    const name = formData.get("name");
    const price = parseFloat(formData.get("price"));
    const description = formData.get("description");
    const stock = parseInt(formData.get("stock"));
    const category = formData.get("category");
    const imageFile = formData.get("image");

    const savedFilename = await saveImageToUploads(imageFile);

    const { data, error } = await supabase.from("products").insert([
      {
        name,
        price,
        description,
        stock,
        category,
        image: savedFilename,
      },
    ]);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ message: "Product created", data }, { status: 201 });
  } catch (err) {
       console.log("meesgae ", err)
    return NextResponse.json({ error: "Server error", details: err.message }, { status: 500 });
 
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase.from("products").select("*");

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    return NextResponse.json({ products: data }, { status: 200 });
  } catch (err) {
    console.error("Error fetching products:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}