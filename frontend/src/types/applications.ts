export interface Application {
  id: number,
  user_id: number,
  program_id: number,
  status: string,
  start_date: string,
  submitted_date: string,
  decision_date: string,
  notes: string,
  created_at: string,
  updated_at: string
  }

export interface ApplicationProps {
  data: Application[] | null;
}