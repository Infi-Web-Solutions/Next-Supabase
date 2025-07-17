"use client";
import "./footer.css";

export default function Footer() {
  return (
    <footer className="footer bg-dark text-white mt-5 py-3 fixed">
      <div className="container text-center">
        <p className="mb-1">© {new Date().getFullYear()} ProductManager. All rights reserved.</p>
        <p className="mb-0">
          <a href="/privacy" className="text-white me-3">Privacy Policy</a>
          <a href="/terms" className="text-white">Terms of Service</a>
        </p>
      </div>
    </footer>
  );
}
