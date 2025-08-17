import styles from "../../styles/LandingStyles/Features.module.css"

const Features = () => {
  return (
    <>
      <div className={styles.main}>
        <div className={styles.feature}>
          <img className={styles.image} src="../../src/assets/image1.png"></img>
          <div className={styles.text}>start a focus session</div>
        </div>

        <div className={styles.feature}>
          <img className={styles.image} src="../../src/assets/image3.png"></img>
          <div className={styles.text}>earn rewards for focusing</div>
        </div>

        <div className={styles.feature}>
          <img className={styles.image} src="../../src/assets/image2.png"></img>
          <div className={styles.text}>flex your gains on the leaderboard</div>
        </div>
      </div>
    </>
  )
}

export default Features