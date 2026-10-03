export interface Entry {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  entry_type: string;
  entry_datetime: string;
  mood: number;
  content: string;
}

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password: string;
}
