export interface Application {
    id: number;
    institution: string;
    tag: string,
    website: string;
    scholarship: boolean;
    status: string;
    deadline: string;
  }

export interface ApplicationProps {
  data: Application[] | null;
}