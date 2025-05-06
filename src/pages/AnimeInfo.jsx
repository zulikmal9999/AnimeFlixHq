import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchAnimeMoreInfo } from "../api's/animeApi";
import NotFound from "../pages/NotFound";
import { 
  Button, 
  Typography, 
  Box, 
  Paper, 
  Container, 
  Grid, 
  Chip, 
  Divider, 
  Skeleton, 
  Alert, 
  Card, 
  CardMedia, 
  CardContent 
} from "@mui/material";
import { Home, Star, Public, EmojiEvents, Group } from "@mui/icons-material";

// Reusable component for displaying anime stats
const StatItem = ({ icon, label, value, color = "primary" }) => {
  if (!value) return null;
  
  return (
    <Box display="flex" alignItems="center" mb={1}>
      {icon}
      <Typography variant="body1" color="text.secondary" ml={1}>
        {label}:
      </Typography>
      <Chip 
        label={value} 
        color={color} 
        size="small" 
        sx={{ ml: 1 }} 
      />
    </Box>
  );
};

const InfoField = ({ label, value, variant = "body1" }) => {
  if (!value) return null;
  
  return (
    <Box mb={2}>
      <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
        {label}
      </Typography>
      <Typography variant={variant} color="text.primary">
        {value}
      </Typography>
    </Box>
  );
};

const AnimeInfo = () => {
  const { id } = useParams();
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [imageError, setImageError] = useState(false);
  const navigate = useNavigate();

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

  // Loading state
  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Skeleton variant="rectangular" width={40} height={40} />
            <Skeleton variant="text" width={200} height={40} sx={{ ml: 2 }} />
          </Box>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={4}>
              <Skeleton variant="rectangular" height={400} />
            </Grid>
            <Grid item xs={12} sm={8}>
              <Skeleton variant="text" height={60} />
              <Skeleton variant="rectangular" height={200} sx={{ mt: 2 }} />
              <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={4}>
                  <Skeleton variant="text" height={30} />
                </Grid>
                <Grid item xs={4}>
                  <Skeleton variant="text" height={30} />
                </Grid>
                <Grid item xs={4}>
                  <Skeleton variant="text" height={30} />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          Error: {error}
        </Alert>
        <Button 
          variant="contained" 
          startIcon={<Home />} 
          onClick={() => navigate("/")}
        >
          Return to Homepage
        </Button>
      </Container>
    );
  }

  // No data state
  if (!info) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="info">No information available for this anime.</Alert>
        <Button 
          variant="contained" 
          startIcon={<Home />} 
          onClick={() => navigate("/")}
          sx={{ mt: 2 }}
        >
          Return to Homepage
        </Button>
      </Container>
    );
  }

  // Destructure needed properties with defaults
  const { 
    title = "Unknown Title", 
    synopsis = "No description available", 
    images = {}, 
    rank, 
    popularity, 
    members,
    score,
    genres = [],
    status,
    aired,
    studios = [],
    episodes
  } = info;

  const imageUrl = images?.jpg?.image_url;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3, bgcolor: "#f8f9fa" }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" sx={{ color: '#4b3f72' }}>
           <span className="text-gradient"> Anime Details</span>
          </Typography>
          <Button 
            variant="contained" 
            startIcon={<Home />} 
            onClick={() => navigate("/")}
          >
            Back to Homepage
          </Button>
        </Box>

        <Grid container spacing={2}>
          {/* Left column - Image and quick stats */}
          <Grid item size={4}>
            <Card elevation={2}>
              {imageUrl && !imageError ? (
                <CardMedia
                  component="img"
                  image={imageUrl}
                  alt={`${title} poster`}
                  sx={{ 
                    height: "auto",
                    maxHeight: 500,
                    objectFit: "contain"
                  }}
                  onError={() => setImageError(true)}
                />
              ) : (
                <Box 
                  sx={{ 
                    height: 300, 
                    display: "flex", 
                    alignItems: "center", 
                    justifyContent: "center",
                    bgcolor: "#e0e0e0"
                  }}
                >
                  <Typography color="text.secondary">
                    Image not available
                  </Typography>
                </Box>
              )}

              <CardContent>
                
                <Box mt={0}>
                  <StatItem 
                    icon={<Star color="warning" />} 
                    label="Score" 
                    value={score} 
                    color="warning"
                  />
                  <StatItem 
                    icon={<EmojiEvents color="secondary" />} 
                    label="Rank" 
                    value={rank} 
                    color="secondary"
                  />
                  <StatItem 
                    icon={<Public color="info" />} 
                    label="Popularity" 
                    value={popularity} 
                    color="info"
                  />
                  <StatItem 
                    icon={<Group color="success" />} 
                    label="Members" 
                    value={members ? members.toLocaleString() : null} 
                    color="success"
                  />
                </Box>

                {genres.length > 0 && (
                  <Box mt={2}>
                    <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                      Genres
                    </Typography>
                    <Box display="flex" flexWrap="wrap" gap={1}>
                      {genres.map(genre => (
                        <Chip 
                          key={genre.mal_id} 
                          label={genre.name} 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  </Box>
                )}
              </CardContent>
            </Card>
          </Grid>

          {/* Right column - Details */}
          <Grid item size={8}>
            <Card elevation={2} sx={{ height: "100%" }}>
              <CardContent>
                <InfoField 
                  label="Synopsis" 
                  value={synopsis} 
                />

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <InfoField 
                      label="Status" 
                      value={status} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoField 
                      label="Episodes" 
                      value={episodes} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoField 
                      label="Aired" 
                      value={aired?.string} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <InfoField 
                      label="Studios" 
                      value={studios.map(studio => studio.name).join(", ")} 
                    />
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default AnimeInfo;