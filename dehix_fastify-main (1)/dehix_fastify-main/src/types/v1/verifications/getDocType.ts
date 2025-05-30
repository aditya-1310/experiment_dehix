export interface GetDocTypeQueryParams {
  doc_type:
    | "skill"
    | "domain"
    | "education"
    | "project"
    | "experience"
    | "business";
  type?: "freelancer" | "admin";
}
