import styles from "../../styles/AuthStylees/Form.module.css";
import { signInWithPopup, signInWithRedirect, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../services/Firebase";
import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Form = () => {
  const navigate = useNavigate();

  const completeLogin = async (firebaseUser) => {
    const payload = {
      email: firebaseUser.email,
      name: firebaseUser.displayName,
      image: firebaseUser.photoURL,
    };

    const res = await axios.post("http://localhost:5667/auth", payload, {
      headers: { "Content-Type": "application/json" },
    });

    const userData = res.data;
    localStorage.setItem("userId", userData.userId);
    alert("Inbuilt wallet has been assigned to you");
    navigate("/HomePage");
  };

  useEffect(() => {
    (async () => {
      try {
        const redirectResult = await getRedirectResult(auth);
        if (redirectResult && redirectResult.user) {
          await completeLogin(redirectResult.user);
        }
      } catch (e) {
        // no-op; handled on explicit sign-in
      }
    })();
  }, []);

  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      const result = await signInWithPopup(auth, provider);
      await completeLogin(result.user);
    } catch (err) {
      const code = err?.code || "";
      if (code === "auth/popup-blocked" || code === "auth/popup-closed-by-user" || code === "auth/operation-not-supported-in-this-environment") {
        try {
          const provider = new GoogleAuthProvider();
          provider.setCustomParameters({ prompt: "select_account" });
          await signInWithRedirect(auth, provider);
          return;
        } catch (redirectErr) {
          console.error("Redirect sign-in failed:", redirectErr);
          alert("Login failed. Please try again.");
        }
      } else {
        console.error("Login error:", err);
        alert("Login failed. Check console for details.");
      }
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
              className={styles.interactiveIcon}
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
