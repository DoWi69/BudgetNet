// App.jsx
import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from "recharts";

const COLORS = ["#8e44ad", "#3498db", "#2ecc71", "#f39c12", "#e74c3c", "#1abc9c"];
const CATEGORIES_REVENUS = ["Salaire", "Aides sociales", "Investissements", "Autres"];
const CATEGORIES_DEPENSES = ["Loyer", "Courses", "Transport", "Abonnements", "Loisirs", "Autres"];

function groupParDate(entrees) {
  const grouped = {};
  entrees.forEach(({ date, nom, montant, type }) => {
    if (!grouped[date]) grouped[date] = [];
    grouped[date].push({ nom, montant, type });
  });
  return grouped;
}

export default function App() {
  const [revenus, setRevenus] = useState([]);
  const [depenses, setDepenses] = useState([]);
  const [date, setDate] = useState(new Date());
  const [nom, setNom] = useState("");
  const [montant, setMontant] = useState("");
  const [type, setType] = useState("revenu");
  const [categorie, setCategorie] = useState("");
  const [recurrent, setRecurrent] = useState(false);

  const ajouterEntree = () => {
    const entree = {
      date: date.toISOString().split("T")[0],
      nom: categorie !== "Autres" ? categorie : nom,
      montant: parseFloat(montant),
      type,
      recurrent,
    };
    if (type === "revenu") setRevenus([...revenus, entree]);
    else setDepenses([...depenses, entree]);
    setNom("");
    setMontant("");
    setCategorie("");
    setRecurrent(false);
  };

  const supprimerEntree = (index, type) => {
    if (type === "revenu") setRevenus(revenus.filter((_, i) => i !== index));
    else setDepenses(depenses.filter((_, i) => i !== index));
  };

  const totalRevenus = revenus.reduce((acc, cur) => acc + cur.montant, 0);
  const totalDepenses = depenses.reduce((acc, cur) => acc + cur.montant, 0);
  const solde = totalRevenus - totalDepenses;

  const dataGraph = [
    { name: "Revenus", value: totalRevenus },
    { name: "Dépenses", value: totalDepenses },
  ];

  const dataLine = [];
  const tous = [...revenus, ...depenses].sort((a, b) => new Date(a.date) - new Date(b.date));
  tous.forEach((e, i) => {
    const prev = dataLine[i - 1]?.solde || 0;
    const newSolde = e.type === "revenu" ? prev + e.montant : prev - e.montant;
    dataLine.push({ date: e.date, solde: newSolde });
  });

  return (
    <div style={{ minHeight: "100vh", color: "#222", padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>BudgetNet 💸</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: 500, margin: "0 auto" }}>
        <Calendar onChange={setDate} value={date} />

        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="revenu">Revenu</option>
          <option value="depense">Dépense</option>
        </select>

        <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
          <option value="">-- Catégorie --</option>
          {(type === "revenu" ? CATEGORIES_REVENUS : CATEGORIES_DEPENSES).map((cat, i) => (
            <option key={i} value={cat}>{cat}</option>
          ))}
        </select>

        {categorie === "Autres" && (
          <input type="text" value={nom} onChange={(e) => setNom(e.target.value)} placeholder="Nom personnalisé" />
        )}

        <input type="number" value={montant} onChange={(e) => setMontant(e.target.value)} placeholder="Montant (€)" />

        <label>
          <input type="checkbox" checked={recurrent} onChange={() => setRecurrent(!recurrent)} /> Répéter chaque mois
        </label>

        <button onClick={ajouterEntree}>Ajouter</button>
      </div>

      <div style={{ display: "flex", justifyContent: "space-around", marginTop: "2rem", flexWrap: "wrap" }}>
        <div>
          <h3>Revenus</h3>
          <ul>
            {revenus.map((r, i) => (
              <li key={i}>
                ➕ {r.nom} : {r.montant}€ ({r.date})
                <button onClick={() => supprimerEntree(i, "revenu")} style={{ marginLeft: 10 }}>🗑️</button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Dépenses</h3>
          <ul>
            {depenses.map((d, i) => (
              <li key={i}>
                ➖ {d.nom} : {d.montant}€ ({d.date})
                <button onClick={() => supprimerEntree(i, "depense")} style={{ marginLeft: 10 }}>🗑️</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <h2 style={{ textAlign: "center", marginTop: "2rem" }}>Solde : {solde}€</h2>

      <div style={{ height: 300, marginTop: "2rem" }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={dataGraph} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
              {dataGraph.map((_, i) => (
                <Cell key={`cell-${i}`} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div style={{ height: 300, marginTop: "2rem" }}>
        <ResponsiveContainer width="100%">
          <LineChart data={dataLine}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="solde" stroke="#8e44ad" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
