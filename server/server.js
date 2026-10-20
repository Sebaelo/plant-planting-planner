import express from "express";
import morgan from "morgan";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(morgan(":method :url :status :response-time ms - :date"));

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
