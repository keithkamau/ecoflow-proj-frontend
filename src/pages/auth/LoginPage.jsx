import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export default function LoginPage() {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setDevOtp("");
    setLoading(true);

    try {
      const res = await authService.sendOTP(phone);
      if (res.data.otp) {
        setDevOtp(res.data.otp);
      }
      navigate("/otp", { state: { phone } });
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send OTP");
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
              Enter your phone number to sign in
            </p>
          </div>

          {error && <div className='alert alert-error mb-6'>{error}</div>}

          <form onSubmit={handleSubmit} className='space-y-5'>
            <div>
              <label className='label'>Phone number</label>
              <input
                type='tel'
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className='input'
                placeholder='+254 700 000 000'
              />
            </div>

            <button
              type='submit'
              disabled={loading}
              className='btn btn-primary w-full'
            >
              {loading ? "Sending code..." : "Send verification code"}
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

      {devOtp && (
        <div className='fixed bottom-4 left-4 bg-neutral-900 text-white px-5 py-3 rounded-lg shadow-lg z-50 text-sm font-mono'>
          OTP:{" "}
          <span className='font-bold tracking-wider text-primary-light'>
            {devOtp}
          </span>
          <button
            onClick={() => setDevOtp("")}
            className='ml-3 text-neutral-400 hover:text-white'
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
}
