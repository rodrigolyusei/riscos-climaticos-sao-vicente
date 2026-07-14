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

## Estrutura TypeScript

- `src/main.ts` é a fonte editável.
- `index.html` é a página principal do mapa.
- `referencias.html` e `definicoes.html` são as páginas adicionais.
- `vite.config.ts` define o build multi-page em `build`.
