// // app/layout.js
// import "bootstrap/dist/css/bootstrap.min.css"
// import "./globals.css"
// import LayoutWrapper from "./LayoutWrapper"
// import OAuthInsert from '@/components/SaveAuthUser'

// export default function RootLayout({ children }) {
//   return (
//     <html lang="en">
//       <body>
//         <LayoutWrapper>
//             <OAuthInsert /> {/* Keep it always mounted */}
//           <main>{children}</main>
//         </LayoutWrapper>
//       </body>
//     </html>
//   )
// }

// app/layout.js
// app/layout.js
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import LayoutWrapper from "./LayoutWrapper";
import OAuthInsert from '@/components/SaveAuthUser';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="layout-body">
        <LayoutWrapper>
          <OAuthInsert />
          <main className="layout-main">{children}</main>
        </LayoutWrapper>
      </body>
    </html>
  );
}

