// src/components/Sessions/SessionsTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../../styles/SessionsStyles/SessionsTable.module.css";

const SessionsTable = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const userId = localStorage.getItem("userId"); // 👈 grab current user
        const res = await axios.get(`http://localhost:5667/sessions/${userId}`);
        setSessions(res.data); // backend already returns clean array
      } catch (err) {
        console.error("Error fetching sessions:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, []);

  if (loading) return <p>Loading session history...</p>;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>📅 Session History</h2>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Topic</th>
            <th>Duration</th>
            <th>Stake</th>
            <th>Rewards</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <tr key={session._id}>
                <td>{session.topic}</td>
                <td>{session.duration}</td> {/* backend already formatted */}
                <td>{session.stake}</td>   {/* "30 coins" */}
                <td>{session.rewards}</td> {/* "45 coins" */}
                <td>
                  <span
                    className={`${styles.status} ${
                      styles[session.status.toLowerCase()]
                    }`}
                  >
                    {session.status}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No sessions found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default SessionsTable;
