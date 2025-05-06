import React from "react";
import { Link } from "react-router-dom";
import { Container, Typography, Button, Box } from "@mui/material";
import { Home } from "@mui/icons-material";

const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ py: 4, textAlign: "center" }}>
      <Box sx={{ mt: 8 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ color: '#4b3f72' }}>
          Page Not Found
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          This page doesn't exist. Please return to the homepage.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<Home />}
          component={Link}
          to="/"
          sx={{ mt: 2 }}
        >
          Return to Homepage
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;