# LIMIAR — Arquivo Paranormal

Projeto do site LIMIAR — Arquivo Paranormal.

## Conteúdo

- Site publicado: https://limiar-arquivo-paranormal.marmito.chatgpt.site
- Fichas, campanhas, rolagens, inventário, habilidades, leitor de PDF e catálogo pesquisável com seleção de opções para a ficha.
- Catálogo parcial extraído do Livro de Regras v1.3 e dos Arquivos Secretos 01–07 em `src/catalog.json`.
- Rotina de importação em `scripts/import-books.py`.
- Estrutura de banco e armazenamento usada pela publicação no Sites.

O catálogo não reproduz o texto integral dos livros. “Sobrevivendo ao Horror” está parcialmente reconhecido por OCR e ainda requer revisão; o Playtest de Ordem Paranormal RPG 2 estava protegido por senha e não foi importado. Os PDFs originais não estão incluídos.

## Arquivos principais

- `src/index.html`, `src/style.css`, `src/app.js`: interface do site.
- `src/catalog.json`: catálogo parcial.
- `worker/handler.js`: servidor e persistência.
- `db/schema.ts` e `drizzle/`: banco de dados.

## Como usar

Para jogar, abra o endereço do site acima e entre na sua conta. A ficha salva na conta e o catálogo completo do ZIP não funcionará ao abrir `src/index.html` diretamente, pois o site usa autenticação e armazenamento do Sites.

Para ver ou alterar o código, extraia o ZIP (clique com o botão direito → “Extrair tudo” no Windows) e abra a pasta extraída. Os arquivos principais estão em `src/`.

## Gerar a versão de publicação

```bash
npm install
npm run build
```

O resultado é criado em `dist/server/index.js`.

Os PDFs originais não estão incluídos neste ZIP.
