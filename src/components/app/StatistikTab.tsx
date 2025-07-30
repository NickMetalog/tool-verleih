import { ToolEintrag } from "../../../types/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface StatistikTabProps {
  eintraege: ToolEintrag[];
}

export default function StatistikTab({ eintraege }: StatistikTabProps) {
  const getRentalFrequency = () => {
    const frequency: { [key: string]: number } = {};
    eintraege.forEach(eintrag => {
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
    eintraege.forEach(eintrag => {
      const versand = new Date(eintrag.versand);
      const rueckversand = new Date(eintrag.rueckversand);
      const duration = (rueckversand.getTime() - versand.getTime()) / (1000 * 3600 * 24);
      if (durations[eintrag.tool]) {
        durations[eintrag.tool].push(duration);
      } else {
        durations[eintrag.tool] = [duration];
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
