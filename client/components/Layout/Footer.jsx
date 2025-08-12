import styles from './layout.module.css';

export default function Footer() {
  return (
    <footer className={`${styles.footer} bg-dark text-white py-5`}>
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4 mb-md-0">
            <h5>TicketMaster</h5>
            <p className="text-muted">
              Your one-stop platform for event tickets and bookings.
            </p>
          </div>
          
          <div className="col-md-2 mb-4 mb-md-0">
            <h5>Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <a href="/about" className="text-decoration-none text-muted">About Us</a>
              </li>
              <li className="mb-2">
                <a href="/contact" className="text-decoration-none text-muted">Contact</a>
              </li>
            </ul>
          </div>
          
          <div className="col-md-4">
            <h5>Subscribe</h5>
            <div className="input-group mb-3">
              <input 
                type="email" 
                className="form-control" 
                placeholder="Your email" 
              />
              <button className="btn btn-primary" type="button">
                Subscribe
              </button>
            </div>
          </div>
        </div>
        
        <hr className="my-4 bg-secondary" />
        <div className="text-center text-muted">
          © {new Date().getFullYear()} TicketMaster. All rights reserved.
        </div>
      </div>
    </footer>
  );
}