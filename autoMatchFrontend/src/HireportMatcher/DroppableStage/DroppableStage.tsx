import { Box, Stack, Typography } from "@mui/material";
import { stageColors } from "../../config/hireportStages";
import { useDroppable } from "@dnd-kit/core";
import type { ApplicationStage } from "../../AtsList/AtsList";
import DraggableStage from "../DraggableStage/DraggableStage";

interface DroppableStageProps {
  stage: string;
  label: string;
  mappedStages?: ApplicationStage[];
}

const DroppableStage = ({
  stage,
  label,
  mappedStages,
}: DroppableStageProps) => {
  const { isOver, setNodeRef } = useDroppable({
    id: stage,
  });

  return (
    <Box
      ref={setNodeRef}
      sx={{
        backgroundColor: stageColors[stage],
        color: "#333",
        minHeight: "50px",
        p: 2,
        transition: "all 0.2s ease-in-out",
        boxShadow: isOver ? "0 0 10px rgba(0, 0, 0, 0.2)" : "none",
        outline: isOver ? "2px dashed #4caf50" : "2px dashed transparent",
      }}
    >
      <Typography sx={{ p: 2 }}>{label}</Typography>
      <Stack direction="row" gap={2} flexWrap="wrap">
        {mappedStages?.map((s) => (
          <DraggableStage
            key={s.id}
            name={s.name}
            id={s.id}
            explanation={s.mapping?.explanation}
          />
        ))}
      </Stack>
    </Box>
  );
};

export default DroppableStage;
