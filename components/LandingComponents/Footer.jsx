import styles from "../../styles/LandingStyles/Footer.module.css"

const Footer = () => {
  return(
    <>
      <div className={styles.main}>
        <div className={styles.head}>
        <div className={styles.text}>
            <div className={styles.mainText}>join a community of passionate workers <br/>fueled by <span className={styles.span}>discipline</span></div>
          </div>
          <img className={styles.img} src="../../src/assets/mapbase2.png"></img>
         
        </div>
      </div>
    </>
  )
}

export default Footer