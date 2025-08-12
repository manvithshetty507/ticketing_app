import Link from 'next/link';
import styles from './layout.module.css';

export default function Header() {
  return (
    <header className={`${styles.header} py-3`}>
      <nav className="container d-flex justify-content-between align-items-center">
        <Link href="/" className="text-decoration-none">
          <span className="fw-bold fs-4 text-white">
            <i className="bi bi-ticket-perforated me-2"></i>
            TicketMaster
          </span>
        </Link>
        
        <div className="d-flex gap-4">
          <Link href="/auth/signin" passHref legacyBehavior>
            <a className="btn btn-primary text-white">Sign In</a>
          </Link>
          <Link href="/auth/signup" passHref legacyBehavior>
            <a className="btn btn-primary text-white">Sign Up</a>
          </Link>
        </div>
      </nav>
    </header>
  );
}