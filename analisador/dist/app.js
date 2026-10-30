"use strict";
const $ = (id) => document.getElementById(id),
  { Graph, parse, run, example } = SmartNet;
const esc = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
const fmt = (n) =>
  n === Infinity
    ? "∞"
    : Number.isInteger(n)
      ? String(n)
      : Number(n.toPrecision(10)).toString();
let graph = new Graph(),
  algorithm = "bfs",
  result = null,
  stepIndex = 0,
  timer = null,
  positions = new Map(),
  tableMode = false,
  dirty = false;
const hints = {
  bfs: "Encontra caminhos com o menor número de arestas. Os pesos são ignorados.",
  dfs: "Explora até o fim de cada ramo antes de retornar. A profundidade não é a menor distância.",
  dijkstra:
    "Calcula a menor soma de pesos desde a origem. Exige pesos não negativos.",
  kruskal:
    "Seleciona conexões de menor custo sem ciclos. Exige grafo não direcionado.",
};
function notify(message, error = false) {
  $("notice").textContent = message;
  $("notice").className = error ? "error" : "";
  $("notice").hidden = !message;
}
function markDirty() {
  dirty = true;
  $("dirty").hidden = false;
  stop();
  resetResult();
  notify("Entrada alterada. Clique em Aplicar grafo antes de executar.");
}
function stop() {
  if (timer) clearInterval(timer);
  timer = null;
  $("play").textContent = "▶ Reproduzir";
}
function resetResult() {
  stop();
  result = null;
  $("resultEmpty").hidden = false;
  $("resultContent").hidden = true;
  $("resultBadge").textContent = "Aguardando execução";
  draw();
}
function serializeEdges(g) {
  return g.edges
    .map((e) => e.from + " " + e.to + (g.weighted ? " " + e.weight : ""))
    .join("\n");
}
function populate(g) {
  $("vertices").value = g.vertices.join(" ");
  $("edges").value = serializeEdges(g);
  $("directed").checked = g.directed;
  $("weighted").checked = g.weighted;
  updateHint();
  if (tableMode) fillTable();
}
function updateHint() {
  $("formatHint").textContent = $("weighted").checked
    ? "ORIGEM · DESTINO · PESO"
    : "ORIGEM · DESTINO";
}
function setGraph(g, name) {
  graph = g;
  dirty = false;
  $("dirty").hidden = true;
  positions.clear();
  resetResult();
  const prev = $("origin").value;
  $("origin").replaceChildren(...g.vertices.map((v) => new Option(v, v)));
  if (g.adj.has(prev)) $("origin").value = prev;
  $("graphName").textContent = name;
  $("kindLabel").textContent = g.directed ? "Direcionado" : "Não direcionado";
  $("weightLabel").textContent = g.weighted ? "Com pesos" : "Sem pesos";
  $("vCount").textContent = g.vertices.length;
  $("eCount").textContent = g.edges.length;
  $("memory").innerHTML = g.vertices.length
    ? g.vertices
        .map(
          (v) =>
            '<div class="memory-row"><b>' +
            esc(v) +
            "</b><span>→ " +
            (g.adj.get(v).length
              ? g.adj
                  .get(v)
                  .map(
                    (e) =>
                      "(" +
                      esc(e.to) +
                      ", " +
                      fmt(e.weight) +
                      ", #" +
                      e.id +
                      ")",
                  )
                  .join(" · ")
              : "[]") +
            "</span></div>",
        )
        .join("")
    : "<span>Nenhum vértice cadastrado.</span>";
  draw();
  notify("");
}
function row(from = "", to = "", weight = "") {
  const tr = document.createElement("tr");
  for (const [label, value] of [
    ["Origem", from],
    ["Destino", to],
    ["Peso", weight],
  ]) {
    const td = document.createElement("td"),
      input = document.createElement("input");
    input.value = value;
    input.setAttribute("aria-label", label + " da aresta");
    if (label === "Peso") {
      input.inputMode = "decimal";
      input.disabled = !$("weighted").checked;
    }
    input.addEventListener("input", markDirty);
    td.append(input);
    tr.append(td);
  }
  const td = document.createElement("td"),
    button = document.createElement("button");
  button.textContent = "×";
  button.title = "Remover aresta";
  button.setAttribute("aria-label", "Remover aresta");
  button.onclick = () => {
    tr.remove();
    markDirty();
  };
  td.append(button);
  tr.append(td);
  $("edgeRows").append(tr);
}
function fillTable() {
  const lines = $("edges")
    .value.split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s && !s.startsWith("#"));
  const parsed = lines.map((s, i) => {
    const p = s.split(/[\s,;]+/);
    if (p.length !== ($("weighted").checked ? 3 : 2))
      throw Error(
        "Linha " + (i + 1) + ": corrija o formato antes de abrir a tabela.",
      );
    return p;
  });
  $("edgeRows").replaceChildren();
  for (const p of parsed) row(p[0], p[1], p[2] ?? "1");
}
function tableText() {
  return [...$("edgeRows").children]
    .map((tr) => {
      const values = [...tr.querySelectorAll("input")].map((i) =>
        i.value.trim(),
      );
      if (values.every((v) => !v)) return "";
      if (!values[0] || !values[1] || ($("weighted").checked && !values[2]))
        throw Error("Preencha origem, destino e peso das linhas da tabela.");
      return values.slice(0, $("weighted").checked ? 3 : 2).join(" ");
    })
    .filter(Boolean)
    .join("\n");
}
function switchEditor(table) {
  try {
    if (table === tableMode) return;
    if (table) fillTable();
    else $("edges").value = tableText();
    tableMode = table;
    $("tableEditor").hidden = !table;
    $("textEditor").hidden = table;
    $("tableTab").setAttribute("aria-selected", String(table));
    $("textTab").setAttribute("aria-selected", String(!table));
  } catch (e) {
    notify(e.message, true);
  }
}
function apply() {
  try {
    if (tableMode) $("edges").value = tableText();
    const g = parse(
      $("vertices").value,
      $("edges").value,
      $("directed").checked,
      $("weighted").checked,
    );
    setGraph(g, "Minha rede");
  } catch (e) {
    notify(e.message, true);
  }
}
function positionNodes() {
  const vs = graph.vertices;
  if (vs.join(",") === example.vertices.join(",")) {
    const coords = [
      [100, 220],
      [270, 95],
      [290, 235],
      [220, 365],
      [480, 230],
      [470, 365],
      [510, 85],
      [695, 235],
    ];
    vs.forEach((v, i) =>
      positions.set(v, { x: coords[i][0], y: coords[i][1] }),
    );
  } else {
    vs.forEach((v, i) => {
      const a = -Math.PI / 2 + (2 * Math.PI * i) / vs.length;
      positions.set(v, {
        x: 400 + Math.cos(a) * (vs.length === 1 ? 0 : 280),
        y: 225 + Math.sin(a) * (vs.length === 1 ? 0 : 165),
      });
    });
  }
}
function draw() {
  if (!positions.size && graph.vertices.length) positionNodes();
  const svg = $("graph"),
    step = result?.steps[stepIndex],
    visited = new Set(step?.visited || []),
    selected = new Set(step?.selected || []);
  $("emptyGraph").hidden = !!graph.vertices.length;
  let html =
    '<defs><marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse"><path d="M0 0 L10 5 L0 10 Z" fill="context-stroke"/></marker></defs>';
  for (const e of graph.edges) {
    const a = positions.get(e.from),
      b = positions.get(e.to);
    let d, lx, ly;
    if (e.from === e.to) {
      d = `M ${a.x - 16} ${a.y - 18} C ${a.x - 70} ${a.y - 90}, ${a.x + 70} ${a.y - 90}, ${a.x + 16} ${a.y - 18}`;
      lx = a.x;
      ly = a.y - 70;
    } else {
      const dx = b.x - a.x,
        dy = b.y - a.y,
        len = Math.hypot(dx, dy) || 1,
        ux = dx / len,
        uy = dy / len;
      const reciprocal =
        graph.directed &&
        graph.edges.some((other) => other.from === e.to && other.to === e.from);
      const bend = reciprocal ? 30 : 0;
      const cx = (a.x + b.x) / 2 - uy * bend,
        cy = (a.y + b.y) / 2 + ux * bend;
      d = `M ${a.x + ux * 25} ${a.y + uy * 25} Q ${cx} ${cy} ${b.x - ux * 27} ${b.y - uy * 27}`;
      lx = (a.x + b.x) / 2 - uy * bend * 0.5;
      ly = (a.y + b.y) / 2 + ux * bend * 0.5 - 9;
    }
    const active = step?.edge === e.id,
      color = active ? "#e5a13b" : selected.has(e.id) ? "#2563eb" : "#c4cfdb";
    html += `<path d="${d}" fill="none" stroke="${color}" stroke-width="${active || selected.has(e.id) ? 3.5 : 1.7}" ${graph.directed ? 'marker-end="url(#arrow)"' : ""}/>`;
    if (graph.weighted)
      html += `<text class="edge-label" text-anchor="middle" x="${lx}" y="${ly}">${fmt(e.weight)}</text>`;
  }
  graph.vertices.forEach((v, i) => {
    const p = positions.get(v),
      current = step?.current === v,
      seen = visited.has(v),
      fill = current ? "#fff0d5" : seen ? "#e7efff" : "#fff",
      stroke = current ? "#e8a43a" : seen ? "#2563eb" : "#9cafc3";
    html += `<g class="node" data-index="${i}" transform="translate(${p.x},${p.y})"><title>${esc(v)}</title><circle r="24" fill="${fill}" stroke="${stroke}"/><text text-anchor="middle" dy="5" fill="${seen ? "#1d4ed8" : "#40566f"}">${esc(v.length > 6 ? v.slice(0, 5) + "…" : v)}</text></g>`;
  });
  svg.innerHTML = html;
  drawKruskalResult();
}
// Exibe a solução final separadamente, sem as arestas rejeitadas.
// Reutiliza as posições do mapa e preserva todos os vértices, inclusive isolados.
function drawKruskalResult() {
  const panel = $("kruskalResult"),
    svg = $("kruskalGraph");
  const visible = result?.type === "kruskal";
  panel.hidden = !visible;
  if (!visible) {
    svg.replaceChildren();
    return;
  }
  const forest = result.components > 1;
  $("kruskalTitle").textContent = forest
    ? "Floresta geradora mínima"
    : "Árvore geradora mínima";
  $("kruskalCost").textContent = "Custo total: " + fmt(result.cost);
  $("kruskalDescription").textContent =
    "Mesmas posições do grafo original, mostrando apenas as arestas escolhidas por Kruskal." +
    (forest
      ? " O grafo é desconectado: os componentes e vértices isolados são preservados."
      : "") +
    (!graph.weighted ? " Cada aresta tem custo 1." : "");
  $("kruskalStats").textContent =
    `${graph.vertices.length} ${graph.vertices.length === 1 ? "vértice" : "vértices"} · ${result.selected.length} ${result.selected.length === 1 ? "aresta" : "arestas"} · ${result.components} ${result.components === 1 ? "componente" : "componentes"}`;
  const connected = new Set();
  let html = "";
  for (const id of result.selected) {
    const e = graph.edges[id],
      a = positions.get(e.from),
      b = positions.get(e.to);
    connected.add(e.from);
    connected.add(e.to);
    // Kruskal nunca seleciona laços: as arestas aceitas ligam vértices distintos.
    const dx = b.x - a.x,
      dy = b.y - a.y,
      len = Math.hypot(dx, dy) || 1;
    html += `<line class="tree-edge" data-edge-id="${id}" x1="${a.x + (dx / len) * 25}" y1="${a.y + (dy / len) * 25}" x2="${b.x - (dx / len) * 25}" y2="${b.y - (dy / len) * 25}"><title>${esc(e.from)} — ${esc(e.to)}: ${fmt(e.weight)}</title></line>`;
    if (graph.weighted)
      html += `<text class="edge-label tree-edge-label" text-anchor="middle" x="${(a.x + b.x) / 2}" y="${(a.y + b.y) / 2 - 10}">${fmt(e.weight)}</text>`;
  }
  graph.vertices.forEach((v, i) => {
    const p = positions.get(v),
      isolated = !connected.has(v);
    html += `<g class="tree-node${isolated ? " tree-isolated" : ""}" data-index="${i}" transform="translate(${p.x},${p.y})"><title>${esc(v)}${isolated ? " — vértice sem arestas selecionadas" : ""}</title><circle r="24"/><text text-anchor="middle" dy="5">${esc(v.length > 6 ? v.slice(0, 5) + "…" : v)}</text></g>`;
  });
  svg.innerHTML = html;
}
let drag = null;
$("graph").addEventListener("pointerdown", (e) => {
  const node = e.target.closest(".node");
  if (!node) return;
  drag = graph.vertices[Number(node.dataset.index)];
  $("graph").setPointerCapture(e.pointerId);
});
$("graph").addEventListener("pointermove", (e) => {
  if (drag === null) return;
  const p = new DOMPoint(e.clientX, e.clientY).matrixTransform(
    $("graph").getScreenCTM().inverse(),
  );
  positions.set(drag, {
    x: Math.max(35, Math.min(765, p.x)),
    y: Math.max(40, Math.min(410, p.y)),
  });
  draw();
});
$("graph").addEventListener("pointerup", () => (drag = null));
$("graph").addEventListener("pointercancel", () => (drag = null));
const walkthrough = {
  bfs: {
    title: "BFS · avance nível por nível",
    description:
      "A fila organiza os próximos vértices. O primeiro a entrar é o primeiro a ser visitado.",
    state: "Fila de espera",
    hint: "Frente à esquerda · novos vértices entram à direita",
  },
  dfs: {
    title: "DFS · siga um caminho até o fim",
    description:
      "A pilha mantém o caminho em exploração. Quando não há novos vizinhos, o algoritmo retorna.",
    state: "Pilha de exploração",
    hint: "Base à esquerda · topo à direita",
  },
  dijkstra: {
    title: "Dijkstra · acompanhe as menores distâncias",
    description:
      "O algoritmo fixa a menor distância disponível e verifica se passar por esse vértice melhora outras rotas.",
    state: "Distâncias nesta etapa",
    hint: "∞ = nenhum caminho encontrado até este momento",
  },
  kruskal: {
    title: "Kruskal · conecte a rede sem criar ciclos",
    description:
      "As arestas são analisadas do menor para o maior peso. Cada etapa mostra se a ligação foi aceita ou rejeitada.",
    state: "Arestas aceitas até agora",
    hint: "São as conexões que compõem a árvore ou floresta mínima",
  },
};
function explainStep(s, isLast) {
  if (isLast)
    return algorithm === "kruskal"
      ? "A análise terminou. As linhas azuis são as conexões selecionadas; confira as arestas e o custo total abaixo."
      : "A busca terminou. Os vértices azuis foram alcançados a partir da origem. Confira os caminhos e os não alcançados na tabela abaixo.";
  if (algorithm === "bfs")
    return s.message.startsWith("Retira")
      ? "O primeiro vértice da fila será explorado. Seus vizinhos ainda não descobertos serão adicionados ao fim da fila."
      : "O vértice foi descoberto e entrou na fila. Marcar na descoberta evita inseri-lo novamente por outro caminho.";
  if (algorithm === "dfs")
    return s.message.startsWith("Retorna")
      ? "Todos os vizinhos desse vértice já foram examinados. Ele sai da pilha e a exploração volta ao vértice anterior."
      : "O vértice entra no topo da pilha. A busca continua por seus vizinhos antes de explorar outros ramos.";
  if (algorithm === "dijkstra") {
    if (s.message.startsWith("Atualiza"))
      return "Foi encontrada uma rota de custo menor. A distância provisória e o predecessor do destino foram atualizados; a aresta analisada aparece em amarelo.";
    if (s.message.startsWith("Fixa"))
      return "Este é o vértice não processado com a menor distância conhecida. Com pesos não negativos, essa distância já é definitiva.";
    return "A origem começa com distância zero. Os demais vértices ficam com infinito até que uma rota seja encontrada.";
  }
  if (s.message.startsWith("Rejeita"))
    return "Os extremos da aresta já estão no mesmo componente. Adicionar essa conexão criaria um ciclo, então ela não entra na solução.";
  if (s.message.startsWith("Aceita"))
    return "A aresta conecta dois componentes diferentes. Ela é incluída na solução, unindo esses componentes sem formar um ciclo.";
  return "As arestas foram ordenadas por peso. Inicialmente cada vértice está em seu próprio componente; empates seguem a ordem de cadastro.";
}
function showStep(i) {
  if (!result) return;
  stepIndex = Math.max(0, Math.min(result.steps.length - 1, i));
  const s = result.steps[stepIndex],
    last = stepIndex === result.steps.length - 1,
    info = walkthrough[algorithm];
  $("stepRange").value = stepIndex;
  $("stepCount").textContent =
    `Etapa ${stepIndex + 1} de ${result.steps.length}`;
  $("progressPercent").textContent =
    Math.round((stepIndex / Math.max(1, result.steps.length - 1)) * 100) + "%";
  $("resultBadge").textContent =
    algorithm.toUpperCase() + (last ? " · Concluído" : " · Passo a passo");
  $("walkTitle").textContent = info.title;
  $("walkDescription").textContent = info.description;
  $("stepIcon").textContent = String(stepIndex + 1).padStart(2, "0");
  $("stepCaption").textContent = last
    ? "EXECUÇÃO CONCLUÍDA"
    : "O QUE ACONTECE AGORA";
  $("stepMessage").textContent = s.message;
  $("stepExplanation").textContent = explainStep(s, last);
  $("traceTitle").textContent = info.state;
  $("traceHint").textContent = info.hint;
  let items;
  if (s.dist)
    items = s.dist.map(
      ([v, d]) =>
        `<span class="state-chip ${s.visited.includes(v) ? "settled" : ""}"><b>${esc(v)}</b><span>${fmt(d)}</span>${s.visited.includes(v) ? "<small>fixada</small>" : ""}</span>`,
    );
  else if (algorithm === "kruskal")
    items = s.selected.map((id) => {
      const e = graph.edges[id];
      return `<span class="state-chip"><b>${esc(e.from)} – ${esc(e.to)}</b><span>peso ${fmt(e.weight)}</span></span>`;
    });
  else
    items = s.frontier.map(
      (v, index) =>
        `<span class="state-chip ${(algorithm === "bfs" && index === 0) || (algorithm === "dfs" && index === s.frontier.length - 1) ? "current-chip" : ""}"><b>${esc(v)}</b></span>`,
    );
  $("trace").innerHTML = items.length
    ? items.join("")
    : '<span class="empty-state">' +
      (algorithm === "kruskal"
        ? "Nenhuma aresta aceita ainda."
        : algorithm === "dfs"
          ? "A pilha está vazia."
          : "A fila está vazia.") +
      "</span>";
  $("visitedCount").textContent =
    algorithm === "kruskal"
      ? `${s.selected.length} aresta(s) aceita(s) · custo parcial: ${fmt(s.selected.reduce((sum, id) => sum + graph.edges[id].weight, 0))}`
      : `${s.visited.length} de ${graph.vertices.length} vértices ${algorithm === "dijkstra" ? "com distância fixada" : "descobertos"}${s.current ? " · vértice atual: " + s.current : ""}`;
  $("first").disabled = $("prev").disabled = stepIndex === 0;
  $("last").disabled = $("next").disabled = last;
  draw();
}
function execute() {
  try {
    if (dirty) throw Error("Aplique as alterações do grafo antes de executar.");
    stop();
    result = run(graph, algorithm, $("origin").value);
    $("resultEmpty").hidden = true;
    $("resultContent").hidden = false;
    $("resultBadge").textContent =
      "Resultado final · " + algorithm.toUpperCase();
    $("stepRange").max = result.steps.length - 1;
    if (algorithm === "kruskal") {
      $("summary").textContent =
        (result.components === 1
          ? "Árvore geradora mínima"
          : "Floresta geradora mínima") +
        " · Custo total: " +
        fmt(result.cost) +
        " · " +
        result.components +
        " componente(s) · " +
        result.selected.length +
        " aresta(s).";
      $("results").innerHTML =
        "<thead><tr><th>Origem</th><th>Destino</th><th>Peso</th></tr></thead><tbody>" +
        result.rows
          .map(
            (e) =>
              `<tr><td>${esc(e.from)}</td><td>${esc(e.to)}</td><td>${fmt(e.weight)}</td></tr>`,
          )
          .join("") +
        "</tbody>";
    } else {
      $("summary").textContent =
        "Ordem de " +
        (algorithm === "dijkstra" ? "fixação" : "visita") +
        ": " +
        result.order.join(" → ") +
        (result.unreachable.length
          ? " · Não alcançados: " + result.unreachable.join(", ")
          : " · Todos os vértices foram alcançados a partir da origem.") +
        (algorithm === "dfs" ? " · Profundidade refere-se à árvore DFS." : "");
      $("results").innerHTML =
        "<thead><tr><th>Vértice</th><th>" +
        (algorithm === "dijkstra"
          ? "Distância"
          : algorithm === "bfs"
            ? "Arestas mínimas"
            : "Profundidade") +
        "</th><th>Predecessor</th><th>Caminho " +
        (algorithm === "dfs" ? "na árvore" : "desde a origem") +
        "</th></tr></thead><tbody>" +
        result.rows
          .map(
            (r) =>
              `<tr><td>${esc(r.vertex)}</td><td>${fmt(r.distance)}</td><td>${esc(r.parent ?? "—")}</td><td>${r.path.length ? r.path.map(esc).join(" → ") : "Não alcançado"}</td></tr>`,
          )
          .join("") +
        "</tbody>";
    }
    showStep(0);
    notify("");
  } catch (e) {
    notify(e.message, true);
  }
}
function selectAlgorithm(type) {
  algorithm = type;
  document.querySelectorAll("[data-algo]").forEach((b) => {
    b.classList.toggle("active", b.dataset.algo === type);
    b.setAttribute("aria-pressed", String(b.dataset.algo === type));
  });
  $("algoHint").textContent = hints[type];
  $("run").textContent =
    "▶ Executar " +
    (type === "dijkstra"
      ? "Dijkstra"
      : type === "kruskal"
        ? "Kruskal"
        : type.toUpperCase());
  $("origin").disabled = type === "kruskal";
  resetResult();
}
$("apply").onclick = apply;
$("vertices").oninput = markDirty;
$("edges").oninput = markDirty;
$("directed").onchange = markDirty;
$("weighted").onchange = () => {
  updateHint();
  if (tableMode) {
    document.querySelectorAll("#edgeRows tr").forEach((tr) => {
      const input = tr.querySelectorAll("input")[2];
      input.disabled = !$("weighted").checked;
      if ($("weighted").checked && !input.value) input.value = "1";
    });
  }
  markDirty();
};
$("textTab").onclick = () => switchEditor(false);
$("tableTab").onclick = () => switchEditor(true);
$("addRow").onclick = () => {
  row("", "", "1");
  markDirty();
};
$("example").onclick = () => {
  const g = new Graph(
    example.vertices,
    example.edges,
    example.directed,
    example.weighted,
  );
  populate(g);
  setGraph(g, "Rede de exemplo");
};
$("clear").onclick = () => {
  const g = new Graph([], [], $("directed").checked, $("weighted").checked);
  populate(g);
  setGraph(g, "Nova rede");
};
$("layout").onclick = () => {
  positions.clear();
  draw();
};
document
  .querySelectorAll("[data-algo]")
  .forEach((b) => (b.onclick = () => selectAlgorithm(b.dataset.algo)));
