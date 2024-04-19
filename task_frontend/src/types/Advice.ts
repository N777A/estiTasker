import { UniqueIdentifier } from "@dnd-kit/core";
import { TaskId } from "./Section";

export type AdviceId = UniqueIdentifier;

export type AdviceType = {
  id: number;
  advice_text: string;
  task_id: TaskId;
}
