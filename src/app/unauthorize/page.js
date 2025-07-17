export default function UnauthorizedPage() {
  return (
    <div className="container py-5 text-center">
      <h1 className="text-danger">Unauthorized Access</h1>
      <p>You do not have permission to view this page.</p>
      <a href="/" className="btn btn-primary mt-3">Go to Home</a>
    </div>
  );
}
