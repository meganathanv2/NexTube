import { Link } from "react-router-dom";
import formatNumber from "../../utils/formatNumber";

const VideoCard = ({ video }) => {
  const thumbnail =
    video.thumbnail ||
    "https://dummyimage.com/640x360/1f2937/ffffff&text=NextTube+Video";

  return (
    <Link
      to={`/watch/${video._id}`}
      className="block overflow-hidden rounded-lg border border-gray-800 bg-gray-900/60 shadow hover:border-gray-700"
    >
      <div className="aspect-video w-full overflow-hidden bg-gray-800">
        <img src={thumbnail} alt={video.title} className="h-full w-full object-cover" />
      </div>
      <div className="p-3 space-y-1">
        <h3 className="font-semibold text-sm line-clamp-2">{video.title}</h3>
        <p className="text-xs text-gray-400">{video.channel?.name || "Channel"}</p>
        <p className="text-xs text-gray-500">
          {formatNumber(video.views)} views •{" "}
          {new Date(video.createdAt).toLocaleDateString()}
        </p>
      </div>
    </Link>
  );
};

export default VideoCard;

