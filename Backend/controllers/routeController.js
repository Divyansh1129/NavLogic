import { dijkstra } from "../algorithms/dijkstra.js";

function getDistance(a, b) {
  const R = 6371;

  const dLat = (b.lat - a.lat) * Math.PI / 180;
  const dLng = (b.lng - a.lng) * Math.PI / 180;

  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(a.lat * Math.PI / 180) *
    Math.cos(b.lat * Math.PI / 180) *
    Math.sin(dLng / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));

  return R * c;
}


function getAllPaths(graph, start, end, visited = new Set(), path = [], result = []) {
  visited.add(start);
  path.push(start);

  if (start === end) {
    result.push([...path]);
  } else {
    for (let n of graph[start] || []) {
      if (!visited.has(n.node)) {
        getAllPaths(graph, n.node, end, visited, path, result);
      }
    }
  }

  path.pop();
  visited.delete(start);

  return result;
}

export const findRoute = (req, res) => {
  try {
    const { source, destination, cities, edges } = req.body;

    const graph = {};

    edges.forEach(edge => {
      const dist = getDistance(cities[edge.from], cities[edge.to]);

      if (!graph[edge.from]) graph[edge.from] = [];
      graph[edge.from].push({ node: edge.to, weight: dist });

      if (!graph[edge.to]) graph[edge.to] = [];
      graph[edge.to].push({ node: edge.from, weight: dist });
    });

   
    const best = dijkstra(graph, source, destination);

   
    const allRaw = getAllPaths(graph, source, destination);

    const allPaths = allRaw.map(p => {
      let total = 0;
      for (let i = 0; i < p.length - 1; i++) {
        total += getDistance(cities[p[i]], cities[p[i + 1]]);
      }

      return {
        path: p,
        distance: total.toFixed(2) + " km",
      };
    });

    res.json({
      bestPath: best,
      allPaths: allPaths,
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};