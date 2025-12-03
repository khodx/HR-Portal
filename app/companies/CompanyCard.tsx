import styles from "./companies.module.css";
import { Company } from "./company-types";

export default function CompanyCard({ company }: { company: Company }) {
  return (
    <div className={styles.companyRow}>
      <div>
        <div className={styles.companyName}>{company.legal_name}</div>
        <div className={styles.meta}>DBA: {company.dba}</div>
        <div className={styles.meta}>Created By: {company.created_by}</div>
        <div className={styles.meta}>
          Created At: {new Date(company.created_at).toLocaleString()}
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.btnPrimary}>View</button>
        <button className={styles.btnSecondary}>Edit</button>
      </div>
    </div>
  );
}
