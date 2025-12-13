import { useEffect, useState } from "react";
import useAuth from "../hooks/useAuth";
import api from "../utils/axiosInstance";

const UserProfile = () => {
  const { user, setUserProfile } = useAuth();
  const [username, setUsername] = useState(user?.username || "");
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState(user?.avatar || "");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setUsername(user?.username || "");
    setBio(user?.bio || "");
    setAvatar(user?.avatar || "");
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    try {
      const { data } = await api.put("/auth/me", { username, bio, avatar });
      setUserProfile(data.user);
      setMessage("Profile updated");
    } catch (err) {
      setError(err.response?.data?.message || "Update failed");
    }
  };

  if (!user) return <p>Please login to view your profile.</p>;

  return (
    <div className="mx-auto max-w-xl rounded-lg border border-gray-800 bg-gray-900/70 p-6">
      <h1 className="mb-4 text-xl font-semibold">Your profile</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm text-gray-300">Username</label>
          <input
            className="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">Bio</label>
          <textarea
            className="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none"
            rows={3}
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">Avatar URL</label>
          <input
            className="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
          />
        </div>
        {message && <p className="text-sm text-green-400">{message}</p>}
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          className="rounded bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400"
        >
          Save changes
        </button>
      </form>
    </div>
  );
};

export default UserProfile;

