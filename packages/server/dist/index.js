import express from "express";
import Edibles from "./services/edible-svc.js";
const app = express();
const port = Number(process.env.PORT) || 3000;
const staticDir = process.env.STATIC || "../proto/public";
app.use(express.static(staticDir));
app.use(express.json());
app.get("/hello", (_req, res) => {
    res.send("Hello, World");
});
app.get("/api/edibles", (_req, res) => {
    res.send({ edibles: Edibles.getAll() });
});
app.get("/api/edibles/:id", (req, res) => {
    const { id } = req.params;
    const data = Edibles.get(String(id));
    if (data)
        res.send(data);
    else
        res.status(404).send();
});
app.listen(port, "127.0.0.1", () => {
    console.log(`Server running at http://127.0.0.1:${port}`);
});
