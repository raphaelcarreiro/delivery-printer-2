export interface Customer {
  id: number;
  user_id: number;
  name: string;
  gender: 'm' | 'f';
  phone: string;
  cpf: string;
  email: string;
  birthday: string;
  created_at: string;
  formattedCreatedAt: string;
}
