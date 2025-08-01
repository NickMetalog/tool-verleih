"use client";

import { useState, useEffect, useCallback } from "react";
import ToolVerleihDashboard from "@/components/app/ToolVerleihDashboard";
import LoginPage from "@/components/app/LoginPage";
import { supabase } from "@/lib/supabaseClient";
import { ToolEintrag } from "../../types/types";
import { tools } from "@/lib/data";

export default function Home() {
  const [eintraege, setEintraege] = useState<ToolEintrag[]>([]);
  const [availableTools, setAvailableTools] = useState<string[]>([]);
  const [loggedIn, setLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState("");
  const [sortBy, setSortBy] = useState<string>("created_at");
  const [sortOrder, setSortOrder] = useState<boolean>(false); // true for ascending, false for descending

  const fetchEintraege = useCallback(async () => {
    let query = supabase.from("verleih").select("*");

    // Apply sorting based on state
    if (sortBy === "created_at") {
      query = query.order("created_at", { ascending: sortOrder });
    } else if (sortBy === "zurueckgegeben") {
      query = query.order("zurueckgegeben", { ascending: sortOrder });
    } else if (sortBy === "rueckversand") {
      query = query.order("rueckversand", { ascending: sortOrder });
    }
    // Always apply secondary sorting for consistency if primary sort is not unique
    if (sortBy !== "created_at") {
      query = query.order("created_at", { ascending: false });
    }
    if (sortBy !== "zurueckgegeben") {
      query = query.order("zurueckgegeben", { ascending: true });
    }
    if (sortBy !== "rueckversand") {
      query = query.order("rueckversand", { ascending: true });
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching entries:", error);
    } else {
      const rentedTools = (data as ToolEintrag[])
        .filter((e) => !e.zurueckgegeben)
        .map((e) => e.tool);
      const available = tools.filter((t) => !rentedTools.includes(t));
      setAvailableTools(available);
      setEintraege(data as ToolEintrag[]);
    }
  }, [sortBy, sortOrder]); // Add sortBy and sortOrder as dependencies for useCallback

  useEffect(() => {
    if (loggedIn) {
      fetchEintraege();
    }
  }, [loggedIn, sortBy, sortOrder, fetchEintraege]);

  const handleLogin = (user: string, pass: string) => {
    if (pass === process.env.NEXT_PUBLIC_APP_PASSWORD) {
      setLoggedIn(true);
      setCurrentUser(user);
    } else {
      alert("Falsches Passwort");
    }
  };

  const handleSave = async (form: Omit<ToolEintrag, "id" | "created_at">) => {
    const { error } = await supabase.from("verleih").insert([form]);
    if (error) {
      console.error("Error saving entry:", error);
      alert(`Error saving: ${error.message}`);
    } else {
      fetchEintraege(); // Refresh the list
    }
  };

  const handleDelete = async (id: string) => {
    const originalEintraege = [...eintraege];
    // Optimistically update the UI by removing the item
    setEintraege(eintraege.filter((e) => e.id !== id));

    const { error } = await supabase.from("verleih").delete().eq("id", id);

    if (error) {
      console.error("Error deleting entry:", error);
      alert(`Error deleting: ${error.message}`);
      // If the delete fails, revert the UI change
      setEintraege(originalEintraege);
    }
  };

  const handleReturn = async (id: string, kontrolliert: boolean, kontrolliert_von: string, tatsaechliches_rueckgabedatum?: string) => {
    const originalEintraege = [...eintraege];
    const updatedEintraege = eintraege.map((e) =>
      e.id === id ? { ...e, zurueckgegeben: true, kontrolliert, kontrolliert_von, tatsaechliches_rueckgabedatum } : e
    );

    setEintraege(updatedEintraege);

    const updateData: { zurueckgegeben: boolean; kontrolliert: boolean; kontrolliert_von: string; tatsaechliches_rueckgabedatum?: string | null } = { zurueckgegeben: true, kontrolliert, kontrolliert_von };
    if (tatsaechliches_rueckgabedatum) {
      updateData.tatsaechliches_rueckgabedatum = tatsaechliches_rueckgabedatum;
    } else {
      updateData.tatsaechliches_rueckgabedatum = null; // Ensure it's explicitly null if not provided
    }

    const { error } = await supabase
      .from("verleih")
      .update(updateData)
      .eq("id", id);

    if (error) {
      console.error("Error updating document:", error);
      alert(`Error updating: ${error.message}`);
      setEintraege(originalEintraege);
    } else {
      fetchEintraege();
    }
  };

  const handleRevertReturn = async (id: string) => {
    const { error } = await supabase
      .from("verleih")
      .update({ zurueckgegeben: false, tatsaechliches_rueckgabedatum: null })
      .eq("id", id);

    if (error) {
      console.error("Error reverting return:", error);
      alert(`Error reverting return: ${error.message}`);
    } else {
      fetchEintraege();
    }
  };

  const handleUpdateComment = async (id: string, kommentar: string) => {
    const { error } = await supabase
      .from("verleih")
      .update({ kommentar })
      .eq("id", id);

    if (error) {
      console.error("Error updating comment:", error);
      alert(`Error updating comment: ${error.message}`);
    } else {
      fetchEintraege();
    }
  };

  const handleArchive = async (id: string) => {
    const { error } = await supabase
      .from("verleih")
      .update({ archived: true })
      .eq("id", id);

    if (error) {
      console.error("Error archiving entry:", error);
      alert(`Error archiving entry: ${error.message}`);
    } else {
      fetchEintraege();
    }
  };

  const handleUnarchive = async (id: string) => {
    const { error } = await supabase
      .from("verleih")
      .update({ archived: false })
      .eq("id", id);

    if (error) {
      console.error("Error unarchiving entry:", error);
      alert(`Error unarchiving entry: ${error.message}`);
    } else {
      fetchEintraege();
    }
  };

  const handleUpdateRueckversand = async (id: string, newDate: string) => {
    const { error } = await supabase
      .from("verleih")
      .update({ rueckversand: newDate })
      .eq("id", id);

    if (error) {
      console.error("Error updating planned return date:", error);
      alert(`Error updating planned return date: ${error.message}`);
    } else {
      fetchEintraege();
    }
  };

  if (!loggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <main className="min-h-screen p-4">
      <ToolVerleihDashboard
        eintraege={eintraege}
        onSave={handleSave}
        onDelete={handleDelete}
        onReturn={handleReturn}
        onUpdateComment={handleUpdateComment}
        onArchive={handleArchive}
        onUnarchive={handleUnarchive}
        availableTools={availableTools}
        onRevertReturn={handleRevertReturn}
        currentUser={currentUser}
        onUpdateRueckversand={handleUpdateRueckversand}
        sortBy={sortBy}
        setSortBy={setSortBy}
        sortOrder={sortOrder}
        setSortOrder={setSortOrder}
      />
    </main>
  );
}
