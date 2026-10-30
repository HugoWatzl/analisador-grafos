# Analisador

Aplicação web desenvolvida para o projeto **SmartNet — Infraestrutura de Cidades Inteligentes**, da disciplina de Análise e Complexidade de Algoritmos.

O sistema permite cadastrar grafos, visualizar sua estrutura em memória e executar os algoritmos DFS, BFS, Dijkstra e Kruskal, com resultados em tabelas e acompanhamento visual passo a passo.

## 1. Identificação acadêmica

| Campo | Informação |
|---|---|
| Instituição | Ibmec — Rio de Janeiro |
| Curso | Engenharia de Software |
| Disciplina | Análise e Complexidade de Algoritmos — IBM3121 |
| Professor | Cassius Figueiredo |
| Período letivo | 2026.2 |

### Integrantes

| Nome completo | Matrícula |
|---|---|
| Hugo Farias Watzl Barreto | PREENCHER |

## 2. Objetivo

Representar uma rede urbana por meio de um grafo, no qual:

- Os vértices representam bairros ou pontos de interesse.
- As arestas representam vias ou conexões.
- Os pesos representam distâncias ou custos.

A aplicação permite analisar a exploração da rede, encontrar caminhos e determinar conexões de menor custo.

## 3. Tecnologias utilizadas

| Tecnologia | Utilização |
|---|---|
| HTML5 | Estrutura da interface |
| CSS3 | Estilização e adaptação a diferentes tamanhos de tela |
| JavaScript | Estrutura do grafo, algoritmos e interação com o usuário |
| SVG | Desenho dos vértices, arestas e resultados |
| Node.js | Servidor local opcional e execução dos testes |
| Git/GitHub | Versionamento e disponibilização do código |

A aplicação não utiliza frameworks, bibliotecas de grafos ou banco de dados.

A lista de adjacência e os quatro algoritmos foram implementados no código do projeto. O desenho é produzido com SVG a partir dessa estrutura.

## 4. Funcionalidades

- Cadastro de vértices, incluindo vértices isolados.
- Cadastro de arestas por texto ou tabela.
- Grafos direcionados e não direcionados.
- Grafos com e sem pesos.
- Visualização gráfica da rede.
- Reposicionamento dos vértices por arraste.
- Exibição da lista de adjacência utilizada em memória.
- Execução de DFS, BFS, Dijkstra e Kruskal.
- Escolha do vértice de origem para DFS, BFS e Dijkstra.
- Resultados em texto e tabelas.
- Reprodução passo a passo, com controle de velocidade.
- Exibição da fila, pilha, distâncias ou arestas selecionadas.
- Desenho separado da árvore ou floresta resultante de Kruskal.
- Carregamento do grafo de exemplo do enunciado.
- Limpeza do grafo e realização de novas análises.
- Botão **Finalizar aplicação**.

## 5. Como executar

### 5.1. Abrindo diretamente no navegador

Esta opção não exige instalação de dependências ou de Node.js.

1. Baixe o repositório pelo GitHub ou extraia o arquivo ZIP do projeto.
2. Abra a pasta `dist`.
3. Abra o arquivo `index.html` em um navegador atualizado.
4. A aplicação será carregada com o grafo do enunciado.

Mantenha os seguintes arquivos juntos na pasta `dist`:

- `index.html`
- `style.css`
- `app.js`
- `algorithms.js`

A execução local funciona sem conexão à internet e sem login.

### 5.2. Utilizando o servidor local

Requisito: Node.js 20 ou superior, com npm disponível.

1. Abra um terminal na pasta raiz do projeto, onde está o arquivo `package.json`.
2. Execute:

```bash
npm start
```

3. Acesse:

```text
http://localhost:3000
```

Não é necessário executar `npm install`, pois o projeto não possui dependências externas.

Para interromper o servidor, pressione `Ctrl+C` no terminal.

## 6. Como utilizar

### 6.1. Configurar o tipo de grafo

Antes de aplicar os dados:

- Marque **Direcionado** quando as arestas possuírem sentido.
- Deixe **Direcionado** desmarcado para conexões nos dois sentidos.
- Marque **Com pesos** para informar o custo de cada aresta.
- Deixe **Com pesos** desmarcado para utilizar custo unitário, igual a 1.

### 6.2. Cadastrar os vértices

No campo **Vértices**, informe os nomes separados por espaços.

Exemplo:

```text
A B C D Z
```

Todos os extremos das arestas devem estar cadastrados nesse campo.

