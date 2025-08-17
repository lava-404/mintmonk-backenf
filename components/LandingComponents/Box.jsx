import styles from '../../styles/LandingStyles/Box.module.css'
const Box = () => {
  return(
    <div className={styles.superMain}>
      <div className={styles.main}>
        <div className={styles.part1}>

          <div className={styles.subpart1}>
            <div className={styles.heading}>focus is your<br/><span className={styles.span}>new currency</span></div>
            <div className={styles.subpartsub}>step into the future of productivity, where your time is tokenized, your sessions are staked, and your focus earns you clout. </div>
          </div>

          <div className={styles.part}>
            <div className={styles.subpartHead}>staked sessions</div>
            <div className={styles.subpartsubhead}>lock in your commitment. stake your custom MintMonk tokens before each session. the clock ticks, your discipline gets minted, and if you fail... you lose your stake</div>
          </div>

        </div>


        <div className={styles.part1}>

          <div className={styles.part}>
            <div className={styles.subpartHead}>earn rewards</div>
            <div className={styles.subpartsubhead}>successfully finish a session? congrats, you just earned tokens, built streaks, and climbed the productivity leaderboard. time is literally your money here </div>
          </div>

          <div className={styles.part}>
            <div className={styles.subpartHead}>gamified focus</div>
            <div className={styles.subpartsubhead}>turn work into a game. daily quests, combo streaks, leaderboard flexes, and session multipliers, productivity is now an RPG and you’re the main character</div>
          </div>

        </div>
      </div>
    </div>
  )

}

export default Box