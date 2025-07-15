// app/admin-login/page.js
"use client";

import AdminLogin from "../../components/admincomponent/Login";
import { AuthProvider } from "../../context/AuthContext"; // ✅ Correct path

export default function Login() {
  return (
    <AuthProvider>
      <div className="container py-5">
        <AdminLogin />
      </div>
    </AuthProvider>
  );
}

// // app/admin-login/page.js (or wherever your login page is)
// "use client";

// import AdminLogin from "../../components/admincomponent/Login";
// import { AuthProvider } from "../../context/AuthContext"; // ✅ import AuthProvider

// export default function LoginPage() {
//   return (
//     <AuthProvider> {/* ✅ Wrap Login with AuthProvider */}
//       <div className="container py-5">
//         <AdminLogin />
//       </div>
//     </AuthProvider>
//   );
// }
