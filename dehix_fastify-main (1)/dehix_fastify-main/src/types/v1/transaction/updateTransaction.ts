export interface PutTransactionBody {
  type: "payment" | "referral" | "rewards" | "system generated";
  reference: string;
  status: "system" | "freelancer" | "business" | "admin" | "verification";
  reference_id: string;
}
