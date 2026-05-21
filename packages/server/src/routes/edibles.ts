import express, { Request, Response } from "express";
import { Edible } from "../models/index.ts";
import Edibles from "../services/edible-svc.ts";

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  Edibles.index()
    .then((list: Edible[]) => {
      res.send({ count: list.length, edibles: list });
    })
    .catch((err) => res.status(500).send(err));
});

router.get("/:id", (req: Request, res: Response) => {
  const { id } = req.params;

  Edibles.get(String(id))
    .then((edible: Edible | undefined) => {
      if (!edible) res.status(404).send();
      else res.send(edible);
    })
    .catch((err) => res.status(500).send(err));
});

export default router;