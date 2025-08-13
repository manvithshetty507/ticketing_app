import Head from 'next/head';
import styles from './../styles/Home.module.css';
import Header from '../components/Layout/Header.jsx';
import Footer from '../components/Layout/Footer.jsx';

export default function Home() {
  return (
    <>
      <Head>
        <title>TicketMaster - Event Ticketing</title>
        <meta name="description" content="Find and book tickets for events" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" type="image/x-icon" href="https://png.pngtree.com/png-vector/20240115/ourmid/pngtree-blue-website-icon-vector-png-image_11438142.png" />
      </Head>
      
      <Header />
      
      <main className={styles.container}>
        {/* Hero Section */}
        <section className={`${styles.hero} py-5`}>
          <div className="container">
            <div className="row align-items-center custom-circular-gradient-bg">
              <div className="col-md-6">
                <h1 className="display-4 fw-bold mb-4 text-black">Your Events, Our Platform</h1>
                <p className="lead mb-4 text-black">
                  Discover and book tickets for concerts, sports, and more with ease.
                </p>
                <div className="d-flex gap-3">
                  <button className="btn btn-primary btn-lg px-4">Browse Events</button>
                  <button className="btn btn-outline-secondary btn-lg px-4">Learn More</button>
                </div>
              </div>
              <div className="col-md-6 mt-4">
                <img 
                  src="https://lilacinfotech.com/lilac_assets/images/blog/best-practices-for-developing-an-effective-online-booking-app." 
                  alt="Event Illustration" 
                  className="img-fluid rounded"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className={`${styles.features} py-5 bg-light`}>
          <div className="container">
            <h2 className="text-center mb-5">Why Choose Us?</h2>
            <div className="row g-4">
              {[
                {
                  icon: 'bi-ticket-perforated',
                  title: 'Wide Selection',
                  text: 'Thousands of events to choose from'
                },
                {
                  icon: 'bi-shield-check',
                  title: 'Secure Booking',
                  text: '100% secure payment processing'
                },
                {
                  icon: 'bi-phone',
                  title: 'Mobile Friendly',
                  text: 'Book tickets on any device'
                }
              ].map((feature, index) => (
                <div key={index} className="col-md-4">
                  <div className={`${styles.featureCard} card h-100 border-0 shadow-sm`}>
                    <div className="card-body text-center p-4">
                      <i className={`bi ${feature.icon} ${styles.featureIcon}`}></i>
                      <h3 className="h5 mt-3">{feature.title}</h3>
                      <p className="text-muted">{feature.text}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </>
  );
}