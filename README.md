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

- TypeScript + React
- Leaflet (biblioteca para mapa interativo)
- GeoJSON (formato baseado em json para dados espaciais)
- React Router (rotas client-side)
- Vite (ferramenta para build e desenvolvimento local)

## Execução

Instale as dependências e rode o modo de desenvolvimento:

```bash
npm install
npm run dev
```

Para gerar a versão de produção:

```bash
npm run build
```

Abra `http://127.0.0.1:5173/` no navegador durante o desenvolvimento.

## Estrutura

- `src/main.tsx` — entry point
- `src/App.tsx` — rotas e layout compartilhado
- `src/pages/Mapa.tsx` — página do mapa
- `src/pages/Referencias.tsx` — página de referências
- `src/pages/Definicoes.tsx` — página de definições
- `src/types.ts` — tipos compartilhados e funções auxiliares
- `vite.config.ts` — configuração do Vite com plugin React
