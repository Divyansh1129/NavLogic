export function dijkstra(graph, start, end) {
  const distances = {};
  const prev = {};
  const pq = [];

  for (let node in graph) {
    distances[node] = Infinity;
    prev[node] = null;
  }

  distances[start] = 0;
  pq.push({ node: start, dist: 0 });

  while (pq.length > 0) {
    pq.sort((a, b) => a.dist - b.dist);
    const { node: current } = pq.shift();

    if (current === end) break;

    for (let neighbor of graph[current] || []) {
      const newDist = distances[current] + neighbor.weight;

      if (newDist < distances[neighbor.node]) {
        distances[neighbor.node] = newDist;
        prev[neighbor.node] = current;

        pq.push({ node: neighbor.node, dist: newDist });
      }
    }
  }

  if (!distances[end] || distances[end] === Infinity) {
    return { path: [], distance: "No path" };
  }

  let path = [];
  let curr = end;

  while (curr) {
    path.unshift(curr);
    curr = prev[curr];
  }

  return {
    path,
    distance: distances[end].toFixed(2) + " km",
  };
}