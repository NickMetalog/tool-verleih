// VerleihTab.tsx
// This component provides the UI for managing tool rentals.
// It includes a form to create new rental entries and a list to display existing ones.
// Users can filter the list to view all, currently rented, or returned tools.

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToolEintrag } from "../../../types/types";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

// Props definition for the VerleihTab component.
interface VerleihTabProps {
  eintraege: ToolEintrag[]; // Array of tool rental entries.
  onSave: (form: Omit<ToolEintrag, "id" | "created_at">) => void; // Callback to save a new entry.
  onDelete: (id: string) => void; // Callback to delete an entry.
  onReturn: (id: string, kontrolliert: boolean, kontrolliert_von: string, tatsaechliches_rueckgabedatum?: string) => void; // Callback to mark a tool as returned.
  onUpdateComment: (id: string, kommentar: string) => void;
  onArchive: (id: string) => void;
  onUnarchive: (id: string) => void;
  availableTools: string[];
  onRevertReturn: (id: string) => void;
  currentUser: string;
  onUpdateRueckversand: (id: string, newDate: string) => void;
  sortBy: string;
  setSortBy: (sortBy: string) => void;
  sortOrder: boolean;
  setSortOrder: (sortOrder: boolean) => void;
}

// The main component for the tool rental tab.
export default function VerleihTab({ eintraege, onSave, onDelete, onReturn, onUpdateComment, onArchive, onUnarchive, availableTools, onRevertReturn, currentUser, onUpdateRueckversand, sortBy, setSortBy, sortOrder, setSortOrder }: VerleihTabProps) {
  const [showArchived, setShowArchived] = useState(false);
  const [editingRueckversandId, setEditingRueckversandId] = useState<string | null>(null);
  // State for the new rental form.
  const [form, setForm] = useState({
    tool: "",
    an: "",
    email_kunde: "",
    versand: new Date(),
    rueckversand: new Date(),
    kommentar: "",
  });

  // Handles changes in the form fields and updates the form state.
  const handleChange = (key: keyof Omit<typeof form, "von">, value: string | Date | null) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  // Saves the new rental entry and resets the form.
  const speichern = () => {
    if (!form.tool || !form.an) {
      alert("Bitte füllen Sie alle erforderlichen Felder aus: Tool und Kunde.");
      return;
    }
    onSave({
      ...form,
      von: currentUser,
      email_kunde: form.email_kunde,
      versand: form.versand.toISOString(),
      rueckversand: form.rueckversand.toISOString(),
      zurueckgegeben: false,
      kontrolliert: false,
      kontrolliert_von: "",
      kommentar: form.kommentar,
    });
    setForm({
      tool: "",
      an: "",
      email_kunde: "",
      versand: new Date(),
      rueckversand: new Date(),
      kommentar: "",
    });
  };

  const isOverdue = (eintrag: ToolEintrag) => {
    if (eintrag.zurueckgegeben) {
      return null; // Not overdue if already returned
    }
    const plannedReturnDate = new Date(eintrag.rueckversand);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today's date to compare

    const diffTime = today.getTime() - plannedReturnDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 0 && diffDays <= 7) {
      return "overdue-week"; // Overdue by up to one week
    } else if (diffDays > 7) {
      return "overdue-long"; // Overdue by more than one week
    }
    return null; // Not overdue
  };

  return (
    <div>
      {/* Form for creating a new rental entry. */}
      <Card>
        <CardContent className="space-y-4 pt-4">
          {/* Tool selection dropdown. */}
          <Select onValueChange={(val) => handleChange("tool", val)}>
            <SelectTrigger>
              <SelectValue placeholder="Tool wählen" />
            </SelectTrigger>
            <SelectContent>
              {availableTools.map((tool) => (
                <SelectItem key={tool} value={tool}>{tool}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Customer input fields. */}
          <Input placeholder="Kunde" value={form.an} onChange={(e) => handleChange("an", e.target.value)} />
          <Input placeholder="E-Mail des Kunden" value={form.email_kunde} onChange={(e) => handleChange("email_kunde", e.target.value)} />

          {/* Shipping date picker. */}
          <div>
            <label className="font-medium">Versanddatum</label>
            <DatePicker selected={form.versand} onChange={(date) => handleChange("versand", date)} dateFormat="dd.MM.yyyy" className="w-full p-2 border rounded-md" />
          </div>

          {/* Planned return date picker. */}
          <div>
            <label className="font-medium">Geplanter Rückversand</label>
            <DatePicker selected={form.rueckversand} onChange={(date) => handleChange("rueckversand", date)} dateFormat="dd.MM.yyyy" className="w-full p-2 border rounded-md" />
          </div>

          <Textarea placeholder="Kommentar hinzufügen..." value={form.kommentar} onChange={(e) => handleChange("kommentar", e.target.value)} />

          <Button onClick={speichern}>Speichern</Button>
        </CardContent>
      </Card>

      {/* Display the list of rental entries if there are any. */}
      {eintraege.length > 0 && (
        <div className="mt-6">
          <div className="flex justify-between items-center mb-2">
            <h2 className="text-xl font-semibold">Verliehene Tools</h2>
            <div className="flex space-x-2">
              <Select onValueChange={setSortBy} defaultValue={sortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sortieren nach" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Erstellungsdatum</SelectItem>
                  <SelectItem value="zurueckgegeben">Status</SelectItem>
                  <SelectItem value="rueckversand">Rückversanddatum</SelectItem>
                </SelectContent>
              </Select>
              <Select onValueChange={(value) => setSortOrder(value === "asc")} defaultValue={sortOrder ? "asc" : "desc"}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Reihenfolge" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asc">Aufsteigend</SelectItem>
                  <SelectItem value="desc">Absteigend</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => setShowArchived(!showArchived)}>
                {showArchived ? "Aktive anzeigen" : "Archiv anzeigen"}
              </Button>
            </div>
          </div>
          {/* Container for the list of filtered entries. */}
          <div className="border rounded-md p-4 space-y-4">
            {eintraege
              .filter(eintrag => !!eintrag.archived === showArchived)
              .map((eintrag) => {
                const overdueStatus = isOverdue(eintrag);
                const itemClasses = `border-b pb-2 ${eintrag.zurueckgegeben ? "bg-gray-100" : ""} ${overdueStatus === "overdue-week" ? "bg-yellow-100 border-yellow-400" : ""} ${overdueStatus === "overdue-long" ? "bg-red-100 border-red-400" : ""}`;

                return (
                  <div key={eintrag.id} className={itemClasses}>
                    <p><strong>Tool:</strong> {eintrag.tool}</p>
                    <p><strong>Kunde:</strong> {eintrag.an} ({eintrag.email_kunde})</p>
                    <p><strong>Versendet:</strong> {new Date(eintrag.versand).toLocaleDateString()} von {eintrag.von}</p>
                    <div>
                      <strong>Geplanter Rückversand:</strong>{" "}
                      {editingRueckversandId === eintrag.id ? (
                        <DatePicker
                          selected={new Date(eintrag.rueckversand)}
                          onChange={(date) => {
                            if (date) {
                              onUpdateRueckversand(eintrag.id!, date.toISOString());
                              setEditingRueckversandId(null); // Close date picker after selection
                            }
                          }}
                          onBlur={() => setEditingRueckversandId(null)} // Close on blur
                          dateFormat="dd.MM.yyyy"
                          className="w-full p-2 border rounded-md"
                          autoFocus // Focus the date picker when it opens
                        />
                      ) : (
                        <span
                          onClick={() => setEditingRueckversandId(eintrag.id!)}
                          className="cursor-pointer text-blue-600 hover:underline"
                        >
                          {new Date(eintrag.rueckversand).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    {eintrag.zurueckgegeben && eintrag.tatsaechliches_rueckgabedatum && (
                      <p><strong>Zurück am:</strong> {new Date(eintrag.tatsaechliches_rueckgabedatum).toLocaleDateString()}</p>
                    )}
                    <Textarea
                      placeholder="Kommentar bearbeiten..."
                      defaultValue={eintrag.kommentar}
                      onBlur={(e) => onUpdateComment(eintrag.id!, e.target.value)}
                      className="mt-2"
                    />
                    <div className="flex items-center space-x-2 mt-2">
                      <Input
                        type="checkbox"
                        checked={eintrag.kontrolliert}
                        // The checkbox is disabled if the item has not been returned.
                        // A returned item is checked by default, but can be unchecked.
                        disabled={!eintrag.zurueckgegeben}
                        onChange={(e) => {
                          // When the checkbox is changed for a returned item,
                          // call the onReturn function to update the 'kontrolliert' status.
                          // We pass the existing 'kontrolliert_von' value, or a placeholder.
                          onReturn(eintrag.id!, e.target.checked, eintrag.kontrolliert_von || currentUser);
                        }}
                        className="h-4 w-4"
                      />
                      <label>Kontrolliert</label>
                    </div>
                    
                    {eintrag.zurueckgegeben ? (
                      <div>
                        <p className="text-green-600 font-semibold mt-2">
                          Zurückgegeben von: {eintrag.kontrolliert_von || 'N/A'}
                        </p>
                        <Button size="sm" onClick={() => onRevertReturn(eintrag.id!)} className="ml-2 mt-2">Erneut Verleihen</Button>
                      </div>
                    ) : (
                      // TODO: Replace 'testuser@example.com' with actual user data from an auth hook/session.
                      <Button size="sm" onClick={() => onReturn(eintrag.id!, false, currentUser, new Date().toISOString())} className="ml-2 mt-2">Zurückgeben</Button>
                    )}
                    
                    <Button variant="destructive" size="sm" onClick={() => {
                      if (window.confirm("Sind Sie sicher, dass Sie diesen Eintrag löschen möchten?")) {
                        onDelete(eintrag.id!);
                      }
                    }} className="ml-2 mt-2">Löschen</Button>
                    {eintrag.archived ? (
                      <Button size="sm" onClick={() => onUnarchive(eintrag.id!)} className="ml-2 mt-2">Dearchivieren</Button>
                    ) : (
                      <Button size="sm" onClick={() => onArchive(eintrag.id!)} className="ml-2 mt-2" disabled={!eintrag.zurueckgegeben}>Archivieren</Button>
                    )}
                  </div>
                );
              })}
          </div>
        </div>
      )}
    </div>
  );
}
