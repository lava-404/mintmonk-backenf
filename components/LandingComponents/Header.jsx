import styles from "../../styles/LandingStyles/Header.module.css"

const Header = () => {
  return(
    <>
      <div className={styles.header}>
        <div className={styles.sec1}>Mint<span className={styles.span}>Monk</span></div>
        <div className={styles.sec2}></div>
        <div className={styles.sec3}></div>
      </div>
    </>
  )
}

export default Header