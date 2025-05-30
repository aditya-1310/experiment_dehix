export interface UpdateResumeBody {
  _id?: string; // Optional because MongoDB will auto-generate it if not provided
  userId: string;
  personalInfo?: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    country?: string;
    linkedIn?: string;
    github?: string;
  };
  workExperience?: Array<{
    jobTitle?: string;
    company?: string;
    startDate?: Date;
    endDate?: Date;
    description?: string;
  }>;
  education?: Array<{
    degree?: string;
    school?: string;
    startDate?: Date;
    endDate?: Date;
    grade?: string;
  }>;
  skills?: string[];
  certifications?: Array<{
    name?: string;
    issuingOrganization?: string;
    issueDate?: Date;
    expirationDate?: Date;
  }>;
  professionalSummary?: string;
  projects?: Array<{
    title?: string;
    description?: string;
  }>;
}
