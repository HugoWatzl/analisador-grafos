# Análise de complexidade e decisões

V é o número de vértices; E é o número de arestas cadastradas (não direcionadas são contadas uma vez). Consideramos acesso médio O(1) a Map/Set e aritmética de tamanho constante. A lista de adjacência é uma implementação própria usando contêineres básicos da linguagem; não depende de estruturas ou algoritmos de biblioteca de grafos.

## Armazenamento

A classe Graph constrói Map<vértice, array de {to, weight, id}>. Também mantém uma lista de arestas sem duplicação para o desenho e Kruskal. Espaço O(V + E), inclusive em não direcionados: cada aresta aparece no máximo duas vezes nas listas. Construção esperada O(V + E), desconsiderando comprimento das strings, com conjunto de chaves para detectar duplicatas. Matriz exigiria O(V²) e examinar uma linha inteira para enumerar vizinhos. Uma cidade tende a ser esparsa; a lista representa apenas conexões existentes. A interface mostra as listas efetivas, não uma estrutura independente inventada para exibição.

## BFS

Marca um vértice na descoberta, impedindo sua inserção repetida na fila. Cada vértice entra e sai uma vez, e cada adjacência é examinada uma vez. A fila usa array com índice `head`, sem `shift()`. Núcleo: O(V + E) tempo e O(V) espaço auxiliar, além do grafo e da saída. A primeira descoberta dá o mínimo de arestas desde a origem. Guardar o predecessor permite reconstruir caminhos.

## DFS

Usa uma pilha explícita de quadros `{v, next}`: o índice `next` registra o próximo vizinho a examinar. Simula chamadas recursivas sem risco de estourar a pilha de chamadas JavaScript em caminhos longos. Marca na entrada; ao acabar os vizinhos, remove o quadro. Núcleo O(V + E) tempo e O(V) espaço auxiliar. Profundidade na árvore DFS não é menor distância. A busca começa somente na origem escolhida.

## Dijkstra

Inicializa distâncias como infinito e a origem como zero. A cada iteração, percorre todos os vértices para escolher o não processado de menor distância finita. Fixa a distância dele e relaxa suas arestas. Pesos negativos são recusados porque invalidam a garantia de fixação. Se não há candidato finito, os demais são inalcançáveis. O teste de melhora é estrito (`<`), preservando desempates estáveis e evitando ciclos de predecessor com pesos zero.

Seleção: até V varreduras de V itens = O(V²). Relaxamentos: O(E). Núcleo O(V² + E), com O(V) espaço auxiliar. Não usamos heap; não se deve apresentar a complexidade de heap como se fosse a deste código. Uma melhoria possível seria heap binário com implementação própria, desnecessário para a escala didática.

## Kruskal

Copia e ordena arestas por peso, desempatando pelo ID de entrada. Começa com V conjuntos. UnionFind usa compressão de caminhos e união por rank. Aceita uma aresta somente quando seus extremos pertencem a conjuntos distintos; isso evita ciclos. A escolha é segura pela propriedade do corte: uma aresta de menor custo que cruza componentes pode integrar uma floresta mínima. Se termina com mais de um conjunto, não há árvore geradora que una todo o grafo.

Inicialização O(V), ordenação O(E log E), operações UnionFind amortizadas O(E α(V)). Para grafos usuais, expressa-se O(V + E log E), com espaço O(V + E). α é a inversa de Ackermann, extremamente pequena. A ordenação usa Array.sort com comparador; os quatro algoritmos e UnionFind são próprios. O enunciado não exige implementar uma rotina de ordenação do zero.

## Custo da interface: não confundir com o núcleo algorítmico

O código registra snapshots para fins didáticos. Cada snapshot copia visitados, selecionadas e fila/pilha ou distâncias. Se S é a quantidade de etapas, um limite superior de memória e de trabalho de cópias é O(S(V + E)); é um limite conservador. BFS/DFS registram O(V) etapas; Dijkstra e Kruskal podem registrar O(V + E). Portanto a execução instrumentada completa NÃO mantém necessariamente a complexidade do núcleo indicada nos cartões.

Além disso, reconstruir um caminho para cada vértice pode consumir O(V²) tempo e espaço de saída no pior caso (uma cadeia). A tabela de caminhos, a renderização e o histórico também são parte do produto, não operações gratuitas. Para benchmarking, seria necessário desabilitar histórico, reconstrução de todos os caminhos e desenho.

O SVG redesenha elementos ao mudar etapa ou arrastar. Para curvas de arestas recíprocas em grafos direcionados, o desenho procura a reversa na lista, podendo custar O(E²). Isso não pertence ao núcleo dos algoritmos. É aceitável para a escala didática deste projeto; um índice de pares permitiria otimizar o renderer futuramente.
