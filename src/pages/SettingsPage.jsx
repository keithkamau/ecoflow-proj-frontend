import { useState } from "react";
import { authService } from "../services/authService";

export default function SettingsPage() {
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    newPassword: "",
    confirm: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    if (passwordForm.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters");
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirm) {
      setPasswordError("Passwords do not match");
      return;
    }

    setSaving(true);
    try {
      await authService.updateMe({ password: passwordForm.newPassword });
      setPasswordSuccess("Password updated successfully");
      setPasswordForm({ current: "", newPassword: "", confirm: "" });
    } catch (err) {
      setPasswordError(
        err.response?.data?.detail || "Failed to update password",
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className='max-w-2xl mx-auto px-4 py-8'>
      <h1 className='text-2xl font-bold mb-6'>Settings</h1>

      <div className='card mb-6'>
        <h2 className='text-lg font-semibold mb-4'>Change Password</h2>

        {passwordError && (
          <div className='alert alert-error mb-4'>{passwordError}</div>
        )}
        {passwordSuccess && (
          <div className='alert bg-green-100 text-green-800 mb-4'>
            {passwordSuccess}
          </div>
        )}

        <form onSubmit={handlePasswordChange}>
          <div className='space-y-4'>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Current Password
              </label>
              <input
                type='password'
                value={passwordForm.current}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, current: e.target.value })
                }
                required
                className='input w-full'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>
                New Password
              </label>
              <input
                type='password'
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({
                    ...passwordForm,
                    newPassword: e.target.value,
                  })
                }
                required
                className='input w-full'
                placeholder='At least 6 characters'
              />
            </div>
            <div>
              <label className='block text-sm font-medium mb-1'>
                Confirm New Password
              </label>
              <input
                type='password'
                value={passwordForm.confirm}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirm: e.target.value })
                }
                required
                className='input w-full'
              />
            </div>
          </div>
          <button
            type='submit'
            disabled={saving}
            className='btn btn-primary mt-6'
          >
            {saving ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>

      <div className='card'>
        <h2 className='text-lg font-semibold mb-2'>Account</h2>
        <p
          className='text-sm mb-4'
          style={{ color: "var(--color-neutral-500)" }}
        >
          Manage your account settings and notifications.
        </p>
        <div className='space-y-3'>
          <label className='flex items-center justify-between py-2'>
            <span className='text-sm'>Email notifications</span>
            <input type='checkbox' className='toggle' />
          </label>
          <label className='flex items-center justify-between py-2'>
            <span className='text-sm'>SMS notifications</span>
            <input type='checkbox' className='toggle' defaultChecked />
          </label>
        </div>
      </div>
    </div>
  );
}
