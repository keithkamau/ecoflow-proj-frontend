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

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setSubmitting(true);
    try {
      await register({ ...form, role });
      navigate("/otp", { state: { phone: form.phone } });
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className='min-h-screen flex items-center justify-center px-4'
      style={{ backgroundColor: "var(--color-primary-light)" }}
    >
      <div className='w-full max-w-[60%]'>
        <div className='card'>
          <div className='text-center mb-6'>
            <h1
              className='text-2xl font-bold'
              style={{ color: "var(--color-primary-dark)" }}
            >
              Create Account
            </h1>
            <p
              className='text-sm mt-1'
              style={{ color: "var(--color-neutral-500)" }}
            >
              Join EcoFlow today
            </p>
          </div>

          {error && <div className='alert alert-error mb-4'>{error}</div>}

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
                        : "border-neutral-200 hover:border-primary"
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
                &larr; Back
              </button>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Full Name
                  </label>
                  <input
                    type='text'
                    name='name'
                    value={form.name}
                    onChange={handleChange}
                    required
                    className='input w-full'
                    placeholder='Jane Mwangi'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Phone Number
                  </label>
                  <input
                    type='tel'
                    name='phone'
                    value={form.phone}
                    onChange={handleChange}
                    required
                    className='input w-full'
                    placeholder='+254700000000'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Email (optional)
                  </label>
                  <input
                    type='email'
                    name='email'
                    value={form.email}
                    onChange={handleChange}
                    className='input w-full'
                    placeholder='jane@example.com'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium mb-1'>
                    Password
                  </label>
                  <input
                    type='password'
                    name='password'
                    value={form.password}
                    onChange={handleChange}
                    required
                    className='input w-full'
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
            className='text-sm text-center mt-6'
            style={{ color: "var(--color-neutral-500)" }}
          >
            Already have an account?{" "}
            <Link to='/login' style={{ color: "var(--color-primary)" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
