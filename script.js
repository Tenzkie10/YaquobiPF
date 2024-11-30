// Graphs for each store
const storeGraphs = {
    robinsons: {
        "Entrance": { "Fruits": 2, "Vegetables": 4 },
        "Fruits": { "Entrance": 2, "Meat": 3 },
        "Vegetables": { "Entrance": 4, "Dairy": 5 },
        "Meat": { "Fruits": 3, "Beverages": 6 },
        "Dairy": { "Vegetables": 5, "Beverages": 2 },
        "Beverages": { "Meat": 6, "Dairy": 2 },
    },
    hypermarket: {
        "Entrance": { "Snacks": 3, "Produce": 5 },
        "Snacks": { "Entrance": 3, "Frozen": 4 },
        "Produce": { "Entrance": 5, "Bakery": 6 },
        "Frozen": { "Snacks": 4, "Canned Goods": 7 },
        "Bakery": { "Produce": 6, "Canned Goods": 3 },
        "Canned Goods": { "Frozen": 7, "Bakery": 3 },
    },
    savemore: {
        "Entrance": { "Pantry": 2, "Seafood": 4 },
        "Pantry": { "Entrance": 2, "Deli": 3 },
        "Seafood": { "Entrance": 4, "Bakery": 5 },
        "Deli": { "Pantry": 3, "Frozen Foods": 6 },
        "Bakery": { "Seafood": 5, "Frozen Foods": 2 },
        "Frozen Foods": { "Deli": 6, "Bakery": 2 },
    },
};

// Items for each store
const storeItems = {
    robinsons: ["Fruits", "Vegetables", "Meat", "Dairy", "Beverages"],
    hypermarket: ["Snacks", "Produce", "Frozen", "Bakery", "Canned Goods"],
    savemore: ["Pantry", "Seafood", "Deli", "Bakery", "Frozen Foods"],
};

// Populate items based on the selected store
function populateItems(store) {
    const container = document.getElementById("items-container");
    container.innerHTML = ""; // Clear previous items
    const items = storeItems[store];

    items.forEach(item => {
        const label = document.createElement("label");
        label.innerHTML = `<input type="checkbox" value="${item}" class="item"> ${item}`;
        container.appendChild(label);
        container.appendChild(document.createElement("br"));
    });

    clearRoute(); // Automatically clear routes when changing the store
}

// Clear route function
function clearRoute() {
    const tableBody = document.querySelector("#route-table tbody");
    tableBody.innerHTML = ""; // Clear table rows
    document.getElementById("total-cost").textContent = ""; // Clear total cost
}

// Uniform Cost Search (UCS)
function findShortestPath(graph, start, goals) {
    const priorityQueue = [{ node: start, cost: 0, path: [start] }];
    const visited = new Set();
    let results = [];

    while (priorityQueue.length) {
        // Sort by cost
        priorityQueue.sort((a, b) => a.cost - b.cost);
        const { node, cost, path } = priorityQueue.shift();

        // Skip if already visited
        if (visited.has(node)) continue;
        visited.add(node);

        // Check if it's a goal
        if (goals.includes(node)) {
            results.push({ path, cost, item: node });
            goals = goals.filter(goal => goal !== node); // Remove found goal
            if (goals.length === 0) break;
        }

        // Add neighbors to the queue
        for (const [neighbor, weight] of Object.entries(graph[node] || {})) {
            if (!visited.has(neighbor)) {
                priorityQueue.push({
                    node: neighbor,
                    cost: cost + weight,
                    path: [...path, neighbor],
                });
            }
        }
    }
    return results;
}

// Event listener for finding the route
document.getElementById("find-route").addEventListener("click", () => {
    const store = document.getElementById("store").value;
    const selectedItems = Array.from(document.querySelectorAll(".item:checked")).map(item => item.value);

    if (selectedItems.length === 0) {
        alert("Please select at least one item.");
        return;
    }

    const graph = storeGraphs[store];
    const routes = findShortestPath(graph, "Entrance", selectedItems);

    // Populate table with animation
    const tableBody = document.querySelector("#route-table tbody");
    tableBody.innerHTML = ""; // Clear previous results

    routes.forEach((route, index) => {
        const row = document.createElement("tr");
        row.classList.add("animated");
        row.innerHTML = `
            <td>${route.item}</td>
            <td>${route.path.join(" → ")}</td>
            <td>${route.cost}</td>
        `;

        // Add delay for animation
        setTimeout(() => {
            tableBody.appendChild(row);
        }, index * 100); // Incremental delay for each row
    });

    // Update total cost after rows are displayed
    setTimeout(() => {
        document.getElementById("total-cost").textContent = `Total Cost: ${totalCost}`;
    }, routes.length * 100);
});

document.getElementById("clear-route").addEventListener("click", clearRoute);

// Initialize with the first store
populateItems("robinsons");