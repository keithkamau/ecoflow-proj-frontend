import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await authService.sendOTP(phone);
      navigate("/otp", { state: { phone } });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center px-4'
      style={{ backgroundColor: "var(--color-primary-light)" }}
    >
      <div className='w-full max-w-[50%]'>
        <div className='card'>
          <div className='text-center mb-6'>
            <h1
              className='text-2xl font-bold'
              style={{ color: "var(--color-primary-dark)" }}
            >
              Welcome Back
            </h1>
            <p
              className='text-sm mt-1'
              style={{ color: "var(--color-neutral-500)" }}
            >
              Sign in to your EcoFlow account
            </p>
          </div>

          {error && <div className='alert alert-error mb-4'>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className='mb-4'>
              <label className='block text-sm font-medium mb-1'>
                Phone Number
              </label>
              <input
                type='tel'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className='input w-full'
                placeholder='+254700000000'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='btn btn-primary w-full'
            >
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>

          <p
            className='text-sm text-center mt-6'
            style={{ color: "var(--color-neutral-500)" }}
          >
            Don't have an account?{" "}
            <Link to='/register' style={{ color: "var(--color-primary)" }}>
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
