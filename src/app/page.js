import Product from "./products/page"
import Image from "next/image";

export default function Mainpage(){
  return(
    <div>

      <div className="container-fluid p-0">
        <Image
          src="/images/banner2.jpg" // Place this in /public/images/
          alt="Banner"
          width={1920}
          height={600}
          style={{
            width: "100%",
            height: "600px",
            objectFit: "cover",
            borderRadius: "0px", // remove rounding if it's a full-width banner
          }}
        />
      </div>
  <Product />
    </div>
  )
}