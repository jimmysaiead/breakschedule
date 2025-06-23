import { useState } from "react";

const shifts = {
  "9-6": { start: 9, end: 18 },
  "10-7": { start: 10, end: 19 },
};

export default function BreakScheduler() {
  const [agents, setAgents] = useState([{ name: "", shift: "9-6" }]);
  const [schedule, setSchedule] = useState([]);

  const addAgent = () => {
    setAgents([...agents, { name: "", shift: "9-6" }]);
  };

  const updateAgent = (index, key, value) => {
    const updated = [...agents];
    updated[index][key] = value;
    setAgents(updated);
  };

  const distributeBreaks = () => {
    const shiftGroups = { "9-6": [], "10-7": [] };
    agents.forEach((a) => shiftGroups[a.shift].push(a));

    const fullSchedule = agents.map((agent) => {
      const group = shiftGroups[agent.shift];
      const idx = group.findIndex((a) => a.name === agent.name);
      const { start } = shifts[agent.shift];

      const firstBreak = start + 1.5 + idx * 0.25;
      const lunchBreak = start + 4 + idx * 0.5;
      const lastBreak = start + 7.25 + idx * 0.25;

      const formatTime = (decimalHour) => {
        let hours = Math.floor(decimalHour);
        const minutes = Math.round((decimalHour - hours) * 60);
        const period = hours >= 12 ? "PM" : "AM";
        if (hours === 0) hours = 12;
        else if (hours > 12) hours -= 12;
        return `${hours}:${minutes.toString().padStart(2, "0")} ${period}`;
      };

      return {
        name: agent.name,
        shift: agent.shift,
        firstBreak: `${formatTime(firstBreak)} - ${formatTime(firstBreak + 0.25)}`,
        lunchBreak: `${formatTime(lunchBreak)} - ${formatTime(lunchBreak + 0.5)}`,
        lastBreak: `${formatTime(lastBreak)} - ${formatTime(lastBreak + 0.25)}`,
      };
    });

    setSchedule(fullSchedule);
  };

  return (
    <div style={{ padding: "2rem", maxWidth: "800px", margin: "auto" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>جدول البريكات</h1>
      {agents.map((agent, idx) => (
        <div key={idx} style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
          <input
            style={{ flex: 1, padding: "8px" }}
            placeholder="اسم ـ Agent"
            value={agent.name}
            onChange={(e) => updateAgent(idx, "name", e.target.value)}
          />
          <select
            style={{ flex: 1, padding: "8px" }}
            value={agent.shift}
            onChange={(e) => updateAgent(idx, "shift", e.target.value)}
          >
            <option value="9-6">9:00 AM - 6:00 PM</option>
            <option value="10-7">10:00 AM - 7:00 PM</option>
          </select>
        </div>
      ))}
      <button onClick={addAgent} style={{ margin: "10px", padding: "8px 12px" }}>
        + أضف Agent
      </button>
      <button onClick={distributeBreaks} style={{ padding: "8px 12px", backgroundColor: "#1976d2", color: "white" }}>
        وزع البريكات
      </button>

      {schedule.length > 0 && (
        <table style={{ width: "100%", marginTop: "2rem", borderCollapse: "collapse", textAlign: "center" }}>
          <thead>
            <tr>
              <th style={th}>Agent</th>
              <th style={th}>Shift</th>
              <th style={th}>15 min</th>
              <th style={th}>Lunch</th>
              <th style={th}>15 min</th>
            </tr>
          </thead>
          <tbody>
            {schedule.map((row, idx) => (
              <tr key={idx}>
                <td style={td}>{row.name}</td>
                <td style={td}>{row.shift}</td>
                <td style={td}>{row.firstBreak}</td>
                <td style={td}>{row.lunchBreak}</td>
                <td style={td}>{row.lastBreak}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const th = {
  border: "1px solid #ccc",
  padding: "10px",
  backgroundColor: "#f2f2f2",
};

const td = {
  border: "1px solid #ccc",
  padding: "10px",
};
