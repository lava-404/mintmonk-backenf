import SessionsTable from "../components/SessionsComponents/SessionsTable";
import Timer from "../components/SessionsComponents/Timer";
import styles from "../styles/SessionsStyles/Sessions.module.css"

const Sessions = () => {
  return(
    <div className={styles.main}>
       <SessionsTable />
    </div>
   
  )
}

export default Sessions;