$("origin").onchange = resetResult;
$("run").onclick = execute;
$("first").onclick = () => {
  stop();
  showStep(0);
};
$("prev").onclick = () => {
  stop();
  showStep(stepIndex - 1);
};
$("next").onclick = () => {
  stop();
  showStep(stepIndex + 1);
};
$("last").onclick = () => {
  stop();
  showStep(result.steps.length - 1);
};
$("stepRange").oninput = (e) => {
  stop();
  showStep(Number(e.target.value));
};
function startPlayback() {
  if (!result) return;
  if (stepIndex === result.steps.length - 1) showStep(0);
  $("play").textContent = "Ⅱ Pausar";
  timer = setInterval(
    () => {
      showStep(stepIndex + 1);
      if (stepIndex === result.steps.length - 1) stop();
    },
    Number($("speed").value),
  );
}
$("play").onclick = () => {
  if (timer) stop();
  else startPlayback();
};
$("speed").onchange = () => {
  if (timer) {
    stop();
    startPlayback();
  }
};
$("example").click();

$("finish").onclick = () => {
  stop();
  $("workspace").hidden = true;
  $("ended").hidden = false;
  $("finish").disabled = true;
  $("endedTitle").focus();
};
$("restart").onclick = () => {
  $("workspace").hidden = false;
  $("ended").hidden = true;
  $("finish").disabled = false;
  selectAlgorithm("bfs");
  $("example").click();
  $("run").focus();
};
