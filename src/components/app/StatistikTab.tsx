import { useState } from "react";
import { ToolEintrag } from "../../../types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch"; // Import Switch component
import { Label } from "@/components/ui/label"; // Import Label component
import { Button } from "@/components/ui/button"; // Import Button component

interface StatistikTabProps {
  eintraege: ToolEintrag[];
}

export default function StatistikTab({ eintraege }: StatistikTabProps) {
  const [filter, setFilter] = useState("all");
  const [groupingLevel, setGroupingLevel] = useState<"none" | "roman" | "full">("none"); // New state for grouping level

  const getBaseToolName = (toolName: string, level: "roman" | "full"): string => {
    let cleanedName = toolName;

    if (level === "roman" || level === "full") {
      // Remove Roman numerals (I, II, III, etc.)
      let changedRoman = true;
      const romanNumeralRegex = /\s+(I|II|III|IV|V|VI|VII|VIII|IX|X)+$/i;
      while (changedRoman) {
        const match = cleanedName.match(romanNumeralRegex);
        if (match) {
          cleanedName = cleanedName.substring(0, match.index).trim();
        } else {
          changedRoman = false;
        }
      }
    }

    if (level === "full") {
      // Remove numbers (1, 2, 3, etc.)
      let changedNumber = true;
      const numberRegex = /\s+\d+$/;
      while (changedNumber) {
        const match = cleanedName.match(numberRegex);
        if (match) {
          cleanedName = cleanedName.substring(0, match.index).trim();
        } else {
          changedNumber = false;
        }
      }
    }
    return cleanedName;
  };

  const getToolNameForGrouping = (toolName: string): string => {
    if (groupingLevel === "none") {
      return toolName;
    } else if (groupingLevel === "roman") {
      return getBaseToolName(toolName, "roman");
    } else { // groupingLevel === "full"
      return getBaseToolName(toolName, "full");
    }
  };

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
      const rueckversand = e.rueckversand ? new Date(e.rueckversand) : now;
      return rueckversand >= startDate;
    });
  };

  const filteredEintraege = getFilteredEintraege();

  const getRentalFrequency = () => {
    const frequency: { [key: string]: number } = {};
    filteredEintraege.forEach(eintrag => {
      const toolName = getToolNameForGrouping(eintrag.tool);
      if (frequency[toolName]) {
        frequency[toolName]++;
      } else {
        frequency[toolName] = 1;
      }
    });
    return frequency;
  };

  const getAverageRentalDuration = () => {
    const durations: { [key: string]: number[] } = {};
    filteredEintraege.forEach(eintrag => {
      const toolName = getToolNameForGrouping(eintrag.tool);
      const actualRueckversand = eintrag.tatsaechliches_rueckgabedatum ? new Date(eintrag.tatsaechliches_rueckgabedatum) : (eintrag.rueckversand ? new Date(eintrag.rueckversand) : null);

      if (actualRueckversand) {
        const duration = (actualRueckversand.getTime() - new Date(eintrag.versand).getTime()) / (1000 * 3600 * 24);
        if (durations[toolName]) {
          durations[toolName].push(duration);
        } else {
          durations[toolName] = [duration];
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

  const sortedRentalFrequency = Object.entries(rentalFrequency).sort(([toolA], [toolB]) => toolA.localeCompare(toolB));
  const sortedAverageRentalDuration = Object.entries(averageRentalDuration).sort(([toolA], [toolB]) => toolA.localeCompare(toolB));

  const getUniqueYears = () => {
    const years = new Set<number>();
    eintraege.forEach(e => {
      if (e.versand) {
        years.add(new Date(e.versand).getFullYear());
      }
      if (e.rueckversand) {
        years.add(new Date(e.rueckversand).getFullYear());
      }
      if (e.tatsaechliches_rueckgabedatum) {
        years.add(new Date(e.tatsaechliches_rueckgabedatum).getFullYear());
      }
    });
    return Array.from(years).sort((a, b) => b - a); // Sort descending
  };

  const uniqueYears = getUniqueYears();
  const [selectedYear, setSelectedYear] = useState<string | "all">("all");

  const exportStatisticsToCsv = () => {
    let csvContent = "Tool,Miethäufigkeit,Durchschnittliche Mietdauer (Tage)\n";

    const combinedData = new Map<string, { frequency: number; duration: number }>();

    sortedRentalFrequency.forEach(([tool, count]) => {
      if (!combinedData.has(tool)) {
        combinedData.set(tool, { frequency: 0, duration: 0 });
      }
      combinedData.get(tool)!.frequency = count;
    });

    sortedAverageRentalDuration.forEach(([tool, duration]) => {
      if (!combinedData.has(tool)) {
        combinedData.set(tool, { frequency: 0, duration: 0 });
      }
      combinedData.get(tool)!.duration = parseFloat(duration.toFixed(2));
    });

    Array.from(combinedData.keys()).sort().forEach(tool => {
      const data = combinedData.get(tool)!;
      csvContent += `${tool},${data.frequency},${data.duration}\n`;
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) { // Feature detection for "download" attribute
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `statistik_export_${filter}${groupingLevel !== 'none' ? `_${groupingLevel}` : ''}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const exportFullDataToCsv = () => {
    const headers = Object.keys(eintraege[0] || {}).join(',');
    let csvContent = headers + '\n';

    const filteredByYear = eintraege.filter(e => {
      if (selectedYear === "all") return true;
      const year = parseInt(selectedYear);
      const versandYear = e.versand ? new Date(e.versand).getFullYear() : null;
      const rueckversandYear = e.rueckversand ? new Date(e.rueckversand).getFullYear() : null;
      const tatsaechlichesRueckgabedatumYear = e.tatsaechliches_rueckgabedatum ? new Date(e.tatsaechliches_rueckgabedatum).getFullYear() : null;
      return versandYear === year || rueckversandYear === year || tatsaechlichesRueckgabedatumYear === year;
    });

    filteredByYear.forEach(eintrag => {
      const values = Object.values(eintrag).map(value => {
        if (value === null || value === undefined) return "";
        if (typeof value === 'string' && (value.includes(',') || value.includes('"') || value.includes('\n'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value;
      }).join(',');
      csvContent += values + '\n';
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `full_export_${selectedYear}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end items-center gap-4">
        <Select onValueChange={(value: "none" | "roman" | "full") => setGroupingLevel(value)} defaultValue="none">
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Gruppierung auswählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">Keine Gruppierung</SelectItem>
            <SelectItem value="roman">Gruppieren (ohne römische Ziffern)</SelectItem>
            <SelectItem value="full">Gruppieren (ohne Ziffern & römische Ziffern)</SelectItem>
          </SelectContent>
        </Select>
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
        <Button onClick={exportStatisticsToCsv}>Statistik Export CSV</Button>
      </div>

      <div className="flex justify-end items-center gap-4">
        <Select onValueChange={setSelectedYear} defaultValue="all">
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Jahr auswählen" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Alle Jahre</SelectItem>
            {uniqueYears.map(year => (
              <SelectItem key={year} value={String(year)}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={exportFullDataToCsv}>Vollständiger Export CSV</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Miethäufigkeit</CardTitle>
        </CardHeader>
        <CardContent>
          <ul>
            {sortedRentalFrequency.map(([tool, count]) => (
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
            {sortedAverageRentalDuration.map(([tool, duration]) => (
              <li key={tool}><strong>{tool}:</strong> {duration.toFixed(2)}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
