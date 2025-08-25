import { useDraggable } from "@dnd-kit/core";
import { Box, Tooltip, Typography } from "@mui/material";
import InfoOutlineIcon from "@mui/icons-material/InfoOutline";

interface DraggableStageProps {
  name: string;
  id: number;
  explanation?: string;
}

const DraggableStage = ({ name, id, explanation }: DraggableStageProps) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: id,
  });
  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <Box
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      sx={{
        display: "flex",
        flexDirection: "row",
        gap: 1,
        p: 1,
        backgroundColor: "#34425a",
        color: "#fff",
        cursor: "grab",
        transition: "box-shadow 0.1s ease, transform 0.1s ease",
        "&:hover": {
          boxShadow: "0 0 0 2px rgba(0, 0, 0, 0.2)",
          transform: "scale(1.03)",
        },
        "&:active": {
          cursor: "grabbing",
        },
      }}
    >
      <Typography>{name}</Typography>
      {explanation && (
        <Tooltip title={explanation}>
          <InfoOutlineIcon />
        </Tooltip>
      )}
    </Box>
  );
};

export default DraggableStage;
