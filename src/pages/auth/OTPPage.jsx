import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { authService } from "../../services/authService";

export default function OTPPage() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = useRef([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { login } = useAuth();
  const phone = location.state?.phone;

  useEffect(() => {
    if (!phone) navigate("/login", { replace: true });
  }, [phone, navigate]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    if (pasted.length === 6) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length !== 6) {
      setError("Please enter all 6 digits");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await login(phone, code);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.detail || "Invalid OTP");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError("");
    try {
      const res = await authService.sendOTP(phone);
      if (res.data.otp) {
        setOtp(res.data.otp.split(""));
      }
    } catch (err) {
      setError("Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  if (!phone) return null;

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
              Verify Phone
            </h2>
            <p style={{ color: "var(--color-neutral-500)" }}>
              Enter the 6-digit code sent to {phone}
            </p>
          </div>

          {error && <div className='alert alert-error mb-6'>{error}</div>}

          <form onSubmit={handleSubmit}>
            <div
              className='flex gap-2 justify-center mb-6'
              onPaste={handlePaste}
            >
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputRefs.current[i] = el)}
                  type='text'
                  inputMode='numeric'
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className='w-12 h-14 text-center text-xl font-bold rounded-lg border-2 focus:border-primary focus:outline-none'
                  style={{ borderColor: "var(--color-neutral-200)" }}
                />
              ))}
            </div>

            <button
              type='submit'
              disabled={loading}
              className='btn btn-primary w-full'
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </form>

          <p
            className='text-sm text-center mt-6'
            style={{ color: "var(--color-neutral-500)" }}
          >
            Didn't get a code?{" "}
            <button
              onClick={handleResend}
              disabled={resending}
              className='font-medium'
              style={{ color: "var(--color-primary)" }}
            >
              {resending ? "Resending..." : "Resend"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
