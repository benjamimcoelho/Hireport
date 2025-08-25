import { Box, Typography } from "@mui/material";

interface BreadCrumbsProps {
  atsName?: string;
}
const Breadcrumbs = ({ atsName }: BreadCrumbsProps) => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        backgroundColor: "#e9edf2",
        color: "#74767d",
        maxHeight: "100px",
        pl: 4,
        py: 2,
        borderBottom: "1px solid #dee2e8",
      }}
    >
      <Typography
        sx={{
          fontSize: "24px",
        }}
      >
        {atsName || "Dashboard"}
      </Typography>
      <Typography>Home / Dashboard</Typography>
    </Box>
  );
};

export default Breadcrumbs;
