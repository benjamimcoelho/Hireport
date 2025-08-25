import { Box } from "@mui/material";
import "./App.css";
import MyAppBar from "./AppBar/AppBar";
import AtsList, { type ApplicantTrackingSystem } from "./AtsList/AtsList";
import { useEffect, useState } from "react";
import axios from "axios";
import AtsForm from "./AtsList/AtsFormDialog/AtsForm/AtsForm";
import Breadcrumbs from "./Breadcrumbs/Breadcrumbs";
import HireportMatcher from "./HireportMatcher/HireportMatcher";

function App() {
  const [activeAtsId, setActiveAtsId] = useState<number>(0);

  const [items, setItems] = useState<ApplicantTrackingSystem[]>([]);

  useEffect(() => {
    const BASE_URL = import.meta.env.VITE_BACKEND_API_BASE_URL;
    console.log("BASE URL", BASE_URL);
    axios
      .get<ApplicantTrackingSystem[]>(`${BASE_URL}/atss/`)
      .then((res) => {
        setItems(res.data);
        if (res.data.length > 0) setActiveAtsId(res.data[0].id);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleAtsCreated = (newAts: ApplicantTrackingSystem) => {
    setItems((prev) => [...prev, newAts]);
  };

  const handleAtsUpdated = (updatedAts: ApplicantTrackingSystem) => {
    setItems((prev) => [
      ...prev.filter((i) => i.id !== updatedAts.id),
      updatedAts,
    ]);
  };

  const handleAtsDeletion = (atsId: number) => {
    setItems((prev) => [...prev.filter((i) => i.id !== atsId)]);
    if (items.length > 0) setActiveAtsId(items[0].id);
  };

  return (
    <>
      <MyAppBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          borderBottom: "1px solid #dee2e8",
        }}
      >
        <AtsList
          activeAtsId={activeAtsId}
          setActiveAtsId={setActiveAtsId}
          atsList={items}
          handleAtsCreated={handleAtsCreated}
        />
        <Box
          sx={{
            width: "100%",
          }}
        >
          <Breadcrumbs
            atsName={items.find((i) => i.id === activeAtsId)?.name}
          />
          <Box
            sx={{
              color: "#74767d",
              display: "flex",
              flexDirection: "row",
            }}
          >
            <Box
              sx={{
                flex: 1,
                p: 10,
                maxHeight: "calc(100vh - 64px - 280px)",
                overflowY: "auto",
              }}
            >
              <AtsForm
                key={activeAtsId}
                ats={items.find((i) => i.id === activeAtsId)}
                handleAtsUpdated={handleAtsUpdated}
                handleAtsDeletion={handleAtsDeletion}
              />
            </Box>

            {
              <HireportMatcher
                key={activeAtsId}
                ats={items.find((i) => i.id === activeAtsId)}
                handleAtsUpdated={handleAtsUpdated}
              />
            }
          </Box>
        </Box>
      </Box>
    </>
  );
}

export default App;
