export interface ToolEintrag {
  id: string;
  created_at: string;
  tool: string;
  von?: string;
  an: string;
  email_kunde: string;
  versand: string;
  rueckversand: string;
  zurueckgegeben: boolean;
  kontrolliert: boolean;
  kontrolliert_von: string;
  kommentar?: string;
  archived?: boolean;
  tatsaechliches_rueckgabedatum?: string;
}
