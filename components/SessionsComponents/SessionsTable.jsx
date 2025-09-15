// src/components/Sessions/SessionsTable.jsx
import React, { useEffect, useState, useCallback, useContext, useMemo } from "react";
import axios from "axios";
import styles from "../../styles/SessionsStyles/SessionsTable.module.css";
import { TimerContext } from "../../src/context/TimerContext";

const SessionsTable = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const { sessionsVersion } = useContext(TimerContext);

  const fetchSessions = useCallback(async () => {
    try {
      setLoading(true);
      const userId = localStorage.getItem("userId"); // 👈 grab current user
      const res = await axios.get(`http://localhost:5667/sessions/${userId}`);
      setSessions(res.data); // backend already returns clean array
    } catch (err) {
      console.error("Error fetching sessions:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  useEffect(() => {
    // refetch when timer updates a session
    fetchSessions();
  }, [sessionsVersion, fetchSessions]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return sessions;
    return sessions.filter((s) => (s.topic || "").toLowerCase().includes(q));
  }, [sessions, query]);

  if (loading) return <p>Loading session history...</p>;

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>📅 Session History</h2>
        <div className={styles.headerActions}>
          <input
            className={styles.searchBar}
            type="text"
            placeholder="Search sessions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className={styles.refreshBtn} onClick={fetchSessions}>
            🔄 Refresh
          </button>
        </div>
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>Topic</th>
            <th>Duration</th>
            <th>Stake</th>
            <th>Rewards</th>
            <th>Status</th>
            <th>Time Focused</th> {/* 👈 new column */}
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((session) => (
              <tr key={session._id} className={styles.row}>
                <td>{session.topic}</td>
                <td>{session.duration}</td>
                <td>{session.stake}</td>
                <td>{session.rewards}</td>
                <td>
                  <span
                    className={`${styles.status} ${
                      styles[session.status.toLowerCase().replace(/\s+/g, "-")]
                    }`}
                  >
                    {session.status}
                  </span>
                </td>
                <td>{session.timeFocused}</td> {/* 👈 new data */}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" className={styles.empty}>No sessions found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SessionsTable;
