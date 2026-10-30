# Analisador

Aplicação gráfica para explorar redes de uma cidade inteligente: DFS, BFS, Dijkstra e Kruskal. Código em JavaScript, interface HTML/CSS e desenho SVG. Sem dependências externas, banco de dados ou conexão à internet durante a execução local.

## Identificação acadêmica — preencher antes da entrega

| Campo | Informação |
|---|---|
| Instituição | Ibmec – Rio de Janeiro |
| Curso | Engenharia de Software |
| Disciplina | Análise e Complexidade de Algoritmos (IBM3121) |
| Professor | Cassius Figueiredo |
| Período letivo | 2026.2 |
| Integrante 1 | Hugo Farias Watzl Barreto — matrícula: **PREENCHER** |
| Demais integrantes | **PREENCHER nomes e matrículas ou remover esta linha se individual** |

Não entregue com campos pendentes. Confirme que o nome e o curso correspondem aos integrantes reais. O enunciado permite grupos de até cinco pessoas.

## Executar — opção mais simples, sem instalar nada

1. Extraia o ZIP inteiro para uma pasta.
2. Abra `dist/index.html` no Chrome, Edge ou Firefox.
3. O exemplo do enunciado aparece automaticamente.

Todos os arquivos necessários são locais. Não é preciso Node.js para abrir a interface. Mantenha `index.html`, `style.css`, `app.js` e `algorithms.js` juntos em `dist/`.

### Opção com servidor local

Com Node.js 20 ou superior instalado, abra o terminal na pasta do projeto:

```sh
npm start
```

Acesse `http://localhost:3000`. Para parar o servidor, use Ctrl+C. Não é necessário `npm install`.

### Executar testes

```sh
npm test
```

A suíte usa somente `node:test` e `node:assert/strict`. São 23 testes: casos conhecidos, validações, 100 grafos pseudoaleatórios comparados com Floyd-Warshall e 40 grafos pequenos cujo custo mínimo é verificado enumerando todas as árvores possíveis. Semente fixa torna os testes reproduzíveis. Esses oráculos existem apenas nos testes, não são usados pela aplicação.

## Como usar

1. Marque **Direcionado** e **Com pesos** conforme o problema.
2. Cadastre os vértices separados por espaço, vírgula ou ponto e vírgula. Inclua os isolados. Os nomes são sensíveis a maiúsculas e não podem conter esses separadores.
3. Em **Texto**, use uma aresta por linha: `A B 4` com peso ou `A B` sem peso. Decimal usa ponto, por exemplo `2.5`. Linhas iniciadas por `#` são comentários. Não use cabeçalho.
4. Como alternativa, use **Tabela de arestas**, adicionando ou removendo linhas.
5. Clique em **Aplicar grafo**. Dados inválidos não substituem o grafo vigente. Alterações pendentes bloqueiam a execução até serem aplicadas.
6. Escolha um dos quatro algoritmos e, quando aplicável, a origem.
7. Clique em **Executar**. A tabela mostra o resultado final; o desenho inicialmente mostra a primeira etapa. Use Início, Anterior, Próximo, Reproduzir/Pausar e Ver final. Escolha a velocidade lenta, normal ou rápida. Cada etapa exibe a ação, a explicação e o estado visual da fila, pilha, distâncias ou arestas aceitas. O texto da etapa, fila/pilha/distâncias e as cores acompanham a etapa selecionada; a tabela inferior continua mostrando o resultado final.
Ao executar Kruskal, a seção **Resultado completo** também mostra a árvore geradora mínima em um desenho separado, apenas com as arestas selecionadas, seus pesos e o custo total. As posições dos vértices seguem o mapa original. Em grafos desconectados, mostra a floresta mínima e mantém os vértices isolados. Esse desenho representa a solução final, independentemente da etapa selecionada.

8. Arraste os vértices para organizar o desenho. Isso não altera o grafo nem os resultados. **Reorganizar** restaura o posicionamento inicial.
9. **Limpar** apaga o grafo. **Grafo do enunciado** restaura o exemplo.

A aplicação funciona sem conta ou sessão própria. Os grafos permanecem apenas na memória da página e não são enviados a servidores. Para preservá-los, copie os campos de vértices e arestas antes de fechar ou recarregar a página. A versão hospedada pode exigir acesso do ChatGPT; a versão local não exige login.

**Finalizar aplicação** interrompe a reprodução e encerra a interação, exibindo a tela “Aplicação finalizada”. **Iniciar nova análise** abre uma nova análise com o grafo do enunciado. Não há login nem sessão de usuário na aplicação. O navegador mantém a aba aberta; encerrar um eventual servidor local requer Ctrl+C no terminal.

## Aresta separada e vértice isolado

Uma aresta sempre tem dois extremos; pode ligar um vértice a ele mesmo (laço). Para criar uma conexão separada do restante da rede, cadastre seus dois vértices e somente a aresta entre eles.

Exemplo de vértices: `A B C D E F`.

```text
A B 3
B C 2
D E 5
```

