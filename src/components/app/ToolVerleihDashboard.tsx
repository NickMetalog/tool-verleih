import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import VerleihTab from "./VerleihTab";
import VerfuegbarkeitTab from "./VerfuegbarkeitTab";
import KalenderTab from "./KalenderTab";
import RegalplanTab from "./RegalplanTab";
import { ToolEintrag } from "@/../types/types";

// Props interface for the ToolVerleihDashboard component
interface ToolVerleihDashboardProps {
  eintraege: ToolEintrag[]; // An array of tool rental entries
  onSave: (form: Omit<ToolEintrag, "id" | "created_at">) => void; // Function to save a new entry
  onDelete: (id: string) => void; // Function to delete an entry
  onReturn: (id: string, kontrolliert: boolean, kontrolliert_von: string) => void; // Function to mark a tool as returned
  onUpdateComment: (id: string, kommentar: string) => void; // Function to update the comment for an entry
  availableTools: string[]; // An array of available tools
  onRevertReturn: (id: string) => void;
  currentUser: string;
}

// The main dashboard component for the tool rental application
export default function ToolVerleihDashboard({ eintraege, onSave, onDelete, onReturn, onUpdateComment, availableTools, onRevertReturn, currentUser }: ToolVerleihDashboardProps) {
  return (
    <div className="max-w-5xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-2">Willkommen, {currentUser}!</h1>
      {/* Tabs component to switch between different views */}
      <Tabs defaultValue="verleih" className="w-full">
        <TabsList>
          <TabsTrigger value="verleih">📋 Verleih</TabsTrigger>
          <TabsTrigger value="verfuegbar">✅ Verfügbarkeit</TabsTrigger>
          <TabsTrigger value="kalender">🗓️ Kalender</TabsTrigger>
          <TabsTrigger value="regal">📦 Regalplan</TabsTrigger>
        </TabsList>

        {/* Content for the 'Verleih' (Rental) tab */}
        <TabsContent value="verleih">
          <VerleihTab eintraege={eintraege} onSave={onSave} onDelete={onDelete} onReturn={onReturn} onUpdateComment={onUpdateComment} availableTools={availableTools} onRevertReturn={onRevertReturn} currentUser={currentUser} />
        </TabsContent>

        {/* Content for the 'Verfügbarkeit' (Availability) tab */}
        <TabsContent value="verfuegbar">
          <VerfuegbarkeitTab eintraege={eintraege} />
        </TabsContent>

        {/* Content for the 'Kalender' (Calendar) tab */}
        <TabsContent value="kalender">
          <KalenderTab eintraege={eintraege} />
        </TabsContent>

        {/* Content for the 'Regalplan' (Shelf Plan) tab */}
        <TabsContent value="regal">
          <RegalplanTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
