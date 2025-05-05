
import React from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
} from "@mui/material";
import StarIcon from '@mui/icons-material/Star';

const MovieCard = ({ anime }) => {
  const imageUrl = anime?.images?.jpg?.image_url || "/no-anime.png";
  const title = anime?.title || "Unknown Title";
  const score = anime?.score;

  return (
    <Link to={`/anime/${anime.mal_id}`} style={{ textDecoration: 'none' }}>
      <Card
        sx={{
          width: 225,
          textAlign: "center",
          borderRadius: 2,
          overflow: "hidden",
          boxShadow: 3,
          "&:hover": { boxShadow: 6 },
        }}
      >
        <CardMedia
          component="img"
          height="340"
          image={imageUrl}
          alt={`Poster for ${title}`}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/no-anime.png";
          }}
        />
        <CardContent>
          <Typography variant="subtitle1" fontWeight="bold" noWrap>
            {title}
          </Typography>
          <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            mt={1}
            gap={0.5}
          >
            <StarIcon sx={{ color: "#FFD700", fontSize: 18 }} />
            <Typography variant="body2">
              {score ? score.toFixed(1) : "N/A"}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Link>
  );
};

export default MovieCard;