Os nomes diferenciam letras maiúsculas de minúsculas e não devem conter espaços, vírgulas ou ponto e vírgula.

### 6.3. Cadastrar as arestas por texto

Com pesos, utilize uma aresta por linha no formato:

```text
origem destino peso
```

Exemplo:

```text
A B 4
A C 2
B D 5
C D 1
```

Sem pesos, utilize somente origem e destino:

```text
A B
A C
B D
C D
```

Também são aceitos vírgula e ponto e vírgula como separadores. Para pesos decimais, utilize ponto, como `2.5`.

Linhas iniciadas por `#` são tratadas como comentários.

### 6.4. Cadastrar as arestas por tabela

1. Selecione **Tabela de arestas**.
2. Clique em **Adicionar aresta**.
3. Preencha origem, destino e peso, quando habilitado.
4. Utilize o botão de remoção para excluir uma linha.
5. Clique em **Aplicar grafo**.

### 6.5. Adicionar um vértice isolado

Para adicionar um vértice sem conexões, inclua seu nome somente no campo **Vértices**.

Por exemplo, cadastrando:

```text
A B C Z
```

E informando as arestas:

```text
A B 2
B C 3
```

O vértice `Z` permanecerá isolado e sua lista de adjacência será vazia.

### 6.6. Aplicar e executar

1. Clique em **Aplicar grafo**.
2. Confira o desenho e a lista de adjacência.
3. Selecione o algoritmo desejado.
4. Escolha a origem, quando aplicável.
5. Clique em **Executar**.

Alterações nos dados precisam ser aplicadas antes de uma nova execução. Entradas inválidas geram mensagens de erro e não substituem o grafo aplicado.

### 6.7. Acompanhar o passo a passo

Os controles disponíveis são:

| Controle | Função |
|---|---|
| Início | Retorna à primeira etapa |
| Anterior | Volta uma etapa |
| Reproduzir/Pausar | Inicia ou interrompe a reprodução automática |
| Próximo | Avança uma etapa |
| Ver final | Mostra a última etapa |
| Barra de progresso | Permite selecionar uma etapa |
| Velocidade | Alterna entre reprodução lenta, normal e rápida |

A área de execução apresenta a ação realizada, sua explicação e o estado da estrutura utilizada pelo algoritmo.

O desenho principal acompanha a etapa selecionada. A seção **Resultado completo** apresenta a solução final e permanece independente da navegação pelas etapas.

### 6.8. Interpretar as cores

- **Cinza:** elementos sem destaque na etapa.
- **Azul:** vértices visitados/processados ou arestas selecionadas.
- **Laranja:** vértice ou aresta em análise naquele momento.

O destaque laranja é temporário e não representa erro nem aceitação definitiva.

### 6.9. Limpar, restaurar e finalizar

- **Limpar:** apaga o grafo atual.
- **Grafo do enunciado:** restaura o exemplo fornecido pelo professor.
- **Reorganizar:** restaura as posições iniciais dos vértices.
- **Finalizar aplicação:** interrompe a reprodução e encerra a interação, exibindo a tela de encerramento.
- **Iniciar nova análise:** retorna à aplicação com o grafo do enunciado e BFS selecionado.

O sistema permanece disponível para novas operações até o usuário finalizar a aplicação.

O botão de finalizar encerra a interação da página; não fecha a aba do navegador nem interrompe um servidor Node.js iniciado no terminal.

## 7. Estrutura de dados

O grafo é armazenado em uma **lista de adjacência**, implementada na classe `Graph`, em `dist/algorithms.js`.

A estrutura utiliza um `Map`, no qual:

- A chave identifica um vértice.
- O valor é uma lista de seus vizinhos.
- Cada vizinho armazena destino, peso e identificador da aresta.

Exemplo de representação exibida:

```text
A → (B, 4, #0), (C, 2, #1)
B → (A, 4, #0)
C → (A, 2, #1)
Z → []
```

Em grafos não direcionados, uma aresta entre vértices distintos aparece nas listas dos dois extremos. Em grafos direcionados, aparece somente na lista da origem.

Uma lista auxiliar mantém cada aresta cadastrada uma única vez, sendo utilizada por Kruskal e pela visualização.

### Justificativa da escolha

A lista de adjacência ocupa **O(V + E)** de memória e permite percorrer apenas os vizinhos existentes.

Ela é adequada a redes esparsas, nas quais cada vértice se conecta a uma parcela dos demais. Uma matriz de adjacência exigiria **O(V²)** de memória, mesmo com poucas conexões.

