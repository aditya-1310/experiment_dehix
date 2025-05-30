import {
  LabelType,
  NotesEntityType,
  NoteType,
} from "../../../models/adminnotes.model";

export interface PutAdminNotesPathParams {
  note_id: string;
}

export interface PutAdminNotesBody {
  userId: string;
  username: string;
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

export interface PutNoteTypeBody {
  noteType: string;
}
