import React, { useEffect, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import { fetchAnimeMoreInfo } from "../api's/animeApi"; // adjust path if needed
import { Button } from "@mui/material";


const AnimeInfo = () => {
  const { id } = useParams();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();
  const handleGoHome = () => {
    navigate("/");
  };

  useEffect(() => {
    const getInfo = async () => {
      setLoading(true);
      try {
        const data = await fetchAnimeMoreInfo(id);
        setInfo(data);
      } catch (err) {
        setError(err.message || "Failed to load anime info");
        console.error("Error fetching anime info:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getInfo();
    }
  }, [id]);

  if (loading) return <div className="loading-container">Loading anime info...</div>;
  if (error) return <div className="error-container">Error: {error}</div>;
  if (!info) return <div className="no-data">No information available</div>;

  //users, ranked, popularity, members, images

  return (
    <div className="anime-info-container">
      <h1>More Info for Anime ID: {id}</h1>
      <Button variant="contained" onClick={handleGoHome}>Go to Homepage</Button>
      
      {info && typeof info === 'object' ? (
        <div className="anime-more-info">
            {info.images?.jpg?.image_url && !imageError ? (
            <div className="mb-4 flex justify-center">
              <img
                src={info.images.jpg.image_url}
                alt={`${info.title || "Anime"} poster`}
                className="max-w-full h-auto rounded-lg shadow-md"
                style={{ maxWidth: "300px" }}
                onError={() => setImageError(true)}
              />
            </div>
          ) : (
            <div className="mb-4 flex justify-center">
              <p className="text-gray-400">Image not available</p>
            </div>
          )}
          {info.title ? (
            <h2 className="text-2xl font-semibold mb-2">{info.title}</h2>
          ) : (
            <p className="text-gray-400">Title not available</p>
          )}
          {info.synopsis ? (
            <p style={{ color: "white" }}>{info.synopsis}</p>
          ) : (
            <p>No additional information available for this anime.</p>
          )}
          {info.popularity ? (
            <h2 className="text-2xl font-semibold mb-2">{info.popularity}</h2>
          ) : (
            <p className="text-gray-400">popularity not available</p>
          )}
          {info.rank ? (
            <h2 className="text-2xl font-semibold mb-2">{info.rank}</h2>
          ) : (
            <p className="text-gray-400">rank not available</p>
          )}
          {info.members ? (
            <h2 className="text-2xl font-semibold mb-2">{info.members}</h2>
          ) : (
            <p className="text-gray-400">members not available</p>
          )}
          
        </div>

      ) : (
        <p>No additional information available for this anime.</p>
      )}
      
    </div>
  );
};

export default AnimeInfo;