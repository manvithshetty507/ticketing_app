// components/Layout/BackToHome.jsx
import Link from 'next/link';

const BackToHome = ({ className = '' }) => (
  <div className={`mb-3 ${className}`}>
    <Link href="/" className="text-decoration-none text-muted">
      <a className="d-inline-flex align-items-center">
        <i className="bi bi-arrow-left me-1"></i>
        Home
      </a>
    </Link>
  </div>
);

export default BackToHome;