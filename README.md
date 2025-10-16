# Kurama

Aplicação web para explorar informações sobre o universo de Naruto, incluindo personagens, bijuus e clãs.

**Deploy**: https://kurama-eta.vercel.app/

## Tecnologias Utilizadas

- Angular: 20.3.0
- TypeScript: 5.9.2
- Bootstrap: 5.3.8
- SCSS
- RxJS: 7.8.0

## API

O projeto utiliza a API Dattebayo para obter dados sobre o universo de Naruto.

Documentação: https://dattebayo-api.onrender.com/

### Endpoints Utilizados

- **Personagens**: `https://dattebayo-api.onrender.com/characters?page={page}&limit={limit}`
- **Bijuus (Tailed Beasts)**: `https://dattebayo-api.onrender.com/tailed-beasts?page={page}&limit={limit}`
- **Clãs**: `https://dattebayo-api.onrender.com/clans?page={page}&limit={limit}`
- **Personagem por ID**: `https://dattebayo-api.onrender.com/characters/{id}`

## Estrutura do Projeto

- `/src/app/pages` - Páginas da aplicação (home, characters, tailed-beasts, clans)
- `/src/app/components` - Componentes reutilizáveis (navbar, footer, character-card)
- `/public/imgs` - Imagens estáticas

## Funcionalidades

- Listagem de personagens com busca e paginação
- Listagem de bijuus (tailed beasts) com busca e paginação
- Listagem de clãs com busca e paginação
- Exibição de imagem representativa para cada clã (personagem aleatório)
- Tratamento de dados duplicados
- Fallback para imagens não encontradas
- Design responsivo com Bootstrap
