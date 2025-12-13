import { createContext, useContext, useEffect, useMemo, useState } from "react";
import api from "../utils/axiosInstance";
import { useAuthContext } from "./AuthContext";

const VideoContext = createContext(null);

export const VideoProvider = ({ children }) => {
  const { user } = useAuthContext();
  const [trending, setTrending] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTrending();
  }, []);

  const fetchTrending = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/videos/trending");
      setTrending(data.videos || []);
    } catch (error) {
      console.error("Failed to load trending", error);
    } finally {
      setLoading(false);
    }
  };

  const searchVideos = async (query) => {
    setLoading(true);
    try {
      const { data } = await api.get("/videos/search", { params: { q: query } });
      setSearchResults(data.videos || []);
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchVideo = async (id) => {
    const { data } = await api.get(`/videos/${id}`);
    return data.video;
  };

  const addView = async (id) => {
    await api.post(`/videos/${id}/view`);
  };

  const toggleLike = async (id) => {
    const { data } = await api.post(`/videos/${id}/like`);
    return data;
  };

  const toggleDislike = async (id) => {
    const { data } = await api.post(`/videos/${id}/dislike`);
    return data;
  };

  const uploadVideo = async ({ file, title, description, channelId, tags, thumbnail }) => {
    const formData = new FormData();
    formData.append("video", file);
    formData.append("title", title);
    formData.append("description", description || "");
    if (channelId) formData.append("channelId", channelId);
    if (tags) formData.append("tags", tags);
    if (thumbnail) formData.append("thumbnail", thumbnail);
    const { data } = await api.post("/videos", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    fetchTrending();
    return data.video;
  };

  const value = useMemo(
    () => ({
      trending,
      searchResults,
      loading,
      fetchTrending,
      searchVideos,
      fetchVideo,
      addView,
      toggleLike,
      toggleDislike,
      uploadVideo,
      currentUser: user,
    }),
    [trending, searchResults, loading, user]
  );

  return <VideoContext.Provider value={value}>{children}</VideoContext.Provider>;
};

export const useVideoContext = () => useContext(VideoContext);

