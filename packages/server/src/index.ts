import express, { Request, Response } from "express";
import { connect } from "./services/mongo.ts";
import edibles from "./routes/edibles.ts";
import auth, { authenticateUser } from "./routes/auth.ts";

const app = express();
const port = Number(process.env.PORT) || 3000;
const staticDir = process.env.STATIC || "../proto/public";

connect("foraging");

app.use(express.static(staticDir));
app.use(express.json());

app.use("/auth", auth);
app.use("/api/edibles", authenticateUser, edibles);

app.get("/hello", (_req: Request, res: Response) => {
  res.send("Hello, World");
});

app.listen(port, "0.0.0.0", () => {
  console.log(`Server running at http://0.0.0.0:${port}`);
});