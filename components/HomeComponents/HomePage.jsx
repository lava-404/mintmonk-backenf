import React from "react";
import styles from "../../styles/HomeStyles/HomePage.module.css";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleClick = async () => {
    navigate('/startSession')
  }
  return (
    <div className={styles.dashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
  <div className={styles.logo}>
    <div className={styles.sec1}>
      Mint<span className={styles.span}>Monk</span>
    </div>
  </div>
  <nav className={styles.menu}>
    <a href="/sessions" className={styles.link}>
      <img className={styles.icon} src="../../src/assets/sessions.png" alt="sessions" />
      <span>Sessions</span>
    </a>
    <a href="#" className={styles.link}>
      <img className={styles.icon} src="../../src/assets/earnings.png" alt="earnings" />
      <span>Earnings</span>
    </a>
    <a href="#" className={styles.link}>
      <img className={styles.icon} src="../../src/assets/leaderboard.png" alt="leaderboard" />
      <span>Leaderboard</span>
    </a>
    <a href="#" className={styles.link}>
      <img className={styles.icon} src="../../src/assets/progress.png" alt="progress" />
      <span>Progress</span>
    </a>
    <a href="#" className={styles.link}>
      <img className={styles.icon} src="../../src/assets/tasks.png" alt="tasks" />
      <span>Tasks</span>
    </a>
    <a href="#" className={styles.link}>
      <img className={styles.icon} src="../../src/assets/mind.png" alt="mindfulness" />
      <span>Mindfulness</span>
    </a>
    <a href="#" className={styles.link}>
      <img className={styles.icon} src="../../src/assets/settings.png" alt="settings" />
      <span>Settings</span>
    </a>
  </nav>
</aside>

      {/* Main Content */}
      <main className={styles["main-content"]}>
        {/* Top bar */}
        <div className={styles.topbar}>
          <input type="text" placeholder="Search" className={styles.search} />
          <div className={styles.icons}>
            <span>🔔</span>
            <span>⬆️</span>
          </div>
        </div>

        {/* Hero Section */}
        <section className={styles.hero}>
          <h2>
            Eyes sharp. Mind clear.
            <br />
            Let’s mint that grind.
          </h2>
          <button className={styles.startBtn} onClick={handleClick}>
            <span className={styles.btnText}>Start Session</span>
            <div className={styles.iconCircle}>
              <img src="../../src/assets/grt.png" alt="arrow" className={styles.icon} />
            </div>
          </button>
        </section>

        {/* Recent Sessions */}
        <div className={styles.main}>
        <section className={styles.recent}>
          <div className={styles.h33} >Recent Sessions:</div>
          <div className={styles.cards}>
            <div className={`${styles.card} ${styles.tall}`}>
              <img src="../../src/assets/d1.png" alt="session 1" />
              <div className={styles.info}>
                <h4>Data Structures: Arrays</h4>
                <div className={styles.tags}>
                  <span className={styles.goal}>Goal: 1hr</span>
                  <span className={styles.stake}>Stake: 30 coins</span>
                  <span className={styles.loss}>Loss: 0 coins</span>
                  <span className={styles.boost}>Boost: 50%</span>
                  <span className={styles.focus}>Focus: 100%</span>
                  <span className={styles.rewards}>Rewards: 45 coins</span>
                </div>
              </div>
            </div>

            <div className={styles.box1}>
              <div className={styles.card1}>
                <img className={styles.imagee} src="../../src/assets/d2.png" alt="session 2" />
                <div className={styles.info}>
                  <h4>Data Structures: Arrays</h4>
                  <div className={styles.tags}>
                    <span className={styles.goal}>Goal: 1hr</span>
                    <span className={styles.stake}>Stake: $30</span>
                    <span className={styles.loss}>Loss: 55min</span>
                    <span className={styles.boost}>Boost: 50%</span>
                    <span className={styles.focus}>Focus: 55min</span>
                    <span className={styles.rewards}>Rewards: 55min</span>
                  </div>
                </div>
              </div>

              <div className={styles.card1}>
                <img className={styles.imagee} src="../../src/assets/d3.png" alt="session 3" />
                <div className={styles.info}>
                  <h4>Data Structures: Arrays</h4>
                  <div className={styles.tags}>
                    <span className={styles.goal}>Goal: 1hr</span>
                    <span className={styles.stake}>Stake: $30</span>
                    <span className={styles.loss}>Loss: 55min</span>
                    <span className={styles.boost}>Boost: 50%</span>
                    <span className={styles.focus}>Focus: 55min</span>
                    <span className={styles.rewards}>Rewards: 55min</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        </div>

      </main>

      {/* Right Sidebar */}
      <aside className={styles.rightbar}>
        <img
          src="../../src/assets/Mia.png"
          alt="profile"
          className={styles.avatar}
        />
        <p>Welcome Mia</p>
      </aside>
    </div>
  );
};

export default Dashboard;
