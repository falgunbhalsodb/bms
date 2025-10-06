import { Container, Typography } from '@mui/material';
import juggujaratIcon from '../assets/juggujarat.jpeg';

export default function DashboardPage() {
  return <Container sx={{ textAlign: "center", my: 4 }}>
  <Typography variant="h3" gutterBottom>
    Java User Group Gujarat
  </Typography>
  <img
    src={juggujaratIcon}
    alt="Gujarat Banner"
    style={{ width: "50%", marginTop: 20, borderRadius: 10 }}
  />
</Container>;
}
