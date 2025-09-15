// src/components/Sessions/SessionForm.jsx
import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import InputField from "./InputField";
import styles from "../../styles/SessionsStyles/SessionForm.module.css";
import { TimerContext } from "../../src/context/TimerContext";

const SessionForm = () => {
  const navigate = useNavigate();
  const { setCurrentSession, setTimerVisible } = useContext(TimerContext); // 👈 also grab setTimerVisible
  const userId = localStorage.getItem("userId");

  const [form, setForm] = useState({
    task: "",
    duration: "",
    stake: "",
    breaks: "",
    boost: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => { 
    e.preventDefault();

    try {
      if (!userId) {
        alert("User ID missing. Please log in.");
        return;
      }

      // 🔥 Always parse numeric fields as numbers
      const durationNumber = Number(form.duration) || 0;
      const stakeNumber = Number(form.stake) || 0;

      if (!form.task || durationNumber <= 0 || stakeNumber <= 0) {
        alert("Please fill task, duration, and stake correctly.");
        return;
      }

      const payload = {
        userId,
        task: form.task,
        duration: durationNumber, // 👈 number, not string
        stake: stakeNumber,
        breaks: form.breaks || "No Breaks",
        boost: form.boost || "None",
      };

      const res = await axios.post("http://localhost:5667/sessions", payload, {
        headers: { "Content-Type": "application/json" },
      });

      // Save to context with required timer info
      const plannedSeconds = durationNumber * 60;
      setCurrentSession({
        _id: res.data.sessionId,
        plannedDuration: plannedSeconds,
        stake: stakeNumber,
        boost: form.boost || "None",
        topic: form.task,
      });
      setTimerVisible(true);

      alert(`Session "${form.task}" started! Timer will begin now.`);
      navigate("/sessions");
    } catch (err) {
      console.error("Error creating session:", err);
      alert("Failed to start session. Check console for details.");
    }
  };

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.heading}>🎯 Start a Focus Session</h2>

        <div className={styles.grid}>
          <InputField
            label="Task / Goal"
            name="task"
            value={form.task}
            onChange={handleChange}
            placeholder="Ex: Finish assignment"
            required
          />
          <InputField
            label="Duration"
            name="duration"
            type="select"
            value={form.duration}
            onChange={handleChange}
            options={["15", "25", "45", "60"]}
            required
          />
          <InputField
            label="Stake (Coins)"
            name="stake"
            type="number"
            value={form.stake}
            onChange={handleChange}
            placeholder="Ex: 30"
            required
          />
          <InputField
            label="Breaks"
            name="breaks"
            type="select"
            value={form.breaks}
            onChange={handleChange}
            options={["No Breaks", "5 min / 25 min", "10 min / 45 min"]}
          />
          <InputField
            label="Boost"
            name="boost"
            type="select"
            value={form.boost}
            onChange={handleChange}
            options={["None", "Double XP", "Focus Boost", "Reward Boost"]}
          />
        </div>

        <button type="submit" className={styles.submitBtn}>
          🚀 Start Session
        </button>
      </form>
    </div>
  );
};

export default SessionForm;
