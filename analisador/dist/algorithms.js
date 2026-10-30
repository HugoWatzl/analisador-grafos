/* SmartNet: armazenamento e algoritmos próprios, sem biblioteca de grafos. */
(function (root) {
  "use strict";
  // Lista própria: Map de vértices para arrays de vizinhos.
  class Graph {
    constructor(vertices = [], edges = [], directed = false, weighted = true) {
      this.directed = !!directed;
      this.weighted = !!weighted;
      this.adj = new Map();
      this.edges = [];
      for (const v of vertices) {
        if (typeof v !== "string" || !v.trim() || /[\s,;]/.test(v))
          throw Error(
            "Vértices devem ser nomes sem espaços, vírgulas ou ponto e vírgula.",
          );
        if (this.adj.has(v)) throw Error("Vértice repetido: " + v);
        this.adj.set(v, []);
      }
      const seen = new Set();
      for (const e of edges) {
        const { from, to } = e;
        const weight = weighted ? Number(e.weight) : 1;
        if (!this.adj.has(from) || !this.adj.has(to))
          throw Error(
            "Aresta contém vértice não cadastrado: " + from + " → " + to,
          );
        if (
          (weighted && (e.weight === "" || e.weight == null)) ||
          !Number.isFinite(weight)
        )
          throw Error("Peso inválido em " + from + " → " + to);
        const key = JSON.stringify(directed ? [from, to] : [from, to].sort());
        if (seen.has(key)) throw Error("Aresta repetida: " + from + " → " + to);
        seen.add(key);
        const edge = { from, to, weight, id: this.edges.length };
        this.edges.push(edge);
        this.adj.get(from).push({ to, weight, id: edge.id });
        if (!directed && from !== to)
          this.adj.get(to).push({ to: from, weight, id: edge.id });
      }
    }
    get vertices() {
      return [...this.adj.keys()];
    }
    toJSON() {
      return {
        vertices: this.vertices,
        edges: this.edges.map(({ from, to, weight }) => ({ from, to, weight })),
        directed: this.directed,
        weighted: this.weighted,
      };
    }
  }
  function parse(vertices, text, directed, weighted) {
    const vs = vertices.trim() ? vertices.trim().split(/[\s,;]+/) : [];
    const edges = [];
    text.split(/\r?\n/).forEach((raw, i) => {
      const line = raw.trim();
      if (!line || line.startsWith("#")) return;
      const p = line.split(/[\s,;]+/);
      if (p.length !== (weighted ? 3 : 2))
        throw Error(
          "Linha " +
            (i + 1) +
            ": use " +
            (weighted ? "origem destino peso" : "origem destino") +
            ".",
        );
      edges.push({ from: p[0], to: p[1], weight: weighted ? Number(p[2]) : 1 });
    });
    return new Graph(vs, edges, directed, weighted);
  }
  // Conjuntos disjuntos: compressão de caminhos e união por rank.
  class UnionFind {
    constructor(vertices) {
      this.parent = new Map(vertices.map((v) => [v, v]));
      this.rank = new Map(vertices.map((v) => [v, 0]));
    }
    find(v) {
      let r = v;
      while (this.parent.get(r) !== r) r = this.parent.get(r);
      while (v !== r) {
        const p = this.parent.get(v);
        this.parent.set(v, r);
        v = p;
      }
      return r;
    }
    union(a, b) {
      a = this.find(a);
      b = this.find(b);
      if (a === b) return false;
      if (this.rank.get(a) < this.rank.get(b)) [a, b] = [b, a];
      this.parent.set(b, a);
      if (this.rank.get(a) === this.rank.get(b))
        this.rank.set(a, this.rank.get(a) + 1);
      return true;
    }
  }
  function run(g, type, start) {
    if (!g.vertices.length) throw Error("Cadastre pelo menos um vértice.");
    if (!["bfs", "dfs", "dijkstra", "kruskal"].includes(type))
      throw Error("Algoritmo desconhecido.");
    if (type !== "kruskal" && !g.adj.has(start))
      throw Error("Selecione uma origem válida.");
    const steps = [];
    const visited = new Set(),
      selected = [];
    const snap = (
      message,
      current = null,
      frontier = [],
      dist = null,
      edge = null,
    ) =>
      steps.push({
        message,
        current,
        visited: [...visited],
        selected: [...selected],
        frontier: [...frontier],
        dist: dist ? [...dist] : null,
        edge,
      });
    const parent = new Map(),
      distance = new Map(g.vertices.map((v) => [v, Infinity])),
      order = [];
    // BFS marca na descoberta e usa índice de leitura para não deslocar o array.
    if (type === "bfs") {
      const q = [start];
      let head = 0;
      visited.add(start);
      distance.set(start, 0);
      snap("Origem descoberta; adicionada à fila.", start, q);
      while (head < q.length) {
        const u = q[head++];
        order.push(u);
        snap("Retira " + u + " da fila.", u, q.slice(head));
        for (const e of g.adj.get(u)) {
          if (visited.has(e.to)) continue;
          visited.add(e.to);
          parent.set(e.to, u);
          distance.set(e.to, distance.get(u) + 1);
          selected.push(e.id);
          q.push(e.to);
          snap(
            "Descobre " + e.to + " a partir de " + u + ".",
            e.to,
            q.slice(head),
          );
        }
      }
    } else if (type === "dfs") {
      // Cada quadro guarda o próximo vizinho: simula a DFS recursiva.
      const stack = [{ v: start, next: 0 }];
      visited.add(start);
      order.push(start);
      distance.set(start, 0);
      snap("Entra em " + start + ".", start, [start]);
      while (stack.length) {
        const f = stack[stack.length - 1],
          neighbors = g.adj.get(f.v);
        if (f.next === neighbors.length) {
          stack.pop();
          snap(
            "Retorna de " + f.v + ".",
            f.v,
            stack.map((x) => x.v),
          );
          continue;
        }
        const e = neighbors[f.next++];
        if (visited.has(e.to)) continue;
        visited.add(e.to);
        parent.set(e.to, f.v);
        distance.set(e.to, distance.get(f.v) + 1);
        selected.push(e.id);
        order.push(e.to);
        stack.push({ v: e.to, next: 0 });
        snap(
          "Aprofunda em " + e.to + ".",
          e.to,
          stack.map((x) => x.v),
        );
      }
    } else if (type === "dijkstra") {
      // Seleção linear: não usamos heap nesta implementação.
      if (g.edges.some((e) => e.weight < 0))
        throw Error("Dijkstra exige pesos não negativos.");
      distance.set(start, 0);
      snap("Distância da origem = 0; demais = ∞.", start, [], distance);
      while (true) {
        let u = null,
          best = Infinity;
        for (const v of g.vertices)
          if (!visited.has(v) && distance.get(v) < best) {
            u = v;
            best = distance.get(v);
          }
        if (u === null) break;
        visited.add(u);
        order.push(u);
        snap(
          "Fixa a menor distância: " + u + " = " + best + ".",
          u,
          [],
          distance,
        );
        for (const e of g.adj.get(u)) {
          if (visited.has(e.to)) continue;
          const alt = best + e.weight;
          if (!Number.isFinite(alt))
            throw Error("Soma de pesos excede o limite numérico.");
          if (alt < distance.get(e.to)) {
            distance.set(e.to, alt);
            parent.set(e.to, u);
            snap(
              "Atualiza " + e.to + ": " + alt + " via " + u + ".",
              u,
              [],
              distance,
              e.id,
            );
          }
        }
      }
      for (const [v, p] of parent)
        selected.push(g.adj.get(p).find((e) => e.to === v).id);
    } else {
      if (g.directed) throw Error("Kruskal exige um grafo não direcionado.");
      // A união só ocorre entre componentes diferentes, evitando ciclos.
      const uf = new UnionFind(g.vertices);
      let cost = 0,
        components = g.vertices.length;
      const sorted = [...g.edges].sort(
        (a, b) => a.weight - b.weight || a.id - b.id,
      );
      snap("Arestas ordenadas por peso; cada vértice inicia um conjunto.");
      for (const e of sorted) {
        const accepted = uf.union(e.from, e.to);
        if (accepted) {
          selected.push(e.id);
          visited.add(e.from);
          visited.add(e.to);
          cost += e.weight;
          components--;
          if (!Number.isFinite(cost))
            throw Error("Custo excede o limite numérico.");
        }
        snap(
          (accepted ? "Aceita " : "Rejeita por ciclo: ") +
            e.from +
            " — " +
            e.to +
            " (" +
            e.weight +
            ").",
          null,
          [],
          null,
          e.id,
        );
      }
      snap(
        components === 1
          ? "Árvore geradora mínima concluída."
          : "Floresta mínima: " + components + " componentes.",
      );
      return {
        type,
        steps,
        selected,
        cost,
        components,
        order: [],
        rows: selected.map((id) => g.edges[id]),
      };
    }
    const rows = g.vertices.map((v) => {
      const path = [];
      if (distance.get(v) !== Infinity) {
        let p = v;
        while (p !== undefined) {
          path.push(p);
          p = parent.get(p);
        }
        path.reverse();
      }
      return {
        vertex: v,
        distance: distance.get(v),
        parent: parent.get(v) ?? null,
        path,
      };
    });
    snap(
      "Concluído: " +
        visited.size +
        " de " +
        g.vertices.length +
        " vértices alcançados.",
      null,
      [],
      type === "dijkstra" ? distance : null,
    );
    return {
      type,
      start,
      steps,
      selected,
      order,
      rows,
      unreachable: rows
        .filter((r) => r.distance === Infinity)
        .map((r) => r.vertex),
    };
  }
  const example = {
    vertices: ["O", "A", "B", "C", "D", "E", "F", "T"],
    directed: false,
    weighted: true,
    edges: [
      ["O", "A", 2],
      ["O", "B", 5],
      ["O", "C", 4],
      ["A", "B", 2],
      ["A", "D", 7],
      ["A", "F", 12],
      ["B", "C", 1],
      ["B", "D", 4],
      ["B", "E", 3],
      ["C", "E", 4],
      ["D", "E", 4],
      ["D", "T", 5],
      ["E", "T", 7],
      ["F", "T", 3],
    ].map(([from, to, weight]) => ({ from, to, weight })),
  };
  const api = { Graph, parse, run, UnionFind, example };
  if (typeof module !== "undefined") module.exports = api;
  else root.SmartNet = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
