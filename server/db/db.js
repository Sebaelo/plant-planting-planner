import Database from "better-sqlite3";
import { join } from "path";

const db = new Database(join(import.meta.dirname, "plant-planner.db"), {
  verbose: console.log,
});

db.pragma("foreign_keys = ON");

export default db;
