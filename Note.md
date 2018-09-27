# Nuber Server

## 1. Installation

`devDependencies`로 설치

```sh
yarn add nodemon ts-node @types/node tslint-config-prettier --dev
```

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

아래와 같이 개발 환경에서 사용할 스크립트를 지정한다.

```json
{
  "scripts": {
    "dev": "cd src && nodemon --exec ts-node index.ts -e ts,graphql"
  }
}
```

1. `nodemon --exec ts-node index.ts`: tell nodemon to call 'ts-node index.ts'
1. `ts-node index.ts`: start a typescript node server with index.ts
1. `-e ts,graphql`: watch if the files with the extensions .ts or .graphql change so we will call nodemon again (go back to step two)

## 2. GraphQL Yoga and Express

### 2.1. [graphql-yoga](https://github.com/prisma/graphql-yoga)

**Fully-featured GraphQL Server** with focus on easy setup, performance & great developer experience

아래 라이브러리들이 사용된다. 웹 서버 프레임워크로 express 와 apollo-server 가 사용된다.

- `express`/`apollo-server`: Performant, extensible web server framework
- `graphql-subscriptions`/`subscriptions-transport-ws`: GraphQL subscriptions server
- `graphql.js`/`graphql-tools`: GraphQL engine & schema helpers
- `graphql-playground`: Interactive GraphQL IDE

```sh
yarn add graphql-yoga
```

※ 미들웨어: 앱의 연결이나 요청들을 다루는 방식을 수정하는 것(Ex. logger), 앱의 API 로 무언가를 할 때 미들웨어가 중간에 요청을 가로채 요청을 기록한다든지 추가적인 작업 후, 요청이 다음 단계로 진행되도록 한다.

다음의 미들웨어들과 미들웨어들의 타입을 설치한다.

```sh
yarn add helmet morgan cors
yarn add @types/helmet @types/morgan @types/cors --dev
```

- [helmet](https://github.com/helmetjs/helmet): Helmet helps you **secure your Express apps** by setting various HTTP headers  
  보안을 위한 미들웨어. 요청시마다 미들웨어가 요청을 잠시 멈추고 검사한 후, 위험하지 않다면 요청을 계속한다.
- [morgan](https://github.com/expressjs/morgan): **HTTP request logger** middleware for node.js
- [cors](https://github.com/expressjs/cors): CORS is a node.js package for providing **a Connect/Express** middleware that can be used to enable CORS with various options.

app.ts

```ts
import { GraphQLServer } from "graphql-yoga";
import cors from "cors";
import helmet from "helmet";
import logger from "morgan";

class App {
  public app: GraphQLServer;

  // constructor는 App 클래스를 새로 시작(생성)하면 가장 처음 실행되는 함수다.
  // App 클래스를 어떻게 형성할 지 결정한다.
  constructor() {
    this.app = new GraphQLServer({});
    this.middlewares();
  }
  private middlewares = (): void => {
    // 미들웨어 사용
    this.app.express.use(cors());
    this.app.express.use(logger("dev"));
    this.app.express.use(helmet());
  };
}

export default new App().app;
```