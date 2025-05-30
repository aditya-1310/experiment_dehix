export interface PutSkillPathParams {
  skill_id: string;
}

export interface PutSkillBody {
  label?: string;
  description?: string;
  domain_id?: string;
  status?: string;
}
