import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const roles = [
  {
    value: "seller",
    label: "Seller",
    description: "I want to sell recyclable waste",
  },
  {
    value: "recycler",
    label: "Recycler",
    description: "I want to buy and process waste",
  },
];

export default function RegisterPage() {
  const [step, setStep] = useState(0);
  const [role, setRole] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [devOtp, setDevOtp] = useState("");
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRoleSelect = (value) => {
    setRole(value);
    setError("");
  };

  const handleNext = () => {
    if (!role) {
      setError("Please select a role");
      return;
    }
    setStep(1);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setDevOtp("");

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      const res = await register({ ...form, role });
      if (res.data?.otp) {
        setDevOtp(res.data.otp);
      }
      navigate("/otp", { state: { phone: form.phone } });
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setSubmitting(false);
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
              Create Account
            </h2>
            <p style={{ color: "var(--color-neutral-500)" }}>
              Join EcoFlow today
            </p>
          </div>

          {error && <div className='alert alert-error mb-6'>{error}</div>}

          {step === 0 && (
            <>
              <p
                className='text-sm mb-4'
                style={{ color: "var(--color-neutral-500)" }}
              >
                I want to...
              </p>
              <div className='space-y-3'>
                {roles.map((r) => (
                  <button
                    key={r.value}
                    type='button'
                    onClick={() => handleRoleSelect(r.value)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-colors ${
                      role === r.value
                        ? "border-primary bg-primary-light"
                        : "border-neutral-200"
                    }`}
                    style={{
                      borderColor:
                        role === r.value
                          ? "var(--color-primary)"
                          : "var(--color-neutral-200)",
                      backgroundColor:
                        role === r.value
                          ? "var(--color-primary-light)"
                          : "white",
                    }}
                  >
                    <span className='font-medium block'>{r.label}</span>
                    <span
                      className='text-sm'
                      style={{ color: "var(--color-neutral-500)" }}
                    >
                      {r.description}
                    </span>
                  </button>
                ))}
              </div>
              <button
                onClick={handleNext}
                className='btn btn-primary w-full mt-6'
              >
                Continue
              </button>
            </>
          )}

          {step === 1 && (
            <form onSubmit={handleSubmit}>
              <button
                type='button'
                onClick={() => setStep(0)}
                className='text-sm mb-4 flex items-center gap-1'
                style={{ color: "var(--color-primary)" }}
              >
                ← Back
              </button>

              <div className='space-y-4'>
                <div>
                  <label className='label'>Full Name</label>
                  <input
                    type='text'
                    name='name'
                    value={form.name}
                    onChange={handleChange}
                    required
                    className='input'
                    placeholder='Jane Mwangi'
                  />
                </div>
                <div>
                  <label className='label'>Phone Number</label>
                  <input
                    type='tel'
                    name='phone'
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className='input'
                    placeholder='+254700000000'
                  />
                </div>
                <div>
                  <label className='label'>Email (optional)</label>
                  <input
                    type='email'
                    name='email'
                    value={form.email}
                    onChange={handleChange}
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
                    placeholder='At least 6 characters'
                  />
                </div>
              </div>

              <button
                type='submit'
                disabled={submitting}
                className='btn btn-primary w-full mt-6'
              >
                {submitting ? "Creating account..." : "Create Account"}
              </button>
            </form>
          )}

          <p
            className='text-sm text-center mt-8'
            style={{ color: "var(--color-neutral-500)" }}
          >
            Already have an account?{" "}
            <Link
              to='/login'
              className='font-semibold'
              style={{ color: "var(--color-primary)" }}
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {devOtp && (
        <div className='fixed bottom-4 left-4 bg-neutral-900 text-white px-5 py-3 rounded-lg shadow-lg z-50 text-sm font-mono'>
          OTP:{" "}
          <span
            className='font-bold tracking-wider'
            style={{ color: "var(--color-primary-light)" }}
          >
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
