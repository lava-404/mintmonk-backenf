import styles from "../../styles/AuthStylees/Form.module.css";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../services/Firebase";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    try {
      // 1️⃣ Firebase Google Sign-In
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const firebaseUser = result.user;

      // 2️⃣ Send user info to backend; backend creates/checks wallet
      const payload = {
        email: firebaseUser.email,
        name: firebaseUser.displayName,
        image: firebaseUser.photoURL,
      };

      const res = await axios.post("http://localhost:5667/auth", payload, {
        headers: { "Content-Type": "application/json" },
      });

      const userData = res.data;

      // 3️⃣ Save userId to localStorage
      localStorage.setItem("userId", userData.userId);
      console.log(userData.userId)

      // 4️⃣ Show alert with wallet info
      alert(`Inbuilt wallet has been assigned to you`);

      console.log("User signed in:", userData);
      
      // 5️⃣ Redirect to homepage
      navigate("/HomePage");
    } catch (err) {
      console.error("Login error:", err);
      alert("Login failed. Check console for details.");
    }
  };

  return (
    <div className={styles.main}>
      <div className={styles.box1}>
        <div className={styles.login_box}>
          <div className={styles.create}>Create your account</div>

          {/* Optional email/password fields for UI only */}
          <div className={styles.input}>
            <input type="email" placeholder="Email" disabled />
            <img className={styles.mail} src="../../src/assets/mail.png" />
          </div>
          <div className={styles.input}>
            <input type="password" placeholder="Password" disabled />
            <img src="../../src/assets/lock2.png" className={styles.lock} />
          </div>

          <button onClick={handleGoogleSignIn}>Sign In with Google</button>

          <div className={styles.fancy_separator}>
            <div className={styles.line} />
            <span className={styles.text}>or sign up with</span>
            <div className={styles.line} />
          </div>

          <div className={styles.social_login}>
            <img
              src="../../src/assets/google.png"
              alt="Google"
              onClick={handleGoogleSignIn}
              style={{ cursor: "pointer" }}
            />
            <img src="../../src/assets/apple.png" alt="Apple" />
            <img src="../../src/assets/fb.png" alt="Facebook" />
          </div>
        </div>
      </div>
      <div className={styles.box2}>
        
      </div>
    </div>
  );
};

export default Form;
