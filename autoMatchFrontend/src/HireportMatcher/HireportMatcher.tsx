import {
  Box,
  CircularProgress,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import type {
  ApplicantTrackingSystem,
  ApplicationStageMapping,
} from "../AtsList/AtsList";
import { hirePortApplicationStages } from "../config/hireportStages";
import { DndContext, type DragEndEvent } from "@dnd-kit/core";
import DroppableStage from "./DroppableStage/DroppableStage";
import DraggableStage from "./DraggableStage/DraggableStage";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import { useState } from "react";

interface HireportMatcherProps {
  ats?: ApplicantTrackingSystem;
  handleAtsUpdated?: (ats: ApplicantTrackingSystem) => void;
}

interface AiCreatedMapping extends ApplicationStageMapping {
  ats_stage_id: number;
}

const HireportMatcher = ({ ats, handleAtsUpdated }: HireportMatcherProps) => {
  const [loading, setLoading] = useState(false);

  const updateStageMapping = async (stageId: number, hireportStage: string) => {
    const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;
    try {
      const response = await fetch(`${BASE_URL}/stage-mapping/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          stage_id: stageId,
          hireport_stage: hireportStage,
          explanation: "Manual assignation",
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to update mapping");
      }

      const updated = await response.json();
      return updated;
    } catch (error) {
      console.error("Mapping error:", error);
      alert("Could not map stage.");
    }
  };

  const onDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id && ats && ats.stages) {
      const droppedStage = ats.stages.find((s) => s.id === active.id);
      if (!droppedStage) return;

      const updated = await updateStageMapping(
        droppedStage.id,
        over.id.toString()
      );

      if (updated && handleAtsUpdated) {
        handleAtsUpdated({
          ...ats,
          stages: ats.stages.map((s) =>
            s.id === droppedStage.id ? { ...s, mapping: updated } : s
          ),
        });
      }
    }
  };

  const handleAutoMatch = async () => {
    const BASE_URL = import.meta.env.VITE_BACKEND_GROK_BASE_URL;
    if (ats) {
      try {
        setLoading(true); // Start loading animation
        const response = await fetch(`${BASE_URL}/automatch/`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            atsId: ats.id,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to auto match");
        }

        const responseObject = await response.json();
        const created: AiCreatedMapping[] = responseObject.created;
        if (ats && handleAtsUpdated) {
          handleAtsUpdated({
            ...ats,
            stages:
              ats.stages?.map((s) => {
                return {
                  ...s,
                  mapping: created.find((m) => m.ats_stage_id === s.id) || null,
                };
              }) || [],
          });
        }
      } catch (error) {
        console.error("Auto match error:", error);
        alert("Could not auto match stages");
      } finally {
        setLoading(false); // Stop loading animation
      }
    }
  };

  return (
    ats && (
      <DndContext onDragEnd={onDragEnd}>
        <Box
          sx={{
            width: "20%",
            border: "1px solid #dee2e8",
            minHeight: "calc(100vh - 64px - 130px)",
            maxHeight: "calc(100vh - 64px - 130px)",
            overflowY: "scroll",
          }}
        >
          <Stack
            direction="row"
            sx={{
              display: "flex",
              justifyContent: "space-between",
              backgroundColor: "#e9edf2",
              alignItems: "center",
              color: "#74767d",
              p: 2,
            }}
          >
            <Typography variant="h6" color="#333">
              ATS to Hireport Hiring Stages Mapping
            </Typography>
            <Tooltip title="Auto Match using AI">
              <IconButton onClick={handleAutoMatch}>
                <AutoFixHighIcon />
              </IconButton>
            </Tooltip>
          </Stack>

          {/* Show loading spinner when AI is processing */}
          {loading ? (
            <Box sx={{ textAlign: "center", padding: 2 }}>
              <CircularProgress
                sx={{
                  color: "#22baa0",
                }}
              />
              <Typography>Processing...</Typography>
            </Box>
          ) : (
            <Stack
              direction="column"
              gap={2}
              sx={{
                p: 2,
                backgroundColor: "#fff",
                height: "100%",
              }}
            >
              {ats.stages && (
                <Stack flexWrap="wrap" direction={"row"} gap={2}>
                  {ats.stages
                    .filter((s) => !s.mapping)
                    .map((s) => {
                      return (
                        <DraggableStage key={s.id} name={s.name} id={s.id} />
                      );
                    })}
                </Stack>
              )}
              {Object.entries(hirePortApplicationStages).map(
                ([stage, label]) => {
                  const mappedStages = ats.stages?.filter(
                    (s) => s.mapping && s.mapping.hireport_stage === stage
                  );
                  return (
                    <DroppableStage
                      key={stage}
                      stage={stage}
                      label={label}
                      mappedStages={mappedStages}
                    />
                  );
                }
              )}
            </Stack>
          )}
        </Box>
      </DndContext>
    )
  );
};

export default HireportMatcher;
