export interface PatchOracleBody {
  verification_status: "PENDING" | "APPROVED" | "DENIED";
  comments: string;
}
export interface PutCommentBody {
  comment: string;
  verifiedAt: Date;
  verification_status: "PENDING" | "APPROVED" | "DENIED";
}
