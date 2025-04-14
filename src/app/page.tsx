"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const tools = [
  "Augenbinden", "Balltransport", "Catapult", "CollaborationPuzzle",
  "Complexity I", "Complexity II", "CultuRallye I", "CultuRallye II",
  "CultuRallye XXL I", "CultuRallye XXL II", "Band Mini I", "Band Mini II",
  "Band Mini III", "Band Standard I", "Band Standard II", "Band Standard III",
  "Band XXL I", "Band XXL II", "Band XXL III", "DominoEffect I",
  "DominoEffect II", "Spider-Rahmen", "Spider-Netz I", "Spider-Netz II",
  "Ecopoly", "EmotionCards 1 I", "EmotionCards 1 II", "EmotionCards 2",
  "EmotionCards DP", "FindMe", "Fliegender Teppich I",
  "Fliegender Teppich II", "Fliegender Teppich III", "FlottesRohr",
  "Fremde Welt I", "Fremde Welt II", "Fremde Welt III", "Future City I",
  "Future City II", "HeartSelling", "KommunikARTio I", "KommunikARTio II",
  "KommunikARTio III", "Leonardo's Bridge I", "Leonardo's Bridge II",
  "MagicNails I", "MagicNails II", "MetaBlog I", "MetaBlog II",
  "MetaBlog III", "MEBoard I", "MEBoard II", "MEBoard III", "MEBoard IV",
  "Moderationsbälle I", "Moderationsbälle II", "Pfadfinder I",
  "Pfadfinder II", "Pfadfinder III", "PerspActive I", "PerspActive II",
  "PerspActive III", "Pipeline I", "Pipeline II", "Pipeline III",
  "RealityCheck 1 I", "RealityCheck 1 II", "RealityCheck 2 I",
  "RealityCheck 2 II", "RealityCheck 2 III", "ScenarioCards 1 I",
  "ScenarioCards 1 II", "ScenarioCards 1 III", "ScenarioCards 1 IV",
  "ScenarioCards 1 V", "ScenarioCards 1 VI", "ScenarioCards 2 I",
  "ScenarioCards 2 II", "ScenarioCards 2 III", "ScenarioCards 2 IV",
  "ScenarioCards 2 V", "ScenarioCards 2 VI", "Seifenkiste I",
  "Seifenkiste II", "Seifenkiste III", "Seil 14m", "Seil 4m",
  "SmartMarble", "Stackman", "Stein der Weisen I", "Stein der Weisen II",
  "Stein der Weisen III", "Stein der Weisen IV", "Stein der Weisen V",
  "Stein der Weisen VI", "Stein der Weisen VII", "SysTeam I", "SysTeam II",
  "SysTeam III", "SysTeam IV", "Team² I", "Team² II", "Team² III",
  "Team² IV", "Team² V", "TeamNavigator I", "TeamNavigator II",
  "Tower of Power I", "Tower of Power II", "Tower of Power III",
  "Tower of Power IV", "Tower of Power V", "Tower of Power Mini",
  "Tower of Power Werte I", "Tower of Power Werte II", "Unmögliche Stäbe",
  "Verflixte Schlinge I", "Verflixte Schlinge II", "Verflixte Schlinge III",
  "Verflixte Schlinge IV", "Verflixte Schlinge V", "Verflixte Schlinge VI",
  "Verflixte Schlinge VII", "Verflixte Schlinge VIII",
  "Verflixte Schlinge IX", "Verflixte Schlinge X", "Verflixte Schlinge XI",
  "Wortspiel I", "Wortspiel II", "Zauberstab I", "Zauberstab II",
  "Zauberstab III", "Zauberstab IV", "Teambalken"
];

const mitarbeiter = [
  "Nick", "Bastian", "Vincent", "Nino", "Alessandra",
  "Tamara", "Tobias", "Walter", "Anna-Lena"
];