Nesse exemplo, `D E 5` é uma aresta em um componente separado; `F` é um vértice isolado, pois não participa de nenhuma aresta. Para usar sem pesos, desmarque **Com pesos** e retire a terceira coluna. Pela tabela, basta adicionar uma linha com origem D, destino E e peso 5. Clique em **Aplicar grafo** após editar.

## Regras explícitas

- Estrutura principal: `Graph.adj`, um `Map` de listas de vizinhos, construído pelo grupo. Cada entrada guarda destino, peso e ID da aresta. `Graph.edges` mantém cada aresta uma única vez para Kruskal/desenho. Não há biblioteca de grafos.
- Arestas não direcionadas entram nas duas listas, exceto laços, que entram uma vez. Não são duplicadas na lista global de arestas.
- Grafos simples com laços permitidos: arestas paralelas/duplicadas são recusadas. Em direcionados, A→B e B→A são duas arestas válidas.
- Sem pesos, todas as arestas têm custo 1. Peso zero é válido. Pesos finitos negativos são aceitos na estrutura; Dijkstra os recusa. Kruskal aceita negativos.
- DFS e BFS visitam somente os vértices alcançáveis desde a origem. A lista de não alcançados fica explícita. Em direcionados, isso não prova conectividade forte.
- A ordem dos vizinhos é a ordem de entrada. Dijkstra desempata vértices pela ordem de cadastro; Kruskal desempata arestas pelo ID de inserção. Resultados ótimos podem não ser únicos.
- BFS minimiza número de arestas; ignora pesos. A profundidade de DFS não é uma distância mínima.
- Dijkstra retorna distância infinita e caminho vazio para inalcançáveis. A implementação usa seleção linear do menor não processado, sem heap.
- Kruskal recusa grafos direcionados. Se desconectado, retorna floresta mínima e quantidade de componentes, incluindo vértices isolados. Laços são rejeitados pelo teste de ciclo.
- JavaScript usa números de ponto flutuante IEEE 754. Prefira pesos pequenos/inteiros para apresentação. Casas decimais podem ter arredondamento; a interface formata até 10 algarismos significativos. Somas que ultrapassam o intervalo finito são recusadas.
- Histórico detalhado e desenho são voltados a grafos didáticos pequenos, não a benchmarking ou redes gigantes.

## Estrutura dos arquivos

```text
dist/
  index.html        interface
  style.css         aparência responsiva
  algorithms.js    Graph, parser, UnionFind e quatro algoritmos
  app.js           eventos, desenho SVG, entrada/saída, histórico
examples/          grafos JSON de referência
tests/             testes determinísticos e oráculos independentes
docs/
  complexidade.md   análise e justificativa das escolhas
  apresentacao.md   roteiro de até 15 minutos e perguntas
  validacao.md      respostas de referência e checklist
server.js          servidor local opcional
package.json       comandos npm start e npm test
readme.md          instruções e identificação
```

O desenho SVG não é a estrutura do grafo: é gerado a partir da estrutura própria. As posições visuais são armazenadas separadamente. Alterar um vértice na tela por arraste não muda sua adjacência.

## Requisitos atendidos

| Requisito | Local |
|---|---|
| Interface gráfica centralizada | `dist/index.html` e `dist/app.js` |
| Entrada livre, direção e pesos | Texto/tabela e opções |
| Lista de adjacência própria | `Graph` em `dist/algorithms.js` |
| Visualizar memória | Painel Dentro da memória |
| Quatro algoritmos próprios | Função `run` e classe `UnionFind` |
| Resultados em texto/tabela | Painel Execução e resultados |
| Troca de grafos e loop interativo | Aplicar, limpar e exemplo |
| Finalizar aplicação | Botão no cabeçalho, interrupção da reprodução e tela de encerramento |
| Diferenciais | Desenho, arraste, destaques, etapas explicadas, velocidade de reprodução e testes |

## GitHub e entrega

Este pacote contém o código pronto para um repositório do grupo. A hospedagem de demonstração não substitui o GitHub exigido pelo professor.

1. Preencha identificação e matrículas neste arquivo.
2. Crie um repositório GitHub vazio, por exemplo `smartnet-analyzer`.
3. Na pasta extraída, execute (substitua `SEU_USUARIO` pelo usuário correto):

```sh
git init
git add .
git commit -m "Implementa Analisador"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/smartnet-analyzer.git
git push -u origin main
```

Configure sua identidade Git se solicitado. Se o repositório for privado, garanta que o professor tenha acesso conforme combinado com ele. Verifique o link em outra sessão antes do envio.

Conforme enunciado: um integrante envia o link ao professor até **03/11/2026, 23h59**, com o assunto **Entrega AC Complexidade Algoritmos**, para `cassius.figueiredo@professores.ibmec.edu.br`, incluindo nomes dos componentes no corpo. Confirme com a turma o horário local aplicável. A apresentação tem duração máxima de 15 minutos na primeira aula seguinte à entrega. O envio não foi feito por esta aplicação.

Leia `docs/apresentacao.md` antes de apresentar. Todos precisam conseguir explicar o código, a estrutura escolhida e os resultados.
