const { test } = require("node:test");
const assert = require("node:assert/strict");
const { Graph, parse, run, example } = require("../dist/algorithms.js");
const make = (vs, es, d = false, w = true) =>
  new Graph(
    vs,
    es.map(([from, to, weight = 1]) => ({ from, to, weight })),
    d,
    w,
  );
const sample = () => new Graph(example.vertices, example.edges, false, true);
test("Grafo do enunciado: Dijkstra desde O", () =>
  assert.deepEqual(
    run(sample(), "dijkstra", "O").rows.map((r) => r.distance),
    [0, 2, 4, 4, 8, 7, 14, 13],
  ));
test("Grafo do enunciado: Kruskal custa 20, com 7 arestas", () => {
  const r = run(sample(), "kruskal");
  assert.equal(r.cost, 20);
  assert.equal(r.selected.length, 7);
  assert.equal(r.components, 1);
});
test("Grafo do enunciado: BFS", () =>
  assert.deepEqual(run(sample(), "bfs", "O").order, [
    "O",
    "A",
    "B",
    "C",
    "D",
    "F",
    "E",
    "T",
  ]));
test("Grafo do enunciado: DFS", () =>
  assert.deepEqual(run(sample(), "dfs", "O").order, [
    "O",
    "A",
    "B",
    "C",
    "E",
    "D",
    "T",
    "F",
  ]));
test("Direção é respeitada nas três buscas", () => {
  const g = make(["A", "B"], [["A", "B", 2]], true);
  for (const type of ["dfs", "bfs", "dijkstra"])
    assert.deepEqual(run(g, type, "B").unreachable, ["A"]);
});
test("Kruskal rejeita direcionado", () =>
  assert.throws(
    () => run(make(["A"], [], true), "kruskal"),
    /não direcionado/,
  ));
test("Dijkstra rejeita negativo, Kruskal permite", () => {
  const g = make(["A", "B"], [["A", "B", -3]]);
  assert.throws(() => run(g, "dijkstra", "A"), /não negativos/);
  assert.equal(run(g, "kruskal").cost, -3);
});
test("Peso zero é uma aresta válida", () =>
  assert.equal(
    run(make(["A", "B"], [["A", "B", 0]]), "dijkstra", "A").rows[1].distance,
    0,
  ));
test("Sem peso normaliza para 1", () =>
  assert.equal(
    make(["A", "B"], [["A", "B", 99]], false, false).edges[0].weight,
    1,
  ));
test("Floresta mínima inclui isolados na contagem de componentes", () => {
  const r = run(make(["A", "B", "C"], [["A", "B", 4]]), "kruskal");
  assert.equal(r.components, 2);
  assert.equal(r.cost, 4);
});
test("Vértice único: todos os algoritmos", () => {
  const g = make(["A"], []);
  for (const type of ["dfs", "bfs", "dijkstra"])
    assert.equal(run(g, type, "A").rows[0].distance, 0);
  assert.equal(run(g, "kruskal").cost, 0);
});
test("Laço negativo não entra na árvore mínima", () =>
  assert.equal(
    run(
      make(
        ["A", "B"],
        [
          ["A", "A", -5],
          ["A", "B", 2],
        ],
      ),
      "kruskal",
    ).cost,
    2,
  ));
test("Arestas duplicadas não direcionadas são recusadas", () =>
  assert.throws(
    () =>
      make(
        ["A", "B"],
        [
          ["A", "B", 1],
          ["B", "A", 2],
        ],
      ),
    /repetida/,
  ));
test("Arestas recíprocas direcionadas são distintas", () =>
  assert.equal(
    make(
      ["A", "B"],
      [
        ["A", "B", 1],
        ["B", "A", 2],
      ],
      true,
    ).edges.length,
    2,
  ));
test("Nomes especiais não colidem com propriedades JS", () =>
  assert.equal(
    run(
      make(["__proto__", "constructor"], [["__proto__", "constructor", 3]]),
      "dijkstra",
      "__proto__",
    ).rows[1].distance,
    3,
  ));
test("Parser: comentários, CRLF e separadores", () =>
  assert.equal(
    parse("A B C", "# comentário\r\nA;B;2\r\nB,C,3", false, true).edges.length,
    2,
  ));
