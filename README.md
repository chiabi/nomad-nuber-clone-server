# 우버 클론서버

[노마드코드의 우버클론 코딩](https://academy.nomadcoders.co/courses/enrolled/360159)을 따라 실습하기

## 1. Installation

`devDependencies`로 설치

- [nodemon](https://nodemon.io/): reload, automatically. Nodemon is a utility that will monitor for any changes in your source and automatically restart your server. Perfect for development
- typescript
- [ts-node](https://github.com/TypeStrong/ts-node): TypeScript execution and REPL for node.js, with source map support. Works with typescript@>=2.0.
- [@types/node](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/node): This package contains type definitions for Node.js.
- [tslint-config-prettier](https://github.com/alexjoverm/tslint-config-prettier): Use tslint with prettier

### 1.1. tslint.json

```json
{
  "defaultSeverity": "error",
  "extends": ["tslint:recommended", "tslint-config-prettier"],
  "linterOptions": {
    "exclude": ["config/**/*.js", "node_modules/**/*."]
  },
  "jsRules": {},
  "rules": {
    "no-console": false,
    "member-access": false,
    "object-literal-sort-keys": false,
    "ordered-imports": true,
    "interface-name": false,
    "strict-null-checks": false
  }
}
```

- `defaultSeverity?: "error" | "warning" | "off"`: The severity level that is applied to rules in this config file as well as rules in any inherited config files which have their severity set to “default”. If undefined, “error” is used as the defaultSeverity.

### 1.2. package.json

```json
{
  "scripts": {
    "dev": "cd src && nodemon --exec ts-node index.ts -e ts,graphql"
  }
}
```

- `nodemon --exec`: Execute and monitor other programs
- `ts-node -e`: Execute code with TypeScript
