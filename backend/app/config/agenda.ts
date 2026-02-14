import Agenda, { Job } from "agenda";
import config from "../config/config";

export const agenda = new Agenda({
  db: {
    address: config.database.mongodbURI as string || "mongodb://localhost:27017/agenda-demo",
    collection: "agendaJobs",
  },
  processEvery: "5 seconds",
});