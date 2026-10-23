import express from "express";
import morgan from "morgan";

import plantRoutes from "./routes/plantRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan(":method :url :status :response-time ms - :date"));

app.use("/api/plants", plantRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
