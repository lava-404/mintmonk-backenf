import React, { useEffect, useMemo, useRef, useState } from "react";
import styles from "../../styles/LeaderBoardStyles/Leaderboard.module.css";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevTopRef = useRef(null);
  const [animateTop, setAnimateTop] = useState(false);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5667/leaderboard");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data.slice(0, 10) : []);
    } catch (e) {
      console.error("Leaderboard fetch failed", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const id = setInterval(fetchLeaderboard, 10000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const topId = users[0]?._id || null;
    if (prevTopRef.current && topId && prevTopRef.current !== topId) {
      setAnimateTop(true);
      setTimeout(() => setAnimateTop(false), 1200);
    }
    if (topId) prevTopRef.current = topId;
  }, [users]);

  const top = users[0];
  const rest = useMemo(() => users.slice(1), [users]);

  if (loading) return <div className={styles.loading}>Loading leaderboard…</div>;

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>🏆 Leaderboard</h1>

      {top ? (
        <div className={`${styles.topCard} ${animateTop ? styles.pulse : ""}`}>
          <div className={styles.crown}>👑</div>
          <div className={styles.topName}>{top.name}</div>
          <div className={styles.topBalance}>{top.balance} MM</div>
          <div className={styles.topWallet}>{top.wallet?.slice(0, 4)}…{top.wallet?.slice(-4)}</div>
        </div>
      ) : (
        <div className={styles.empty}>No users yet</div>
      )}

      <ul className={styles.list}>
        {rest.map((u, idx) => (
          <li key={u._id} className={styles.row}>
            <span className={styles.rank}>{idx + 2}</span>
            <span className={styles.name}>{u.name}</span>
            <span className={styles.balance}>{u.balance} MM</span>
          </li>
        ))}
      </ul>
      </div>
    </div>
  );
};

export default Leaderboard;
