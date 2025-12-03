import styles from "./companies.module.css";

interface CompanyCardProps {
  company: any;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className={styles.row}>
      <span className={styles.col}><strong>ID:</strong> {company.company_id}</span>
      <span className={styles.col}><strong>Legal:</strong> {company.legal_name}</span>
      <span className={styles.col}><strong>DBA:</strong> {company.dba}</span>
      <span className={styles.col}><strong>Created By:</strong> {company.created_by}</span>
      <span className={styles.col}><strong>Created At:</strong> {new Date(company.created_at).toLocaleString()}</span>
    </div>
  );
}
