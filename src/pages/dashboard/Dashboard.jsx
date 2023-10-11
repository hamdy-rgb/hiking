import React from "react";
import { Container, Divider, Typography } from "@mui/material";
import { Calendar } from "../../components/custom-ui/dashbaord";

const Dashboard = () => {
  return (
    <Container>
      <Typography variant="h4" color="inherit" sx={{ marginY: 2 }}>
        Calendrier
      </Typography>
      <Divider sx={{ marginY: 2 }} />
      <Calendar />
    </Container>
  );
};

export default Dashboard;
