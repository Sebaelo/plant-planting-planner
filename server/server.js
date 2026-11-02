import express from "express";
import morgan from "morgan";
import path from "node:path";

import plantRoutes from "./routes/plantRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan(":method :url :status :response-time ms - :date"));
app.use(express.static(path.join(import.meta.dirname, "../client/")));

app.use("/api/plants", plantRoutes);
app.use("/api/category", categoryRoutes);

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
