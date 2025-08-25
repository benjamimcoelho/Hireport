import { Box, Button } from "@mui/material";
import AtsFormDialog from "./AtsFormDialog/AtsFormDialog";

export interface ApplicantTrackingSystem {
  id: number;
  name: string;
  stages: ApplicationStage[] | null;
}

export interface ApplicationStage {
  id: number;
  name: string;
  description: string;
  mapping: ApplicationStageMapping | null;
}

export interface ApplicationStageMapping {
  id: number;
  hireport_stage: string;
  explanation: string;
}

interface AtsListProps {
  activeAtsId: number;
  setActiveAtsId: (atsId: number) => void;
  atsList: ApplicantTrackingSystem[];
  handleAtsCreated: (ats: ApplicantTrackingSystem) => void;
}

const AtsList = ({
  activeAtsId,
  setActiveAtsId,
  atsList,
  handleAtsCreated,
}: AtsListProps) => {
  return (
    <Box
      sx={{
        backgroundColor: "#34425a",
        color: "white",
        minWidth: "200px",
        maxWidth: "200px",
        minHeight: "calc(100vh - 85px)",
        maxHeight: "calc(100vh - 85px)",
        overflowY: "scroll",
      }}
    >
      <AtsFormDialog handleAtsCreated={handleAtsCreated} />

      {atsList.map((i) => {
        return (
          <Button
            key={i.id}
            onClick={() => setActiveAtsId(i.id)}
            sx={{
              color: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: i.id === activeAtsId ? "#2b384e" : undefined,
              height: "100px",
              width: "100%",
              border: "1px solid #2b384e",
            }}
          >
            {i.name}
          </Button>
        );
      })}
    </Box>
  );
};

export default AtsList;
