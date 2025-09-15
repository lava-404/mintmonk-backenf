import SessionsTable from "../components/SessionsComponents/SessionsTable";
import styles from "../styles/SessionsStyles/Sessions.module.css";

const Sessions = () => {
  return (
    <div className={styles.main}>
      <SessionsTable />
    </div>
  );
};

export default Sessions;
