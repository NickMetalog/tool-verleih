import { useState } from "react";
import { ToolEintrag } from "../../../types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StatistikTabProps {
  eintraege: ToolEintrag[];
}

export default function StatistikTab({ eintraege }: StatistikTabProps) {
  const [filter, setFilter] = useState("all");

  const getFilteredEintraege = () => {
    const now = new Date();
    let startDate: Date;

    switch (filter) {
      case "30days":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 30);
        break;
      case "3months":
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "360days":
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 360);
        break;
      case "yearly":
        startDate = new Date(now.getFullYear(), 0, 1);
        break;
      case "lastyear":
        startDate = new Date(now.getFullYear() - 1, 0, 1);
        const endDate = new Date(now.getFullYear() - 1, 11, 31);
        return eintraege.filter(e => {
          const versand = new Date(e.versand);
          const rueckversand = e.rueckversand ? new Date(e.rueckversand) : now;
          return versand <= endDate && rueckversand >= startDate;
        });
      default:
        return eintraege;
    }

    return eintraege.filter(e => {
      const versand = new Date(e.versand);
      const rueckversand = e.rueckversand ? new Date(e.rueckversand) : now;
      return rueckversand >= startDate;
    });
  };

  const filteredEintraege = getFilteredEintraege();

  const getRentalFrequency = () => {
    const frequency: { [key: string]: number } = {};
    filteredEintraege.forEach(eintrag => {
      if (frequency[eintrag.tool]) {
        frequency[eintrag.tool]++;
      } else {
        frequency[eintrag.tool] = 1;
      }
    });
    return frequency;
  };

  const getAverageRentalDuration = () => {
    const durations: { [key: string]: number[] } = {};
    filteredEintraege.forEach(eintrag => {
      const actualRueckversand = eintrag.tatsaechliches_rueckgabedatum ? new Date(eintrag.tatsaechliches_rueckgabedatum) : (eintrag.rueckversand ? new Date(eintrag.rueckversand) : null);

      if (actualRueckversand) {
        const versand = new Date(eintrag.versand); // Move declaration inside the if block
        const duration = (actualRueckversand.getTime() - versand.getTime()) / (1000 * 3600 * 24);
        if (durations[eintrag.tool]) {
          durations[eintrag.tool].push(duration);
        } else {
          durations[eintrag.tool] = [duration];
        }
      }
    });

    const averages: { [key: string]: number } = {};
    for (const tool in durations) {
      const sum = durations[tool].reduce((a, b) => a + b, 0);
      averages[tool] = sum / durations[tool].length;
    }
    return averages;
  };

  const rentalFrequency = getRentalFrequency();
  const averageRentalDuration = getAverageRentalDuration();

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Select onValueChange={setFilter} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Gesamt</SelectItem>
            <SelectItem value="30days">Letzte 30 Tage</SelectItem>
            <SelectItem value="3months">Letzte 3 Monate</SelectItem>
            <SelectItem value="360days">Letzte 360 Tage</SelectItem>
            <SelectItem value="yearly">Dieses Jahr</SelectItem>
            <SelectItem value="lastyear">Letztes Jahr</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Miethäufigkeit</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {Object.entries(rentalFrequency).map(([tool, count]) => (
              <li key={tool}><strong>{tool}:</strong> {count} mal</li>
            ))}
          </ul>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Durchschnittliche Mietdauer (Tage)</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {Object.entries(averageRentalDuration).map(([tool, duration]) => (
              <li key={tool}><strong>{tool}:</strong> {duration.toFixed(2)}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
