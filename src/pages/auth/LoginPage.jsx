import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className='min-h-screen flex flex-col lg:flex-row'>
      <div
        className='hidden lg:flex lg:w-1/2 items-center justify-center p-12'
        style={{ backgroundColor: "var(--color-primary)" }}
      >
        <div className='max-w-lg text-white'>
          <h1 className='text-5xl font-bold mb-6 tracking-tight'>EcoFlow</h1>
          <p className='text-lg leading-relaxed opacity-90'>
            Turn waste into value. Join the marketplace connecting sellers and
            recyclers across Kenya.
          </p>
        </div>
      </div>

      <div className='flex-1 flex items-center justify-center px-6 py-12 bg-white lg:bg-transparent'>
        <div className='w-full max-w-md'>
          <div className='lg:hidden text-center mb-8'>
            <h1
              className='text-3xl font-bold'
              style={{ color: "var(--color-primary)" }}
            >
              EcoFlow
            </h1>
          </div>

          <div className='mb-8'>
            <h2
              className='text-2xl font-bold mb-2'
              style={{ color: "var(--color-neutral-900)" }}
            >
              Welcome back
            </h2>
            <p style={{ color: "var(--color-neutral-500)" }}>
              Sign in to your account
            </p>
          </div>

          {error && <div className='alert alert-error mb-6'>{error}</div>}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='label'>Email</label>
              <input
                type='email'
                name='email'
                value={form.email}
                onChange={handleChange}
                required
                className='input'
                placeholder='jane@example.com'
              />
            </div>
            <div>
              <label className='label'>Password</label>
              <input
                type='password'
                name='password'
                value={form.password}
                onChange={handleChange}
                required
                className='input'
                placeholder='Your password'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='btn btn-primary w-full'
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p
            className='text-sm text-center mt-8'
            style={{ color: "var(--color-neutral-500)" }}
          >
            Don't have an account?{" "}
            <Link
              to='/register'
              className='font-semibold'
              style={{ color: "var(--color-primary)" }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
