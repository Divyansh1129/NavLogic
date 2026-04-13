import { useState } from "react";
import axios from "axios";
import {
  GoogleMap,
  Marker,
  Polyline,
  useJsApiLoader,
} from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const cities = {
  Jhansi: { lat: 25.4484, lng: 78.5685 },
  Gwalior: { lat: 26.2183, lng: 78.1828 },
  Agra: { lat: 27.1767, lng: 78.0081 },
  Delhi: { lat: 28.6139, lng: 77.2090 },
  Kanpur: { lat: 26.4499, lng: 80.3319 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Bhopal: { lat: 23.2599, lng: 77.4126 },
  Indore: { lat: 22.7196, lng: 75.8577 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Noida: { lat: 28.5355, lng: 77.3910 },
};

const edges = [
  { from: "Jhansi", to: "Gwalior" },
  { from: "Gwalior", to: "Agra" },
  { from: "Agra", to: "Delhi" },
  { from: "Jhansi", to: "Agra" },
  { from: "Jhansi", to: "Kanpur" },
  { from: "Kanpur", to: "Lucknow" },
  { from: "Lucknow", to: "Delhi" },
  { from: "Gwalior", to: "Bhopal" },
  { from: "Bhopal", to: "Indore" },
  { from: "Agra", to: "Jaipur" },
  { from: "Jaipur", to: "Delhi" },
  { from: "Delhi", to: "Noida" },
];

const normalize = (name) => {
  const lower = name.toLowerCase();
  if (lower.includes("delhi")) return "Delhi";
  if (lower.includes("jhansi")) return "Jhansi";
  if (lower.includes("agra")) return "Agra";
  if (lower.includes("gwalior")) return "Gwalior";
  if (lower.includes("kanpur")) return "Kanpur";
  if (lower.includes("lucknow")) return "Lucknow";
  if (lower.includes("bhopal")) return "Bhopal";
  if (lower.includes("indore")) return "Indore";
  if (lower.includes("jaipur")) return "Jaipur";
  if (lower.includes("noida")) return "Noida";
  return name;
};

function App() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [pathCoords, setPathCoords] = useState([]);
  const [allPaths, setAllPaths] = useState([]);
  const [bestPath, setBestPath] = useState(null);
  const [mapKey, setMapKey] = useState(0);

  const findRoute = async () => {
    try {
      setPathCoords([]);
      setBestPath(null);
      setAllPaths([]);
      setMapKey((prev) => prev + 1);

      setTimeout(async () => {
        const res = await axios.post(
          "https://navlogic1.onrender.com/api/route/find",
          { source, destination, cities, edges }
        );

        const best = res.data.bestPath;

        setBestPath(best);
        setAllPaths(res.data.allPaths);

        if (best.path.length > 0) {
          const coords = best.path.map((c) => cities[c]);
          setPathCoords(coords);
        }
      }, 100);
    } catch (err) {
      console.error(err);
      alert("Error finding route");
    }
  };

  const resetAll = () => {
    setSource("");
    setDestination("");
    setAllPaths([]);
    setBestPath(null);
    setPathCoords([]);
    setMapKey((prev) => prev + 1);
  };

  if (!isLoaded) return <h1>Loading...</h1>;

  return (
    <div className="h-screen flex bg-gradient-to-br from-blue-100 to-indigo-200">

      <div className="w-1/3 p-6 flex flex-col gap-4">

        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h1 className="text-2xl font-bold mb-2 text-indigo-600">
            NavLogic
          </h1>

          {/* 🔥 NOTICE ADDED HERE */}
          <div className="text-sm bg-yellow-100 text-yellow-800 p-2 rounded-lg mb-4 border border-yellow-300">
            ⚠️ Available only for: Jhansi, Delhi, Agra, Gwalior, Kanpur, Lucknow, Bhopal, Jaipur, and Noida
          </div>

          <input
            placeholder="Source"
            value={source}
            onChange={(e) => setSource(normalize(e.target.value))}
            className="w-full p-3 mb-3 border rounded-lg"
          />

          <input
            placeholder="Destination"
            value={destination}
            onChange={(e) => setDestination(normalize(e.target.value))}
            className="w-full p-3 mb-4 border rounded-lg"
          />

          <div className="flex gap-2">
            <button
              onClick={findRoute}
              className="flex-1 bg-indigo-600 text-white py-3 rounded-lg"
            >
              Find Route
            </button>

            <button
              onClick={resetAll}
              className="flex-1 bg-gray-300 py-3 rounded-lg"
            >
              Reset
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-4 overflow-auto">
          <h2 className="font-bold mb-2 text-indigo-600">
            Route Comparison
          </h2>

          {allPaths.map((p, i) => (
            <div key={i} className="mb-3 p-3 bg-gray-100 rounded-lg">
              <p>{p.path.join(" → ")}</p>
              <p>{parseFloat(p.distance).toFixed(2)} km</p>
            </div>
          ))}

          {bestPath && (
            <div className="mt-4 p-3 bg-green-200 rounded-lg">
              <p>{bestPath.path.join(" → ")}</p>
              <p>{parseFloat(bestPath.distance).toFixed(2)} km</p>
            </div>
          )}
        </div>
      </div>

      <div className="w-2/3 h-full">
        <GoogleMap
          key={mapKey}
          mapContainerStyle={containerStyle}
          center={{ lat: 26, lng: 78 }}
          zoom={6}
        >
          {pathCoords.length > 0 && (
            <>
              {pathCoords.map((coord, i) => (
                <Marker key={i} position={coord} />
              ))}
              <Polyline
                path={pathCoords}
                options={{ strokeColor: "#4f46e5", strokeWeight: 5 }}
              />
            </>
          )}
        </GoogleMap>
      </div>
    </div>
  );
}

export default App;