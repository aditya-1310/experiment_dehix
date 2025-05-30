import {
  LabelType,
  NotesEntityType,
  NoteType,
} from "../../../models/notes.entity";

export interface PutNotesPathParams {
  note_id: string;
}

export interface PutNotesBody {
  userId: string;
  title: string;
  content: string;
  bgColor?: string;
  banner?: string;
  isHTML: boolean;
  entityID?: string;
  entityType?: NotesEntityType;
  noteType: NoteType;
  type?: LabelType;
}

export interface UpdateNoteOrderBody {
  noteOrder: string[];
}
