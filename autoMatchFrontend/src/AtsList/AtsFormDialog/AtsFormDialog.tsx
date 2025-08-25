import { Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import AtsForm from "./AtsForm/AtsForm";
import type { ApplicantTrackingSystem } from "../AtsList";

interface AtsFormDialogProps {
  handleAtsCreated: (ats: ApplicantTrackingSystem) => void;
}

const AtsFormDialog = ({ handleAtsCreated }: AtsFormDialogProps) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleDialogOpenClose = (open: boolean) => {
    setIsDialogOpen(open);
  };

  return (
    <>
      <IconButton
        onClick={() => handleDialogOpenClose(true)}
        sx={{
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100px",
          width: "100%",
          borderRadius: 0,
        }}
      >
        <AddIcon />
      </IconButton>
      <Dialog
        open={isDialogOpen}
        onClose={() => handleDialogOpenClose(false)}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle> New Applicant Tracking System </DialogTitle>
        <DialogContent>
          <AtsForm
            handleDialogOpenClose={handleDialogOpenClose}
            handleAtsCreated={handleAtsCreated}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AtsFormDialog;
