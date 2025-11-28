export interface Project {
  id: string;
  project_name: string;
  contractor: string;
  state: string;
  zone: string;
  category: string;
  site: string;
  contract_sum: number;
  amount_paid: number;
  value_of_work_done: number;
  target_total: number;
  achieved_total: number;
}
