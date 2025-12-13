import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useVideoContext } from "../context/VideoContext";
import formatNumber from "../utils/formatNumber";

const WatchVideo = () => {
  const { id } = useParams();
  const { fetchVideo, addView, toggleLike, toggleDislike } = useVideoContext();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadVideo = async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchVideo(id);
        setVideo(data);
        addView(id);
      } catch (err) {
        setError("Could not load video");
      } finally {
        setLoading(false);
      }
    };
    loadVideo();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleLike = async () => {
    const data = await toggleLike(id);
    setVideo((prev) => ({ ...prev, likes: Array(data.likes).fill(0), dislikes: Array(data.dislikes).fill(0) }));
  };

  const handleDislike = async () => {
    const data = await toggleDislike(id);
    setVideo((prev) => ({ ...prev, likes: Array(data.likes).fill(0), dislikes: Array(data.dislikes).fill(0) }));
  };

  if (loading) return <p>Loading video...</p>;
  if (error) return <p className="text-red-400">{error}</p>;
  if (!video) return <p>No video found.</p>;

  const videoSrc = video.url.startsWith("http")
    ? video.url
    : `http://localhost:5000/${video.url}`.replace(/\\+/g, "/");

  return (
    <div className="space-y-4">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
        <video src={videoSrc} className="h-full w-full" controls />
      </div>
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">{video.title}</h1>
        <div className="flex items-center justify-between text-sm text-gray-400">
          <div className="flex items-center gap-3">
            <span>{video.channel?.name || "Channel"}</span>
            <span>{formatNumber(video.views)} views</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleLike}
              className="rounded bg-gray-800 px-3 py-1 text-xs font-semibold hover:bg-gray-700"
            >
              👍 {formatNumber(video.likes?.length || 0)}
            </button>
            <button
              onClick={handleDislike}
              className="rounded bg-gray-800 px-3 py-1 text-xs font-semibold hover:bg-gray-700"
            >
              👎 {formatNumber(video.dislikes?.length || 0)}
            </button>
          </div>
        </div>
        <p className="text-sm text-gray-200">{video.description}</p>
      </div>
    </div>
  );
};

export default WatchVideo;

