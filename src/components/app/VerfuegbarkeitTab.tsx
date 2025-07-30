import { Input } from "@/components/ui/input";
import { tools } from "@/lib/data";
import { ToolEintrag } from "@/../types/types";
import { useState } from "react";

interface VerfuegbarkeitTabProps {
  eintraege: ToolEintrag[];
}

export default function VerfuegbarkeitTab({ eintraege }: VerfuegbarkeitTabProps) {
  const [toolSuche, setToolSuche] = useState("");

  const ausgelieheneTools = eintraege
    .filter((e) => !e.zurueckgegeben)
    .map((e) => e.tool);

  const gefilterteTools = tools.filter((tool) =>
    tool.toLowerCase().includes(toolSuche.toLowerCase())
  );

  return (
    <div>
      <h2 className="text-xl font-semibold mt-4 mb-2">Tool Verfügbarkeit</h2>
      <Input
        placeholder="Suche nach einem Tool"
        value={toolSuche}
        onChange={(e) => setToolSuche(e.target.value)}
        className="mb-4"
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
        {gefilterteTools.length > 0 ? (
          gefilterteTools.map((tool) => {
            const isAusgeliehen = ausgelieheneTools.includes(tool);
            const toolClass = isAusgeliehen
              ? "bg-red-100 text-red-900"
              : "bg-green-100 text-green-900";

            return (
              <div key={tool} className={`${toolClass} px-3 py-2 rounded-md shadow-sm`}>
                {tool}
              </div>
            );
          })
        ) : (
          <p className="text-sm text-muted-foreground">Keine Tools gefunden.</p>
        )}
      </div>
    </div>
  );
}