O painel **Dentro da memória** apresenta a lista utilizada pela aplicação. O desenho SVG é uma visualização dessa estrutura e não substitui seu armazenamento.

## 8. Algoritmos implementados

### 8.1. BFS — Busca em Largura

Utiliza uma fila para explorar os vértices por níveis a partir da origem.

Apresenta:

- Ordem de visita.
- Quantidade mínima de arestas até cada vértice alcançável.
- Predecessores e caminhos.
- Vértices não alcançados.
- Estado da fila durante a execução.

BFS ignora os pesos das arestas. Seu caminho mínimo considera a quantidade de conexões, não a soma dos custos.

A fila utiliza um índice de leitura, evitando a remoção repetida do primeiro elemento do array.

### 8.2. DFS — Busca em Profundidade

Utiliza uma pilha explícita para aprofundar a exploração de um caminho antes de retornar.

Apresenta:

- Ordem de visita.
- Predecessores.
- Profundidade e caminhos na árvore de exploração.
- Vértices não alcançados.
- Estado da pilha durante a execução.

DFS não garante caminhos mínimos. A profundidade apresentada corresponde à árvore produzida pela busca.

### 8.3. Dijkstra

Calcula a menor soma dos pesos entre a origem e os vértices alcançáveis.

A implementação seleciona, por busca linear, o vértice ainda não processado com a menor distância conhecida e realiza os relaxamentos de suas arestas.

Apresenta:

- Distância mínima.
- Predecessor.
- Caminho desde a origem.
- Atualizações de distância durante as etapas.

Pesos negativos são recusados. Vértices inalcançáveis aparecem com distância infinita, representada por `∞`.

### 8.4. Kruskal

Determina uma árvore geradora mínima em grafos não direcionados e conexos.

As arestas são ordenadas por peso. Cada aresta é aceita somente quando conecta componentes diferentes.

A detecção de componentes utiliza **Union-Find**, implementado com compressão de caminhos e união por rank.

Apresenta:

- Arestas aceitas e rejeitadas.
- Custo total.
- Quantidade de componentes.
- Tabela das arestas selecionadas.
- Desenho separado da solução final.

O desenho resultante preserva as posições dos vértices do grafo original e exibe somente as arestas escolhidas.

Se o grafo for desconectado, o resultado é uma **floresta geradora mínima**, preservando inclusive os vértices isolados.

Kruskal não é executado em grafos direcionados.

## 9. Complexidade

Considere:

- `V`: quantidade de vértices.
- `E`: quantidade de arestas.

| Estrutura ou algoritmo | Complexidade |
|---|---|
| Memória da lista de adjacência | O(V + E) |
| BFS | O(V + E) |
| DFS | O(V + E) |
| Dijkstra com seleção linear | O(V² + E) |
| Kruskal | O(V + E log E + E α(V)) |

Em Kruskal, `α(V)` é a função inversa de Ackermann, associada ao custo amortizado do Union-Find. A forma simplificada usual utilizada na interface é **O(V + E log E)**.

As complexidades dos algoritmos referem-se ao seu núcleo. O histórico visual copia estados para permitir a navegação pelas etapas, acrescentando consumo de tempo e memória.

A reconstrução de caminhos para todos os vértices e a renderização também possuem custos adicionais. Por isso, o tempo total da interface não deve ser utilizado diretamente como medida da complexidade do algoritmo.

A análise detalhada está em `docs/complexidade.md`.

## 10. Validações e regras

- Todos os extremos das arestas devem estar cadastrados.
- Vértices duplicados são recusados.
- Arestas duplicadas ou paralelas são recusadas.
- Em grafos direcionados, `A → B` e `B → A` são arestas distintas.
- Laços são aceitos na entrada, mas não são selecionados por Kruskal.
- Pesos devem ser números finitos.
- Peso zero é válido.
- Pesos negativos são aceitos na estrutura, mas impedem a execução de Dijkstra.
- Grafos sem pesos utilizam custo 1 por aresta.
- DFS e BFS exploram apenas os vértices alcançáveis a partir da origem escolhida.
- Em grafos direcionados, alcançar todos os vértices desde uma origem não comprova conectividade forte.
- DFS e BFS seguem a ordem de cadastro dos vizinhos.
- Dijkstra desempata vértices pela ordem de cadastro.
- Kruskal desempata arestas pela ordem de inserção.
- Diferentes soluções podem ser corretas quando existem empates.

## 11. Grafo do enunciado