interface ToolEintrag {
  tool: string;
  name: string;
  kontakt: string;
  versand: Date;
  versendetVon: string;
  rueckversand: Date;
  istZurueck?: string;
  rueckgabeDatum?: Date;
  eingelagertVon?: string;
  geprueft?: string;
  kommentar?: string;
}

export default function ToolVerleihApp() {
  const [user, setUser] = useState<string | null>(null);
  const [form, setForm] = useState<ToolEintrag>({
    tool: "",
    name: "",
    kontakt: "",
    versand: new Date(),
    versendetVon: "",
    rueckversand: new Date(),
  });
  const [eintraege, setEintraege] = useState<ToolEintrag[]>([]);
  const [toolSuche, setToolSuche] = useState("");
  const [statusFilter, setStatusFilter] = useState("Alle");

  const handleChange = (key: keyof ToolEintrag, value: string | Date | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const speichern = () => {
    setEintraege((prev) => [...prev, form]);
    setForm({
      tool: "",
      name: "",
      kontakt: "",
      versand: new Date(),
      versendetVon: "",
      rueckversand: new Date(),
    });
  };

  const alsZurueckMarkieren = (index: number) => {
    const now = new Date();
    setEintraege((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        istZurueck: "Ja",
        rueckgabeDatum: now,
        eingelagertVon: user || "",
        geprueft: "Ja",
      };
      return updated;
    });
  };

  const ausgelieheneTools = eintraege.filter((e) => e.istZurueck !== "Ja").map((e) => e.tool);
  const freieTools = tools.filter((tool) => !ausgelieheneTools.includes(tool));
  const gefilterteFreieTools = freieTools.filter((tool) =>
    tool.toLowerCase().includes(toolSuche.toLowerCase())
  );

  const gefilterteEintraege = eintraege.filter((e) => {
    if (statusFilter === "Verliehen") return e.istZurueck !== "Ja";
    if (statusFilter === "Zurück") return e.istZurueck === "Ja";
    return true;
  });

  

  if (!user) {
    return (
      <div className="max-w-md mx-auto mt-10 p-4">
        <h2 className="text-xl font-semibold mb-2">Login</h2>
        <Select onValueChange={(val) => setUser(val)}>
          <SelectTrigger>
            <SelectValue placeholder="Mitarbeiter wählen" />
          </SelectTrigger>
          <SelectContent>
            {mitarbeiter.map((m) => (
              <SelectItem key={m} value={m}>
                {m}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-2">Willkommen, {user}</h1>
      <Tabs defaultValue="verleih" className="w-full">
        <TabsList>
          <TabsTrigger value="verleih">📋 Verleih</TabsTrigger>
          <TabsTrigger value="verfuegbar">✅ Verfügbarkeit</TabsTrigger>
          <TabsTrigger value="kalender">🗓️ Kalender</TabsTrigger>
          <TabsTrigger value="regal">📦 Regalplan</TabsTrigger>
        </TabsList>

        <TabsContent value="verleih">
          <Card><CardContent className="space-y-4 pt-4">
            <Select onValueChange={(val) => handleChange("tool", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Tool wählen" />
              </SelectTrigger>
              <SelectContent>
                {tools.map((tool) => (
                  <SelectItem key={tool} value={tool}>{tool}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input placeholder="Name des Kunden" value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
            <Input placeholder="E-Mail des Kunden" value={form.kontakt} onChange={(e) => handleChange("kontakt", e.target.value)} />

            <div>
              <label className="font-medium">Versanddatum</label>
              <DatePicker selected={form.versand} onChange={(date) => handleChange("versand", date)} dateFormat="dd.MM.yyyy" className="w-full p-2 border rounded-md" />
            </div>

            <Select onValueChange={(val) => handleChange("versendetVon", val)}>
              <SelectTrigger>
                <SelectValue placeholder="Versendet von" />
              </SelectTrigger>
              <SelectContent>
                {mitarbeiter.map((m) => (
                  <SelectItem key={m} value={m}>{m}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div>
              <label className="font-medium">Geplanter Rückversand</label>
              <DatePicker selected={form.rueckversand} onChange={(date) => handleChange("rueckversand", date)} dateFormat="dd.MM.yyyy" className="w-full p-2 border rounded-md" />
            </div>

            <Button onClick={speichern}>Speichern</Button>
          </CardContent></Card>

          {eintraege.length > 0 && (
            <div className="mt-6">
              <h2 className="text-xl font-semibold mb-2">Verliehene Tools</h2>
              <div className="flex items-center gap-4 mb-4">
                <Select onValueChange={(val) => setStatusFilter(val)}>
                  <SelectTrigger><SelectValue placeholder="Filter wählen" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Alle">Alle</SelectItem>
                    <SelectItem value="Verliehen">Nur verliehen</SelectItem>
                    <SelectItem value="Zurück">Nur zurück</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="border rounded-md p-4 space-y-4">
                {gefilterteEintraege.map((eintrag, index) => (
                  <div key={index} className="border-b pb-2">
                    <p><strong>Tool:</strong> {eintrag.tool}</p>
                    <p><strong>Kunde:</strong> {eintrag.name}</p>
                    <p><strong>Kontakt:</strong> {eintrag.kontakt}</p>
                    <p><strong>Versendet:</strong> {eintrag.versand.toLocaleDateString()} von {eintrag.versendetVon}</p>
                    <p><strong>Geplanter Rückversand:</strong> {eintrag.rueckversand.toLocaleDateString()}</p>
                    {eintrag.istZurueck === "Ja" ? (
                      <p><strong>Zurück:</strong> {eintrag.rueckgabeDatum?.toLocaleDateString()} von {eintrag.eingelagertVon} – Geprüft: {eintrag.geprueft}</p>
                    ) : (
                      <Button size="sm" onClick={() => alsZurueckMarkieren(index)}>Als zurück markieren</Button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        <TabsContent value="verfuegbar">
          <h2 className="text-xl font-semibold mt-4 mb-2">Verfügbare Tools</h2>
          <Input placeholder="Suche verfügbares Tool" value={toolSuche} onChange={(e) => setToolSuche(e.target.value)} className="mb-4" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {gefilterteFreieTools.length > 0 ? (
              gefilterteFreieTools.map((tool) => (
                <div key={tool} className="bg-green-100 text-green-900 px-3 py-2 rounded-md shadow-sm">
                  {tool}
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">Keine passenden Tools verfügbar.</p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="kalender">
  <h2 className="text-xl font-semibold mt-4 mb-2">Kalenderansicht</h2>
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
</TabsContent>

        <TabsContent value="regal">
          <h2 className="text-xl font-semibold mt-4 mb-4">📦 Regalplan</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Oberstes Fach</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted p-2 rounded-md"></div>
                <div className="bg-muted p-2 rounded-md">FremdeWelt, Team², Magic Nails, Flottes Rohr, Complexity, Balltransport</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Fach 3</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted p-2 rounded-md">Catapult, HeartSelling, CollaborationPuzzle, FutureCity, TeamNavi, Kleine Tools</div>
                <div className="bg-muted p-2 rounded-md">Pfadfinder, Wortspiel, MeBoard, KommunikARTio, Fliegender Teppich</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Fach 2</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted p-2 rounded-md">Tower</div>
                <div className="bg-muted p-2 rounded-md">Tower mini, Karten, Bänder</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Fach 1</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted p-2 rounded-md">Magazine</div>
                <div className="bg-muted p-2 rounded-md">Domino, LeoBridge, Stackman, Teambalken, Spider</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Fach 0</h3>
              <div className="grid grid-cols-2 gap-2">
                <div className="bg-muted p-2 rounded-md">Magazine</div>
                <div className="bg-muted p-2 rounded-md">SysTeam, CultuRallye, PerspActive</div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