test("Parser valida nomes, campos, pesos e vértices", () => {
  assert.throws(() => parse("A B", "A B", false, true), /Linha/);
  assert.throws(() => parse("A", "A B 2", false, true), /não cadastrado/);
  assert.throws(() => parse("A B", "A B Infinity", false, true), /Peso/);
  assert.throws(() => make(["A", "A"], []), /repetido/);
});
test("Grafo vazio e origem inexistente", () => {
  assert.throws(() => run(make([], []), "bfs", "A"));
  assert.throws(() => run(make(["A"], []), "dfs", "B"));
});
test("BFS minimiza saltos; Dijkstra minimiza peso", () => {
  const g = make(
    ["A", "B", "C"],
    [
      ["A", "C", 10],
      ["A", "B", 1],
      ["B", "C", 1],
    ],
  );
  assert.deepEqual(run(g, "bfs", "A").rows[2].path, ["A", "C"]);
  assert.deepEqual(run(g, "dijkstra", "A").rows[2].path, ["A", "B", "C"]);
});
test("Snapshot mantém histórico independente", () => {
  const r = run(sample(), "bfs", "O");
  assert.deepEqual(r.steps[0].visited, ["O"]);
  assert.equal(r.steps.at(-1).visited.length, 8);
});
test("Serialização JSON preserva o grafo", () => {
  const g = sample(),
    j = JSON.parse(JSON.stringify(g));
  assert.deepEqual(
    new Graph(j.vertices, j.edges, j.directed, j.weighted).toJSON(),
    g.toJSON(),
  );
});
// Oráculo independente: Floyd-Warshall, somente nos testes.
let seed = 2026;
const rand = () => {
  seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
  return seed / 4294967296;
};
test("100 grafos aleatórios: Dijkstra e BFS contra Floyd-Warshall; DFS alcançabilidade", () => {
  for (let k = 0; k < 100; k++) {
    const n = 2 + Math.floor(rand() * 6),
      vs = Array.from({ length: n }, (_, i) => String(i)),
      edges = [],
      directed = k % 2 === 0;
    for (let i = 0; i < n; i++)
      for (let j = directed ? 0 : i + 1; j < n; j++)
        if (i !== j && rand() < 0.3)
          edges.push([String(i), String(j), Math.floor(rand() * 10)]);
    const g = make(vs, edges, directed);
    for (const weighted of [true, false]) {
      const d = vs.map((_, i) => vs.map((_, j) => (i === j ? 0 : Infinity)));
      for (const [a, b, w] of edges) {
        d[+a][+b] = weighted ? w : 1;
        if (!directed) d[+b][+a] = weighted ? w : 1;
      }
      for (let m = 0; m < n; m++)
        for (let i = 0; i < n; i++)
          for (let j = 0; j < n; j++)
            d[i][j] = Math.min(d[i][j], d[i][m] + d[m][j]);
      for (let i = 0; i < n; i++) {
        assert.deepEqual(
          run(g, weighted ? "dijkstra" : "bfs", String(i)).rows.map(
            (r) => r.distance,
          ),
          d[i],
        );
        assert.deepEqual(
          new Set(run(g, "dfs", String(i)).order),
          new Set(vs.filter((_, j) => d[i][j] < Infinity)),
        );
      }
    }
  }
});
// Oráculo por enumeração exaustiva das árvores possíveis, sem Union-Find.
test("40 grafos pequenos: Kruskal contra todas as árvores geradoras possíveis", () => {
  for (let k = 0; k < 40; k++) {
    const vs = ["A", "B", "C", "D"],
      es = [];
    for (let i = 0; i < 4; i++)
      for (let j = i + 1; j < 4; j++)
        es.push([vs[i], vs[j], Math.floor(rand() * 15) - 5]);
    let best = Infinity;
    for (let mask = 0; mask < 1 << es.length; mask++) {
      const subset = es.filter((_, i) => (mask >> i) & 1);
      if (subset.length !== 3) continue;
      const reached = new Set(["A"]);
      for (let pass = 0; pass < 4; pass++)
        for (const [a, b] of subset) {
          if (reached.has(a)) reached.add(b);
          if (reached.has(b)) reached.add(a);
        }
      if (reached.size === 4)
        best = Math.min(
          best,
          subset.reduce((s, e) => s + e[2], 0),
        );
    }
    assert.equal(run(make(vs, es), "kruskal").cost, best);
  }
});
