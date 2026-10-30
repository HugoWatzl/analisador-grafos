# Validação e resultados de referência

## Grafo do enunciado

Não direcionado, com pesos. Origem O (letra O, não zero). Arestas:

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

Vértices: O A B C D E F T.

### Dijkstra desde O

| Vértice | Distância | Caminho escolhido |
|---|---:|---|
| O | 0 | O |
| A | 2 | O → A |
| B | 4 | O → A → B |
| C | 4 | O → C |
| D | 8 | O → A → B → D |
| E | 7 | O → A → B → E |
| F | 14 | O → A → F |
| T | 13 | O → A → B → D → T |

Kruskal: B–C (1), O–A (2), A–B (2), B–E (3), F–T (3), B–D (4), D–T (5). Total **20**. V−1 = 7 arestas.

BFS, na ordem das arestas acima: **O A B C D F E T**. DFS: **O A B C E D T F**. Outras ordens de entrada podem gerar outras ordens válidas.

## Casos manuais adicionais

1. Direcionado: A→B=2, B→C=1, A→C=8, C→D=0 e E isolado. Desde A: [0,2,3,3,∞]. Desde D, os demais são inalcançáveis. Kruskal deve ser recusado.
2. Negativo: A–B=-3, B–C=2, A–C=4. Dijkstra deve ser recusado. Kruskal total -1.
3. Desconectado: A–B=4 e C isolado. Kruskal total 4 e 2 componentes.
4. Sem pesos: A–B, B–C, A–C. Desde A, BFS e Dijkstra dão [0,1,1]. Kruskal custo 2.
5. Vértice único A. Todas as distâncias desde A são 0; Kruskal custo 0 e um componente.
6. Peso zero: A–B=0, B–C=2, A–C=5. Distância até C = 2.
7. Alterar um campo sem aplicar: executar deve ser bloqueado e resultados anteriores limpos.
8. Navegar com Início, Próximo, Anterior e Ver final: conferir explicação, estado visual e sincronização das cores.
9. Reproduzir em cada velocidade, pausar e mudar de algoritmo: não deve continuar uma reprodução antiga.

A suíte automatizada usa oráculos independentes além dos resultados fixos. Ela não depende de rede, navegador ou bibliotecas externas.

## Desenho da solução de Kruskal

- Exemplo: 8 vértices, 7 linhas, custo 20. Somente as arestas selecionadas devem aparecer.
- A–B=4 e C isolado: 3 vértices, uma linha, 2 componentes e título Floresta geradora mínima.
- Vértice único: uma árvore com um vértice, nenhuma linha e custo 0.
- Voltar ao início das etapas não altera o desenho da solução final.
- Arrastar vértices no mapa original atualiza as mesmas posições no resultado.
- Editar o grafo, limpar ou trocar de algoritmo oculta o resultado antigo.

- Finalizar aplicação durante a reprodução deve interrompê-la e ocultar os controles; Iniciar nova análise deve restaurar o exemplo e selecionar BFS.
