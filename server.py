from flask_cors import CORS
from collections import defaultdict
from heapq import heappush, heappop
from flask import Flask, jsonify, request
import os

# Create the Flask application instance
app = Flask(__name__, static_folder='../frontend/build', static_url_path='')

# Configure CORS. This allows requests from a specific origin (e.g., your frontend).
CORS(app, resources={r"/shortd/*": {"origins": "http://localhost:3000"}})

# Dictionary to map node IDs to their names
node_map = {
    1: "cse",
    2: "main gate.",
    3: "AI & IT Dept.",
    4: "LHC C",
    5: "Centre main gate",
    6: "Sbi Gate",
    7: "Beach",
    8: "LHC D",
   
}

# The graph with integer keys and a mapping of neighboring nodes to their IDs.
graph = {
    1: {2: 250, 3: 300}, # cse
    2: {1: 250, 5: 350, 3: 200}, # AI & IT Dept.
    3: {2: 200, 1: 300, 4: 150}, # LHC C
    4: {5: 100, 3: 150, 6: 300}, # Sbi Gate
    5: {6: 350, 2: 350, 4: 100},
    6: {4: 300, 7: 800,8:50},
    7: {6: 800},
    8: { 6: 50},
   
}

@app.route('/')
def hello_world():
    """
    Landing page route.
    """
    return 'Landing!'


@app.route('/shortd/<int:a>/<int:b>')
def shortestPath(a, b):
    """
    Calculates the shortest path between two nodes using Dijkstra's algorithm.
    The nodes are now integers.
    """
    src = a
    dst = b

    try:
        if src not in graph or dst not in graph:
            return jsonify({"error": "Invalid source or destination node ID."}), 404

        g = defaultdict(list)
        for u in graph:
            for v, wt in graph[u].items():
                g[u].append([v, wt])
                g[v].append([u, wt])

        inf = float('inf')
        distance = defaultdict(lambda: inf)
        distance[src] = 0
        
        smallest = []
        heappush(smallest, [distance[src], src])
        
        path = {}
        
        while smallest:
            dis, node = heappop(smallest)
            
            if dis > distance[node]:
                continue
            
            for neigh, cost in g[node]:
                if dis + cost < distance[neigh]:
                    path[neigh] = node
                    distance[neigh] = dis + cost
                    heappush(smallest, [distance[neigh], neigh])

        if distance[dst] == inf:
            return jsonify({"error": "Path does not exist between the specified nodes."}), 404
        
        netdis = distance[dst]
        
        ans = []
        current = dst
        while current != src:
            ans.append(node_map.get(current, f"Node {current}"))
            current = path[current]
        ans.append(node_map.get(src, f"Node {src}"))
        
        res_path = ans[::-1]
        
        result = {
            "from": node_map.get(src, f"Node {src}"),
            "to": node_map.get(dst, f"Node {dst}"),
            "path": res_path,
            "totalDis": netdis
        }
        
        return jsonify(result)

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
