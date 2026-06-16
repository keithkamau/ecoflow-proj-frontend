import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { authService } from "../services/authService";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", location: "" });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        email: user.email || "",
        location: user.location || "",
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setSaving(true);

    try {
      await authService.updateMe(form);
      setSuccess("Profile updated");
      setEditing(false);
    } catch (err) {
      setError(err.response?.data?.detail || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user.name || "",
      email: user.email || "",
      location: user.location || "",
    });
    setEditing(false);
    setError("");
  };

  if (loading) return null;

  const kycBadge = {
    none: "badge-neutral",
    pending: "badge-pending",
    verified: "badge-active",
    rejected: "badge-error",
  };

  return (
    <div className='max-w-2xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>Profile</h1>

      {error && <div className='alert alert-error mb-4'>{error}</div>}
      {success && <div className='alert alert-success mb-4'>{success}</div>}

      <div className='card mb-6'>
        <div className='flex items-center gap-4 mb-6'>
          <div
            className='w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold'
            style={{ backgroundColor: "var(--color-primary)" }}
          >
            {user.name?.charAt(0)?.toUpperCase()}
          </div>
          <div>
            <h2 className='text-lg font-semibold'>{user.name}</h2>
            <span
              className={`badge text-xs ${kycBadge[user.kyc_status] || "badge-neutral"}`}
            >
              KYC: {user.kyc_status}
            </span>
          </div>
        </div>

        {!editing ? (
          <div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <div>
                <label
                  className='text-xs font-medium'
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  Phone
                </label>
                <p className='text-sm'>{user.phone}</p>
              </div>
              <div>
                <label
                  className='text-xs font-medium'
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  Email
                </label>
                <p className='text-sm'>{user.email || "—"}</p>
              </div>
              <div>
                <label
                  className='text-xs font-medium'
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  Role
                </label>
                <p className='text-sm capitalize'>{user.role}</p>
              </div>
              <div>
                <label
                  className='text-xs font-medium'
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  Location
                </label>
                <p className='text-sm'>{user.location || "—"}</p>
              </div>
              <div>
                <label
                  className='text-xs font-medium'
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  Member since
                </label>
                <p className='text-sm'>
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <label
                  className='text-xs font-medium'
                  style={{ color: "var(--color-neutral-500)" }}
                >
                  Verified
                </label>
                <p className='text-sm'>{user.verified ? "Yes" : "No"}</p>
              </div>
            </div>
            <button
              onClick={() => setEditing(true)}
              className='btn btn-primary mt-6'
            >
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className='space-y-4'>
              <div>
                <label className='label'>Name</label>
                <input
                  type='text'
                  name='name'
                  value={form.name}
                  onChange={handleChange}
                  required
                  className='input'
                />
              </div>
              <div>
                <label className='label'>Email</label>
                <input
                  type='email'
                  name='email'
                  value={form.email}
                  onChange={handleChange}
                  className='input'
                  placeholder='you@example.com'
                />
              </div>
              <div>
                <label className='label'>Location</label>
                <input
                  type='text'
                  name='location'
                  value={form.location}
                  onChange={handleChange}
                  className='input'
                  placeholder='Nairobi'
                />
              </div>
            </div>
            <div className='flex gap-3 mt-6'>
              <button
                type='submit'
                disabled={saving}
                className='btn btn-primary'
              >
                {saving ? "Saving..." : "Save"}
              </button>
              <button
                type='button'
                onClick={handleCancel}
                className='btn btn-tertiary'
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
