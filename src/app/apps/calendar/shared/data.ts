import { EventInput } from "@fullcalendar/core";
import { ExternalEvent } from "./event.model";

export const CALENDAREVENTS: EventInput[] = [
  {
    id: "1",
    title: "Reunión con el Raquel",
    start: new Date().setDate(new Date().getDate() + 2),
    end: new Date().setDate(new Date().getDate() + 4),
    classNames: ["bg-warning"],
  },
  {
    id: "2",
    title: "Participante Pepito",
    start: new Date(),
    classNames: ["bg-success"],
  },
  {
    id: "3",
    title: "Participante Julanito",
    start: new Date().setDate(new Date().getDate() + 2),
    classNames: ["bg-info"],
  },
  {
    id: "4",
    title: "Seguimiento con Diana",
    start: new Date().setDate(new Date().getDate() + 4),
    end: new Date().setDate(new Date().getDate() + 5),
    classNames: ["bg-primary"],
  },
];

export const EXTERNALEVENTS: ExternalEvent[] = [
  {
    id: 1,
    title: "Cita con Participante",
    type: "success",
  },
  {
    id: 2,
    title: "Reunión",
    type: "info",
  },
  {
    id: 3,
    title: "Documentación",
    type: "warning",
  },
  {
    id: 4,
    title: "Documentación",
    type: "danger",
  },
];
