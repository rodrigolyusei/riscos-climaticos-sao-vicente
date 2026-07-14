# Mapa de Riscos Climáticos

O sistema faz parte do projeto integrador sobre Observatório de Justiça Climática de São Vicente

### Integrantes:

- Caique Alves de Souza
- Dimitri Prado
- Drielly de Moraes Guerreiro
- Gabriela Alcaide
- Livia Vanessa Carlini Martins
- Rodrigo Lyusei Suguimoto

### Desenvolvimento

- TypeScript
- Leaflet (biblioteca para mapa interativo)
- GeoJSON (formato baseado em json para dados espaciais)

## Execução

Instale as dependências e compile o TypeScript:

```bash
npm install
npm run build
```

Depois rode o servidor http:

```bash
npm run start
```

Abra `http://127.0.0.1:8000/` no navegador.

## Estrutura TypeScript

- `assets/ts/map.ts` é a fonte editável.
- `build/map.js` é o arquivo gerado pela build e o navegador carrega esse arquivo.
- `tsconfig.json` define a saída em `build`.
