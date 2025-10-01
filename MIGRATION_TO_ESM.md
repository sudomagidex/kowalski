# 🔄 Migração para ESM (ES Modules)

## 📋 Contexto

O Baileys v6+ usa ESM (ES Modules) nativamente. O projeto foi migrado de CommonJS para ESM para garantir compatibilidade total.

## ✅ Mudanças Implementadas

### 1. package.json

```json
{
  "type": "module", // ← Indica que o projeto usa ESM
  "scripts": {
    "dev": "tsx watch src/index.ts", // ← Usa tsx (melhor para ESM)
    "start": "node dist/index.js" // ← Node nativo para produção
  }
}
```

**Por que `tsx`?**

- Suporte nativo a ESM
- Sem warnings experimentais
- Hot reload automático
- Melhor performance

### 2. tsconfig.json

```json
{
  "compilerOptions": {
    "module": "ES2022", // ← Era "commonjs"
    "moduleResolution": "bundler" // ← Era "node"
  }
}
```

### 3. Extensões .js nos Imports

Em ESM, todos os imports precisam incluir a extensão `.js`:

```typescript
// ❌ Antes (CommonJS)
import { config } from './config';
import { logger } from '../shared/utils/logger';

// ✅ Agora (ESM)
import { config } from './config/index.js';
import { logger } from '../shared/utils/logger.js';
```

**Por quê?** ESM requer especificação explícita de arquivos.

### 4. Estrutura de Arquivos Atualizada

Todos os arquivos foram atualizados:

- ✅ `src/index.ts`
- ✅ `src/api/**/*.ts`
- ✅ `src/bot/**/*.ts`
- ✅ `src/config/**/*.ts`
- ✅ `src/shared/**/*.ts`

## 🚀 Como Usar

### Desenvolvimento

```bash
npm run dev
```

**Saída esperada:**

```
[INFO] Starting Kowalski WhatsApp Bot...
[INFO] API server started
    port: 3000
```

**Sem warnings! 🎉**

### Build para Produção

```bash
npm run build
```

Gera código ES Modules em `dist/`:

```javascript
// dist/index.js
import { ApiServer } from './api/index.js';
// ...
```

### Executar em Produção

```bash
npm start
```

Node.js nativo executa o código ESM compilado.

## 🧪 Testes

Os testes continuam funcionando com Jest:

```bash
npm test
```

Jest usa transformação com `ts-jest` para CommonJS internamente, mas o código fonte é ESM.

## ⚠️ Diferenças Importantes

### CommonJS vs ESM

| Aspecto         | CommonJS                       | ESM                            |
| --------------- | ------------------------------ | ------------------------------ |
| Syntax          | `require()` / `module.exports` | `import` / `export`            |
| Extensões       | Opcional                       | Obrigatório `.js`              |
| Top-level await | ❌ Não                         | ✅ Sim                         |
| Dinâmico        | `require()` síncrono           | `import()` assíncrono          |
| \_\_dirname     | ✅ Disponível                  | ❌ Não (use `import.meta.url`) |

### Obtendo \_\_dirname em ESM

Se precisar:

```typescript
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
```

## 🔧 Troubleshooting

### Erro: "Cannot use import statement outside a module"

**Solução:** Verifique se `"type": "module"` está no `package.json`.

### Erro: "Cannot find module './config'"

**Solução:** Adicione `.js` no final: `'./config/index.js'`

### Erro: "ERR_MODULE_NOT_FOUND"

**Solução:** Certifique-se de que o caminho e a extensão estão corretos.

### Testes falhando

**Solução:** Jest está configurado para transformar ESM. Verifique `jest.config.js`:

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transformIgnorePatterns: ['node_modules/(?!(@whiskeysockets/baileys)/)'],
  // ...
};
```

## 📊 Benefícios da Migração

1. **Compatibilidade** ✅
   - Baileys v6+ funciona nativamente
   - Sem hacks ou workarounds

2. **Performance** 🚀
   - Melhor tree-shaking
   - Imports estáticos otimizados

3. **Moderno** 💎
   - Padrão atual do JavaScript
   - Suporte a top-level await

4. **Developer Experience** 🎯
   - Hot reload com `tsx`
   - Sem warnings experimentais
   - Melhor debugging

## 🎓 Recursos

- [Node.js ESM Documentation](https://nodejs.org/api/esm.html)
- [TypeScript ESM Support](https://www.typescriptlang.org/docs/handbook/esm-node.html)
- [tsx - TypeScript Execute](https://github.com/privatenumber/tsx)

## ✅ Checklist de Verificação

Após a migração, confirme:

- [x] `"type": "module"` no package.json
- [x] `"module": "ES2022"` no tsconfig.json
- [x] Todos os imports têm `.js` no final
- [x] Scripts de dev/build atualizados
- [x] Servidor inicia sem warnings
- [x] API responde corretamente
- [x] Testes passam

## 🎉 Status

**✅ Migração Completa!**

O projeto está 100% funcional com ESM e pronto para usar o Baileys.

---

**Data:** 30 de setembro de 2025  
**Versão:** 1.0.0
