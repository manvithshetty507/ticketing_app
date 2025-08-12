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

const SignIn = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    try {
      const response = await fetch('/api/users/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw data.errors || new Error('Signin failed');
      }

      // Redirect on success
      router.push(router.query.returnUrl || '/dashboard');
    } catch (err) {
      setErrors(Array.isArray(err) ? err : [{ message: err.message }]);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Sign In | TicketMaster</title>
      </Head>

      <div className={`${styles.authContainer} container`}>
        <div className="row justify-content-center">
          <div className="col-md-6 col-lg-5">
            <div className={`${styles.authCard} card shadow-sm`}>
              <div className="card-body p-4">
                <BackToHome />
                <h2 className="text-center mb-4">Welcome Back</h2>
                
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

                  <div className="mb-4">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <div className="text-end mt-2">
                      <Link href="/forgot-password" className="text-decoration-none small">
                        Forgot password?
                      </Link>
                    </div>
                  </div>

                  <button 
                    type="submit" 
                    className={`${styles.authButton} btn btn-primary w-100`}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Signing In...
                      </>
                    ) : 'Sign In'}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <span className="text-muted">Don't have an account? </span>
                  <Link 
                    href={{
                      pathname: '/auth/signup',
                      query: { returnUrl: router.query.returnUrl }
                    }} 
                    className="text-decoration-none"
                  >
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignIn;