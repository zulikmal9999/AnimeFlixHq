import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  // Use the image directly from the movie object
  // Jikan API provides images in the movie.images object
  const imageUrl = movie?.images?.jpg?.image_url || "/no-movie.png";
  const title = movie?.title || "Unknown Title";
  const score = movie?.score;

  return (
    <Link to={`/anime/${movie.mal_id}`}>
    <div className="movie-card">
      <img
        src={imageUrl}
        alt={`Poster for ${title}`}
        className="movie-poster"
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = "/no-movie.png";
        }}
      />
      <div className="mt-4"><h3>{title}</h3></div>
      <div className="content">
        <div className="rating">
            <img src="star.svg" alt="Star Icon"></img>
         <p>{score ? score.toFixed(1): 'N/A'}</p>

        </div>
        <span>•</span>

      </div>
    </div>
    </Link>
    
  );
};

export default MovieCard;