export default function RegalplanTab() {
  return (
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
  );
}
