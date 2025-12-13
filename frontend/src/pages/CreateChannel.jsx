import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../utils/axiosInstance";
import useAuth from "../hooks/useAuth";

const CreateChannel = () => {
  const { user, setUserProfile } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/channels", { name, description });
      if (user) {
        setUserProfile({ ...user, channel: data.channel._id });
      }
      navigate("/upload");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create channel");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg rounded-lg border border-gray-800 bg-gray-900/70 p-6">
      <h1 className="mb-4 text-xl font-semibold">Create your channel</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm text-gray-300">Channel name</label>
          <input
            className="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">Description</label>
          <textarea
            className="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
        >
          {loading ? "Creating..." : "Create Channel"}
        </button>
      </form>
    </div>
  );
};

export default CreateChannel;

