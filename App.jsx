// App.jsx
import { useState } from "react";

const CATEGORIES_REVENUS = ["Salaire", "Aides sociales", "Investissements", "Autres"];
const CATEGORIES_DEPENSES = ["Loyer", "Courses", "Transport", "Abonnements", "Loisirs", "Autres"];

export default function App() {
  const [revenus, setRevenus] = useState([]);
  const [depenses, setDepenses] = useState([]);
  const [date, setDate] = useState("");
  const [nom, setNom] = useState("");
  const [montant, setMontant] = useState("");
  const [type, setType] = useState("revenu");
  const [categorie, setCategorie] = useState("");

  const ajouterEntree = () => {
    const entree = {
      date,
      nom: categorie !== "Autres" ? categorie : nom,
      montant: parseFloat(montant),
      type,
    };
    if (type === "revenu") setRevenus([...revenus, entree]);
    else setDepenses([...depenses, entree]);
    setNom("");
    setMontant("");
    setCategorie("");
    setDate("");
  };

  const supprimerEntree = (index, type) => {
    if (type === "revenu") setRevenus(revenus.filter((_, i) => i !== index));
    else setDepenses(depenses.filter((_, i) => i !== index));
  };

  const totalRevenus = revenus.reduce((acc, cur) => acc + cur.montant, 0);
  const totalDepenses = depenses.reduce((acc, cur) => acc + cur.montant, 0);
  const solde = totalRevenus - totalDepenses;

  return (
    <div>
      <h1>BudgetNet 💸</h1>

      <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />

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

      <button onClick={ajouterEntree}>Ajouter</button>

      <h2>Revenus</h2>
      <ul>
        {revenus.map((r, i) => (
          <li key={i}>
            ➕ {r.nom} : {r.montant}€ ({r.date})
            <button onClick={() => supprimerEntree(i, "revenu")}>🗑️</button>
          </li>
        ))}
      </ul>

      <h2>Dépenses</h2>
      <ul>
        {depenses.map((d, i) => (
          <li key={i}>
            ➖ {d.nom} : {d.montant}€ ({d.date})
            <button onClick={() => supprimerEntree(i, "depense")}>🗑️</button>
          </li>
        ))}
      </ul>

      <h2>Solde : {solde}€</h2>
    </div>
  );
}
