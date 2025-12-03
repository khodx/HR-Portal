import styles from "./companies.module.css";

interface Company {
  company_id: string;
  legal_name: string;
  dba: string;
  created_by: string;
  created_at: string;
}

export default function CompanyCard({ company }: { company: Company }) {
  return (
    <div className={styles.row}>
      <span className={styles.col}><strong>ID:</strong> {company.company_id}</span>
      <span className={styles.col}><strong>Legal:</strong> {company.legal_name}</span>
      <span className={styles.col}><strong>DBA:</strong> {company.dba}</span>
      <span className={styles.col}><strong>By:</strong> {company.created_by}</span>
      <span className={styles.col}><strong>At:</strong> {new Date(company.created_at).toLocaleString()}</span>
    </div>
  );
}
