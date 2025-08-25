import {
  Box,
  Button,
  DialogActions,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import type { ApplicantTrackingSystem, ApplicationStage } from "../../AtsList";
import { Add, DeleteOutlined } from "@mui/icons-material";

interface AtsFormProps {
  ats?: ApplicantTrackingSystem;
  handleDialogOpenClose?: (open: boolean) => void;
  handleAtsCreated?: (ats: ApplicantTrackingSystem) => void;
  handleAtsUpdated?: (ats: ApplicantTrackingSystem) => void;
  handleAtsDeletion?: (atsId: number) => void;
}

interface AtsFormValues {
  name: string;
  stages: Pick<ApplicationStage, "name" | "description">[];
}

const defaultValues: AtsFormValues = {
  name: "",
  stages: [{ name: "", description: "" }],
};

const AtsForm = ({
  ats,
  handleDialogOpenClose,
  handleAtsCreated,
  handleAtsUpdated,
  handleAtsDeletion,
}: AtsFormProps) => {
  const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;

  const initialValues: AtsFormValues = ats
    ? {
        name: ats.name,
        stages:
          ats.stages?.map((s) => ({
            name: s.name,
            description: s.description,
          })) || defaultValues.stages,
      }
    : defaultValues;

  const { handleSubmit, control } = useForm<AtsFormValues>({
    defaultValues: initialValues,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "stages",
  });

  const onSubmit = async (data: AtsFormValues) => {
    const endpoint = ats ? `${BASE_URL}/atss/${ats.id}/` : `${BASE_URL}/atss/`;
    const method = ats ? "PUT" : "POST";

    try {
      const response = await fetch(endpoint, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API Error:", errorData);
        alert("Failed to save ATS.");
        return;
      }

      const result = await response.json();
      console.log("Success:", result);

      if (handleDialogOpenClose) handleDialogOpenClose(false);

      if (handleAtsCreated) handleAtsCreated(result);

      if (handleAtsUpdated) handleAtsUpdated(result);
    } catch (error) {
      console.error("Submission error:", error);
      alert("An unexpected error occurred.");
    }
  };

  const handleDelete = async (atsId: number) => {
    const endpoint = `${BASE_URL}/atss/${atsId}/`;

    try {
      const response = await fetch(endpoint, {
        method: "DELETE",
      });

      if (!response.ok) {
        console.error("Failed to delete ATS:", response.status);
        alert("Failed to delete ATS.");
        return;
      }

      if (handleAtsDeletion) handleAtsDeletion(atsId);

      console.log("ATS deleted successfully.");
    } catch (error) {
      console.error("Deletion error:", error);
      alert("An unexpected error occurred while deleting the ATS.");
    }
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            label="Name"
            variant="outlined"
            required
            fullWidth
            sx={{
              mb: 4,
            }}
          />
        )}
      />

      <Typography variant="h6" gutterBottom>
        Recruitment Stages
      </Typography>

      {fields.map((field, index) => (
        <Box
          key={field.id}
          display="flex"
          flexDirection={"column"}
          gap={1}
          alignItems="center"
          mb={2}
        >
          <Stack
            direction="row"
            sx={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Typography gutterBottom>{`Stage ${index + 1}`}</Typography>
            <IconButton onClick={() => remove(index)} sx={{ ml: 1 }}>
              <DeleteOutlined />
            </IconButton>
          </Stack>

          <Controller
            name={`stages.${index}.name`}
            control={control}
            defaultValue={field.name}
            render={({ field }) => (
              <TextField
                {...field}
                required
                label={"Name"}
                variant="outlined"
                fullWidth
              />
            )}
          />
          <Controller
            name={`stages.${index}.description`}
            control={control}
            defaultValue={field.name}
            render={({ field }) => (
              <TextField
                {...field}
                label={"Description"}
                variant="outlined"
                fullWidth
                multiline
                minRows={4}
              />
            )}
          />
        </Box>
      ))}

      <Button
        type="button"
        variant="outlined"
        startIcon={<Add />}
        onClick={() => append({ name: "", description: "" })}
        sx={{ borderColor: "#333", color: "#333" }}
      >
        Add Stage
      </Button>

      {handleDialogOpenClose ? (
        <DialogActions>
          <Stack direction="row" gap={1}>
            <Button
              variant="outlined"
              onClick={() => handleDialogOpenClose(false)}
              sx={{
                borderColor: "#22baa0",
                color: "#22baa0",
              }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#22baa0",
              }}
            >
              Submit
            </Button>
          </Stack>
        </DialogActions>
      ) : (
        <Stack
          direction="row"
          gap={1}
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#22baa0",
            }}
          >
            Save changes
          </Button>
          {ats && (
            <IconButton onClick={() => handleDelete(ats.id)}>
              <DeleteOutlined />
            </IconButton>
          )}
        </Stack>
      )}
    </form>
  );
};

export default AtsForm;
