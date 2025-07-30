import { tools } from "@/lib/data";
import { ToolEintrag } from "@/../types/types";

interface KalenderTabProps {
  eintraege: ToolEintrag[];
}

export default function KalenderTab({ eintraege }: KalenderTabProps) {
  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="table-auto text-sm">
        <thead>
          <tr>
            <th className="p-2 border-r bg-muted text-left">Tool</th>
            {Array.from({ length: 60 }).map((_, i) => {
              const date = new Date();
              date.setDate(date.getDate() - 7 + i); // 7 Tage rückblickend
              return (
                <th key={i} className="p-2 border-r text-center">
                  {date.toLocaleDateString("de-DE", { day: "2-digit", month: "2-digit" })}
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {tools.map((tool) => {
            const belegteTage = eintraege
              .filter((e) => e.tool === tool)
              .flatMap((e) => {
                const days = [];
                const start = new Date(e.versand);
                const end = new Date(e.rueckversand);
                while (start <= end) {
                  days.push(start.toDateString());
                  start.setDate(start.getDate() + 1);
                }
                return days;
              });

            return (
              <tr key={tool} className="border-t">
                <td className="p-2 border-r font-medium bg-muted text-left">{tool}</td>
                {Array.from({ length: 60 }).map((_, i) => {
                  const date = new Date();
                  date.setDate(date.getDate() - 7 + i);
                  const isBelegt = belegteTage.includes(date.toDateString());
                  return (
                    <td
                      key={i}
                      className={`h-6 w-10 border-r ${isBelegt ? "bg-red-300" : "bg-green-100"}`}
                      title={date.toDateString()}
                    ></td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
