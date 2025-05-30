import {
  LabelType,
  NotesEntityType,
  NoteType,
} from "../../../models/notes.entity";

export interface createNotes {
  userId: string;
  title: string;
  content: string;
  bgColor?: string;
  banner?: string;
  isHTML: boolean;
  entityID?: string;
  entityType?: NotesEntityType;
  noteType?: NoteType;
  type?: LabelType;
}