Configuração: **não direcionado e com pesos**.

### Vértices

```text
O A B C D E F T
```

O primeiro vértice é a letra `O`, não o número zero.

### Arestas

```text
O A 2
O B 5
O C 4
A B 2
A D 7
A F 12
B C 1
B D 4
B E 3
C E 4
D E 4
D T 5
E T 7
F T 3
```

### Resultados de referência

Para a ordem de entrada apresentada:

| Algoritmo | Resultado |
|---|---|
| BFS a partir de O | O → A → B → C → D → F → E → T |
| DFS a partir de O | O → A → B → C → E → D → T → F |
| Kruskal | 7 arestas e custo total 20 |

Distâncias de Dijkstra a partir de `O`:

| Vértice | Distância |
|---|---:|
| O | 0 |
| A | 2 |
| B | 4 |
| C | 4 |
| D | 8 |
| E | 7 |
| F | 14 |
| T | 13 |

Arestas selecionadas por Kruskal:

| Aresta | Peso |
|---|---:|
| B — C | 1 |
| O — A | 2 |
| A — B | 2 |
| B — E | 3 |
| F — T | 3 |
| B — D | 4 |
| D — T | 5 |
| **Total** | **20** |

O grafo do enunciado é apenas um exemplo. A aplicação permite inserir e analisar outros grafos.

## 12. Testes

Com Node.js 20 ou superior instalado, execute na raiz do projeto:

```bash
npm test
```

Os testes utilizam os módulos nativos `node:test` e `node:assert/strict`.

A suíte contém 23 testes, abrangendo:

- Resultados do grafo do enunciado.
- Grafos direcionados e desconectados.
- Vértices isolados.
- Pesos zero e negativos.
- Laços e arestas duplicadas.
- Validação dos dados de entrada.
- Diferenças entre o menor número de arestas e o menor custo.
- Preservação dos estados do histórico.

Também são realizadas verificações independentes:

- 100 grafos pseudoaleatórios comparados com Floyd-Warshall para validar distâncias de Dijkstra e BFS, além da alcançabilidade de DFS.
- 40 grafos pequenos com comparação do custo de Kruskal contra enumeração das árvores geradoras possíveis.

A geração utiliza uma semente fixa, permitindo reproduzir os mesmos testes.

Esses métodos de comparação existem somente na suíte de testes e não são utilizados para calcular os resultados da aplicação.

## 13. Organização do projeto

| Arquivo ou pasta | Responsabilidade |
|---|---|
| `dist/index.html` | Estrutura da interface |
| `dist/style.css` | Estilização |
| `dist/algorithms.js` | Grafo, leitura da entrada, algoritmos e Union-Find |
| `dist/app.js` | Interações, desenhos e reprodução das etapas |
| `tests/algorithms.test.js` | Testes automatizados |
| `examples/` | Grafos de referência em JSON |
| `docs/complexidade.md` | Análise de complexidade |
| `docs/apresentacao.md` | Roteiro de apresentação |
| `docs/validacao.md` | Casos e resultados de referência |
| `server.js` | Servidor local opcional |
| `package.json` | Comandos de execução e testes |
| `readme.md` | Documentação principal |

## 14. Atendimento ao enunciado

| Requisito | Implementação |
|---|---|
| Interface gráfica centralizada | Interface web |
| Inserção de grafos | Texto e tabela de arestas |
| Grafos direcionados e não direcionados | Opção Direcionado |
| Grafos com e sem pesos | Opção Com pesos |
| Lista ou matriz implementada no projeto | Lista de adjacência na classe Graph |
| Visualização da estrutura de memória | Painel Dentro da memória |
| DFS, BFS, Dijkstra e Kruskal | Implementações em algorithms.js |
| Resultados em texto ou tabela | Seção Resultado completo |
| Operações repetidas com novos grafos | Aplicar grafo, Limpar e nova execução |
| Botão Finalizar aplicação | Encerramento da interação e da reprodução |

## 15. Limitações

- O sistema foi desenvolvido para grafos didáticos e demonstrações acadêmicas.
- A gravação das etapas pode consumir bastante memória em grafos grandes.
- Não há armazenamento permanente: os dados são mantidos na memória da página.
- Recarregar ou fechar a página descarta o grafo inserido.
- Não há suporte a arestas paralelas.
- Pesos decimais estão sujeitos ao arredondamento de ponto flutuante do JavaScript.
- A interface não possui importação ou exportação de grafos; a entrada é feita por texto ou tabela.