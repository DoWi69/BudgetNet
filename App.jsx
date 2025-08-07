// App.js
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
  // ... Le contenu de l'application sera collé ici ...
} // Fin App.js
