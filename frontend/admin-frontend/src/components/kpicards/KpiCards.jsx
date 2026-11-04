import React from "react";
import { Card } from "@/components/ui/card";
import "./KpiCards.css";

/*
  Each card is driven by data, so you can plug in real values from your API.
  `progress` is a number from 0 to 100 and controls the bar at the bottom.
  `variant` controls the colour theme: "blue" | "indigo" | "danger"
*/
const DEFAULT_CARDS = [
  {
    id: "drivers",
    label: "Total Licensed Drivers",
    value: "142",
    variant: "blue",
    left: "100% KPK Verified",
    leftAccent: true,
    right: "Capacity: 160",
    progress: 89,
  },
  {
    id: "duty",
    label: "Active on Duty",
    value: "132",
    variant: "blue",
    left: "86 on trip • 46 available",
    right: "93% Utilization",
    rightAccent: true,
    progress: 93,
  },
  {
    id: "safety",
    label: "Avg Fleet Safety Score",
    value: "94.2%",
    variant: "indigo",
    left: "+1.4% vs last week",
    leftAccent: true,
    right: "Benchmark > 90%",
    progress: 94,
  },
  {
    id: "violations",
    label: "Flagged Violations Today",
    value: "5",
    variant: "danger",
    left: "1 Critical SOS ongoing",
    leftAccent: true,
    right: "4 Speed deviations",
    progress: 22,
  },
];

const KpiCards = ({ cards = DEFAULT_CARDS }) => {
  return (
    <section className="kpi-grid">
      {cards.map((card) => {
        return (
          <Card
            key={card.id}
            className={`kpi-card kpi-card--${card.variant}`}
          >
            <div className="kpi-card__top">
              <span className="kpi-card__label">{card.label}</span>
            </div>

            <div className="kpi-card__main">
              <h2 className="kpi-card__value">{card.value}</h2>
            </div>

            <div className="kpi-card__meta">
              <span
                className={
                  "kpi-card__meta-left" +
                  (card.leftAccent ? " kpi-card__accent" : "")
                }
              >
                {card.left}
              </span>
              <span
                className={
                  "kpi-card__meta-right" +
                  (card.rightAccent ? " kpi-card__accent" : "")
                }
              >
                {card.right}
              </span>
            </div>

            <div className="kpi-card__bar">
              <div
                className="kpi-card__bar-fill"
                style={{ width: `${card.progress}%` }}
              />
            </div>
          </Card>
        );
      })}
    </section>
  );
};

export default KpiCards;
