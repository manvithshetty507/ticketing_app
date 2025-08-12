import { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import styles from '../../styles/Auth.module.css';
import BackToHome from '../../components/BackToHome';

export const getServerSideProps = async (context) => {
  // Check for existing auth cookie
  const token = context.req.cookies.token;
  
  if (token) {
    return {
      redirect: {
        destination: '/dashboard',
        permanent: false,
      },
    };
  }

  return { props: {} };
};

const SignUp = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors([]);

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setErrors([{ message: 'Passwords do not match' }]);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data.errors || new Error('Signup failed');
      }

      // Redirect on success
      router.push('/dashboard');
    } catch (err) {
      setErrors(Array.isArray(err) ? err : [{ message: err.message }]);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign Up | TicketMaster</title>
      </Head>

      <div className={`${styles.authContainer} container`}>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className={`${styles.authCard} card shadow-sm`}>
              <div className="card-body p-4">
                <BackToHome />
                <h2 className="text-center mb-4">Create Account</h2>
                
                {errors.length > 0 && (
                  <div className="alert alert-danger">
                    <ul className="mb-0">
                      {errors.map((error, index) => (
                        <li key={index}>{error.message}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      minLength="6"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      minLength="6"
                      required
                    />
                  </div>

                  <button 
                    type="submit" 
                    className={`${styles.authButton} btn btn-primary w-100`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : 'Sign Up'}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <span className="text-muted">Already have an account? </span>
                  <Link href="/auth/signin" className="text-decoration-none">Sign In</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;