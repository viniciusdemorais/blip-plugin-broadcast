export interface NotificationIndividual {
  telephone?: string;
  namespace?: string;
  template?: string;
  params?: {};
  flow_id?: string;
  state_id?: string;
  master_state?: string;
  sender_email?: string;
  language_code?: string;
  trackOrigin?: boolean;
}
