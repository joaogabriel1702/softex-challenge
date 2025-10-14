# Quake Log Parser

Parser do arquivo de log **games.log** do servidor **Quake III Arena**, desenvolvido em **Node.js (JavaScript)**.  
O sistema lê o log, separa as partidas, contabiliza mortes e gera relatórios e uma **API REST** para consulta dos resultados.

---

## Funcionalidades

- **Parser completo** do arquivo `games.log`
- Agrupa dados de cada partida (`InitGame` → `ShutdownGame`)
- Calcula:
  - Total de kills por jogo
  - Lista de jogadores
  - Kills individuais
- Gera relatórios com ranking geral
- API REST com rotas para listar jogos e ranking

---

## Estrutura do Projeto

```
quake-parser/
├─ games.log
├─ package.json
├─ README.md
└─ src/
   ├─ splitGames.js       # Separa o log em blocos de jogos
   ├─ gameParser.js       # Analisa um jogo e gera estatísticas
   ├─ reportGenerator.js  # Gera relatórios e ranking geral
   ├─ index.js            # CLI (relatório via terminal)
   └─ api.js              # Servidor Express (API REST)
```

---

## Instalação

1. Clone o repositório:

   ```bash
   git clone https://github.com/seuusuario/quake-parser.git
   cd quake-parser
   ```

2. Instale as dependências:

   ```bash
   npm install
   ```

3. Certifique-se de ter o arquivo `games.log` na raiz do projeto.

---

## Uso

### Rodar o Parser e ver o relatório no terminal

```bash
npm start
```

Exemplo de saída:
```
RELATÓRIO DE JOGOS

game_1
Total de kills: 45
Jogadores: Dono da Bola, Isgalamido, Zeh
Kills por jogador:
   Dono da Bola: 5
   Isgalamido: 18
   Zeh: 20
------------------------------

RANKING GERAL DE KILLS
01. Zeh .................. 45 kills
02. Isgalamido ........... 18 kills
03. Dono da Bola .......... 8 kills
```

---

### Subir a API REST

```bash
npm run api
```

Servidor disponível em:

```
http://localhost:3000
```

---

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| **GET** | `/` | Mensagem inicial da API |
| **GET** | `/games` | Lista todos os jogos parseados |
| **GET** | `/games/:id` | Retorna os dados de um jogo específico |
| **GET** | `/ranking` | Mostra o ranking geral de kills |

### Exemplo de resposta `/games/1`

```json
{
  "id": 1,
  "name": "game_1",
  "total_kills": 45,
  "players": ["Isgalamido", "Zeh", "Dono da Bola"],
  "kills": {
    "Isgalamido": 18,
    "Zeh": 20,
    "Dono da Bola": 5
  }
}
```

---

## Regras do Parser

- Cada partida começa com `InitGame` e termina com `ShutdownGame`.
- Quando o **<world>** mata um jogador, ele perde **-1 kill**.
- O **<world>** **não** é contado como jogador.
- `total_kills` é o número total de eventos `Kill:` no jogo.

---

## ecnologias Utilizadas

- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)
- ECMAScript Modules (ESM)
- Programação Orientada a Objetos (POO)

---

## Boas práticas adotadas

- Código modular e legível (dividido por responsabilidade).
- Funções puras e reutilizáveis.
- Uso de `Map` para controle eficiente de dados.
- Uso de `git` com commits pequenos e descritivos.
- Estrutura organizada para facilitar manutenção e expansão (ex: API, CLI, testes).
