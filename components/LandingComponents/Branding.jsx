import styles from "../../styles/LandingStyles/Branding.module.css";
import { useNavigate } from "react-router-dom";
const Branding = () => {

  const navigate = useNavigate();
  return (
    <div className={styles.wrapper}>
      {/* Top Fade Grid Background */}
      <div className={styles.fadeGrid} />

      {/* Your Content */}
      <div className={styles.content}>
        <img className={styles.plane} src="../../src/assets/plane.png"></img>
        <div className={styles.main}>
          
          <div className={styles.heading}>
            a productivity system <br />
            <span className={styles.span}>built on commitment</span>
          </div>
          <div className={styles.subHeading}>
            you’re not grinding alone. join the habit builders, not the quitters.
          </div>
          <button className={styles.button} onClick={() => navigate('/auth')}>get started</button>
        </div>
        <img className={styles.lamp} src="../../src/assets/lamp3.png"></img>

      </div>
    </div>
  );
};

export default Branding;
