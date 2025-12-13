import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useVideoContext } from "../context/VideoContext";

const UploadVideo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { uploadVideo } = useVideoContext();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState("");
  const [file, setFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please select a video file");
      return;
    }
    if (!user?.channel) {
      setError("Create a channel before uploading");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const video = await uploadVideo({
        file,
        title,
        description,
        channelId: user.channel,
        tags,
      });
      navigate(`/watch/${video._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl rounded-lg border border-gray-800 bg-gray-900/70 p-6">
      <h1 className="mb-4 text-xl font-semibold">Upload a video</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="text-sm text-gray-300">Title</label>
          <input
            className="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">Description</label>
          <textarea
            className="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">Tags (comma separated)</label>
          <input
            className="mt-1 w-full rounded border border-gray-700 bg-gray-800 px-3 py-2 text-sm focus:outline-none"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
          />
        </div>
        <div>
          <label className="text-sm text-gray-300">Video File</label>
          <input
            type="file"
            accept="video/*"
            className="mt-1 w-full text-sm text-gray-200"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-400 disabled:opacity-60"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>
    </div>
  );
};

export default UploadVideo;

