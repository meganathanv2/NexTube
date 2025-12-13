import { useEffect, useMemo } from "react";
import { useLocation } from "react-router-dom";
import VideoCard from "../components/VideoCard/VideoCard";
import { useVideoContext } from "../context/VideoContext";

const Home = () => {
  const { trending, searchResults, loading, fetchTrending, searchVideos } =
    useVideoContext();
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search).get("q") || "", [location]);

  useEffect(() => {
    if (query) {
      searchVideos(query);
    } else {
      fetchTrending();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const videos = query ? searchResults : trending;

  return (
    <div>
      <div className="mb-4">
        <h1 className="text-xl font-semibold">
          {query ? `Results for "${query}"` : "Trending"}
        </h1>
      </div>
      {loading && <p className="mb-4 text-sm text-gray-400">Loading videos...</p>}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {videos.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
        {!loading && videos.length === 0 && (
          <p className="text-gray-400">No videos found.</p>
        )}
      </div>
    </div>
  );
};

export default Home;

