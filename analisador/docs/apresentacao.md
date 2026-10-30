# Roteiro para apresentação — até 15 minutos

## Preparação

- Preencher nomes/matrículas no readme.md e publicar no GitHub do grupo.
- Testar no computador da apresentação com a internet desligada, abrindo dist/index.html.
- Executar npm test antes da aula, se houver Node instalado.
- Levar uma cópia extraída e uma cópia ZIP. Usar a versão local, evitando dependência de login na demonstração hospedada.
- Ensaiar a digitação de grafos que não sejam o exemplo. Todos devem saber operar e explicar.

## Divisão do tempo

1. **0:00–1:00 — Problema e proposta.** Rede urbana modelada como grafo, rotas, conexões e custos. Mostrar os quatro painéis principais.
2. **1:00–3:00 — Entrada e memória.** Criar ou carregar grafo. Mostrar lista de adjacência real. Explicar direção, pesos, isolados e por que a lista economiza espaço em rede esparsa.
3. **3:00–5:00 — BFS e DFS.** Executar e voltar à primeira etapa. Mostrar fila versus pilha. Explicar ordem de entrada dos vizinhos. BFS conta arestas; DFS aprofunda e retorna.
4. **5:00–7:00 — Dijkstra.** Mostrar tabela de distâncias, predecessores e caminho. Um relaxamento compara distância atual com a rota via vértice fixado. Justificar pesos não negativos e seleção linear O(V² + E).
5. **7:00–9:00 — Kruskal.** Mostrar custo total e arestas. Explicar ordenação, conjuntos disjuntos e rejeição por ciclo. Informar floresta em desconectados.
6. **9:00–13:00 — Grafo inédito do professor.** Reserve tempo; digite vértices inclusive isolados, confira cada peso/seta no desenho, aplique e execute. Se o professor fornecer casos antes, priorize-os e encurte os exemplos.
7. **13:00–14:00 — Qualidade e complexidade.** Explicar testes independentes e diferença entre núcleo e instrumentação visual. Mostrar rapidamente arquivos dos algoritmos.
8. **14:00–15:00 — Perguntas e encerramento.** Demonstrar limpar, inserir um novo grafo e Finalizar aplicação.

## Respostas que o grupo precisa dominar

**Por que usar Map e arrays significa implementar a lista?** São contêineres básicos. O grupo definiu como vértices, adjacências, pesos, direção e duplicatas são representados e manipulados. Nenhuma biblioteca pronta calcula os resultados.

**Por que BFS ignora pesos?** Sua fila processa níveis por número de arestas. Menor número de conexões pode ter custo maior.

**DFS encontra caminho mínimo?** Não. Registra uma árvore de exploração; profundidade depende da ordem dos vizinhos.

**Por que não usar matriz?** Matriz gasta O(V²). Com lista, memória O(V + E) e enumeração apenas de vizinhos presentes. Matriz teria consulta direta de existência de aresta O(1).

**Por que Dijkstra não aceita negativos?** Um vértice já fixado poderia receber depois uma rota menor passando por peso negativo, quebrando a garantia do algoritmo.

**O que impede ciclos em Kruskal?** UnionFind: extremos com a mesma raiz já estão conectados. Adicionar a aresta fecharia um ciclo.

**Pode haver mais de uma resposta certa?** Sim, pesos empatados podem gerar árvores/caminhos diferentes com mesmo custo. DFS/BFS também dependem da ordem dos vizinhos.

**E se o grafo não for conexo?** Buscas marcam inalcançáveis; Dijkstra mostra infinito; Kruskal gera floresta e número de componentes.

**Onde está o loop?** É um loop de eventos do navegador: inserir, aplicar, executar e repetir até clicar em Finalizar aplicação. Não é necessário usar um while bloqueante na interface.

**Por que não há backend?** Todos os cálculos são locais; não há necessidade de conta, banco ou comunicação remota para resolver o problema. Isso permite apresentação offline.

**A complexidade do cartão vale para a aplicação toda?** Não. É a do núcleo do algoritmo. Snapshots, reconstrução dos caminhos e desenho têm custos adicionais documentados.

## Explicar o código

- `Graph`: valida vértices/arestas e preenche as listas.
- `parse`: transforma linhas de texto em arestas e informa erros de formato.
- `run`: seleciona o algoritmo, produz resultado e histórico de passos.
- `UnionFind`: `find` com compressão e `union` por rank.
- `app.js`: controla interface e desenha a estrutura; não substitui os algoritmos.

Use suas palavras e ensaie as funções. A aplicação pronta não substitui o domínio exigido na apresentação.
