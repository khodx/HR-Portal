import styles from "./companies.module.css";

export default function CompanyCard({ company }: { company: any }) {
  return (
    <div className={styles.companyRow}>
      <span className={styles.companyName}>{company.company_name}</span>
      <span className={styles.companyDetails}>
        ID: {company.company_id}
      </span>
    </div>
  );
}
