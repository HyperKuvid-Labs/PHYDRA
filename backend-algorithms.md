# Backend Algorithms (Technical Reference)

This document covers only the backend algorithms used in PHYDRA, including custom C++ engines and algorithmic logic in the FastAPI backend.

## 1) Algorithm Inventory

### Active in API flow
1. **Priority scoring engine** (`priorityCalculationEngine.cpp`)
2. **3D bin packing + rearrangement engine** (`3dBinPakckingAlgo.cpp`)
3. **Retrieval path planning engine** (`retrievalPathPlanning.cpp`)
4. **Placement/rearrangement optimizer for put-back operations** (`placingItem.cpp`)
5. **Greedy waste return selection (Python)** (`main.py`)

### Present as custom backend algorithm module (not wired in current API runtime)
6. **Waste management optimizer** (`wasteManagement.cpp`)

---

## 2) Priority Scoring Engine (`priorityCalculationEngine.cpp`)

### Purpose
Computes a normalized `priorityScore` per item before packing.

### Core model
The engine calculates a weighted score from multiple features:

- Item priority (normalized)
- Days to expiry (exponential decay)
- Usage limit (inverse relation)
- Preferred-zone match bonus
- Mass score (saturating exponential)
- Volume score (penalizes large volume)

Implemented weighted sum:

\[
\text{score} =
0.3\,s_{priority} +
0.2\,s_{expiry} +
0.1\,s_{usage} +
0.1\,s_{zone} +
0.1\,s_{mass} +
0.1\,s_{volume}
\]

with clamp to \([0,1]\).

### Feature formulas (as implemented)
- \(s_{priority} = \frac{itemPriority}{100}\)
- \(s_{expiry} = e^{-0.05\cdot\max(0,daysToExpiry)}\)
- \(s_{usage} = \frac{1}{1+\max(0,usageLimit)}\)
- \(s_{zone} = 1.0\) if in preferred zone else \(0.5\)
- \(s_{mass} = 1 - e^{-0.01\cdot mass}\)
- \(s_{volume} = e^{-0.01\cdot volume}\)

### Data structure strategy
- Uses a **max-priority queue** over `priorityScore` to maintain sorted retrieval order.
- Maintains an `unordered_map<itemId, Item>` for direct item updates.
- Rebuilds the queue after zone/usage updates.

---

## 3) 3D Bin Packing + Rearrangement (`3dBinPakckingAlgo.cpp`)

### Purpose
Places scored items into containers with preferred-zone bias, free-space management, and fallback rearrangement actions (`shift`, `move`, `remove`).

### Packing strategy
- Maintains per-container `ContainerState`:
  - `placedItems`
  - `freeSpaces`
- Each `FreeSpace` is ranked by **best-fit waste** for current item.
- On placement, splits occupied free space into up to 3 residual spaces:
  - above
  - right
  - front
- Calls `mergeFreeSpaces()` to remove contained/redundant spaces.

### Ordering rules
- Items are sorted before packing by:
  - `priorityScore` ascending (as currently coded)
  - then volume descending
- Tries preferred-zone containers first, then all containers.

### Rearrangement logic
If direct placement fails:
- attempts **in-container shift** of blocking items,
- else **move to other container**,
- else **remove** blocking item.

Every rearrangement is recorded as a structured step with from/to coordinates.

### Accessibility model
Defines access by overlap and depth-axis blocking relationships, and can estimate retrieval effort (`retrievalSteps`) by counting blockers.

---

## 4) Retrieval Path Planning (`retrievalPathPlanning.cpp`)

### Purpose
Produces action steps to retrieve one target item:
- `remove`
- `setAside`
- `retrieve`
- `placeBack`

### Blocking model
An item blocks target access if it is in front/under the target path by axis-overlap checks.

### Algorithms implemented
The planner exposes strategy selection:
- `astar` (default)
- `aco`
- fallback branch (`dijkstra`-style)

#### A* path style
- Uses `findOptimalRemovalSequence()` (currently mapped to `findBlockingItems()`)
- If target is directly accessible, returns immediate `retrieve`.
- Else outputs remove/setAside for blockers, retrieve target, then reverse placeBack.

#### Dijkstra-style branch
- Similar step generation flow.
- Internally depends on the same blocking item finder; practical behavior is close to A* branch in current implementation.

#### ACO branch
- Uses pheromone iterations across blocker candidates.
- Evaporation and reinforcement are implemented.
- Final chosen path is derived from highest pheromone values.

### Runtime use in backend
FastAPI currently calls planner with `astar` mode for retrieval-related endpoints.

---

## 5) Placement/Rearrangement Optimizer (`placingItem.cpp`)

### Purpose
Used when explicitly placing an item (put-back/relocation workflow), then globally re-optimizing placements.

### Core algorithmic components
1. **AABB collision detection** with early separating-axis exits.
2. **Skyline best-fit 3D packing** on sparse height map.
3. **Container selection by utilization** (least utilized first).
4. **Multi-criteria item ordering**:
   - priority descending,
   - volume descending,
   - expiry earlier first.

### Placement sequence
- First attempt: preferred coordinates for the specified priority item.
- If valid and collision-free, commit directly.
- Then run full `rearrangeItems()` for global consistency.

### Optimization techniques in code
- Pre-computed item/container volumes.
- Sparse height map (`unordered_map`) instead of dense 3D occupancy grid.
- Step-size heuristics when scanning candidate (x, y) positions.
- Early breaks on near-perfect fit (`waste < 0.001`).

---

## 6) Waste Return Selection in FastAPI (`main.py`)

### Purpose
Builds undocking return plans from waste items with a lightweight heuristic.

### Algorithm
1. Collect candidate items in target container.
2. Sort by item priority descending.
3. Greedily accumulate items while total mass stays within `maxWeight`.
4. Remove selected items from DB, repack remaining items via `3dBinPakckingAlgo`, and generate retrieval steps via `retrievalPathPlanning`.

This is a **greedy constrained selection** (knapsack-like approximation, not exact knapsack optimization).

---

## 7) Waste Management Optimizer Module (`wasteManagement.cpp`)

### Purpose
A standalone custom optimizer for waste identification, retrieval-step generation, and return manifest creation.

### Implemented methods
- Waste detection: expired or out-of-uses.
- Accessibility check and blocker extraction.
- Return plan generation under mass cap.
- Retrieval instruction generation (`remove/setAside/retrieve/placeBack`).
- Optional waste processing model with:
  - volume reduction factor,
  - water recovery rate.

### Note
This module is implemented but not currently invoked by `main.py` subprocess calls in active API paths.

---

## 8) End-to-End Algorithm Pipeline (Current Runtime)

1. **Score items** (`priorityCalculationEngine`)
2. **Pack/rearrange** (`3dBinPakckingAlgo`)
3. **Retrieve planning** (`retrievalPathPlanning`) as needed
4. **Explicit place/repack** (`placingItem`) for placement endpoint workflows
5. **Waste return flow** uses Python greedy selection + repack + retrieval planning

This is the backend’s current algorithm stack, with custom C++ engines handling the heavy optimization/path tasks and Python orchestrating data flow and persistence.
