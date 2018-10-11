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

- [graphql-tools](https://github.com/apollographql/graphql-tools): 간결한 방법으로 GraphQL schema 와 resolvers 를 자바스크립트로 작성하는 유틸리티 툴
- [merge-graphql-schemas](https://github.com/okgrow/merge-graphql-schemas): GraphQL 서버 구현을 간단하게 만들어주고, type 과 resolver 파일을 모듈화해준다.

※ 강의에서는 `GraphQLSchema[]`, `string[]`으로 해도 정상 작동하던데, 나는 type 에러가 남. `any[]` 로 바꿔주는 수밖에 없었음

```ts
// schema.ts
// import { GraphQLSchema, GraphQLType } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import path from "path";
// 여기서 에러
const allTypes: any[] = fileLoader(path.join(__dirname, "./api/**/*.graphql"));
// 여기서 에러
const allResolvers: any[] = fileLoader(
  // 배포용으로는 js파일로 바꿔야 하므로 .*로 파일확장자를 처리해줘야 충돌이 없음
  path.join(__dirname, "./api/**/*.resolvers.*")
);

const mergedTypes = mergeTypes(allTypes);
const mergedResolvers = mergeResolvers(allResolvers);

const schema = makeExecutableSchema({
  typeDefs: mergedTypes,
  resolvers: mergedResolvers
});

export default schema;
```

## GraphQL to Typescript

타입스크립트로 무엇이 리턴될 지 알려주게 만들자.
GraphQL 과 Typescript 를 연결하자

다음 2 가지를 devDependencies 로 설치하자

- [graphql-to-typescript](https://github.com/3VLINC/graphql-to-typescript)
- [gql-merge](https://github.com/liamcurry/gql/tree/master/packages/gql-merge)

```sh
$ yarn add graphql-to-typescript gql-merge --dev
```

그리고 package.json 의 scripts 에 모든 graphql 파일들을 복제해 typescript definition 으로 바꾸는 명령어를 추가하자

`graphql-to-typescript`에는 파일 하나만 입력할 수 있다. 그래서 `graphql` 파일을 모두 `export`해서 하나로 합치는 작업을 해야한다.

```json
{
  "scripts": {
    "dev": "cd src && nodemon --exec ts-node index.ts -e ts,graphql",
    "pretypes": "gql-merge --out-file ./src/schema.graphql ./src/api/**/*.graphql",
    "types": "graphql-to-typescript ./src/schema.graphql ./src/types/graph.d.ts"
  }
}
```

- grapql 을 모두 합쳐 하나의 파일로 만든다.
- graphql 을 typescript 로 바꾼다. - typescript 로 인터페이스들이 생성되어 사용할 수 있게 된다.
- resolver 에서 이러한 생성된 인터페이스들을 사용하면 리턴할 값이 무엇인지 알 수 있다.

### d.ts

타입스크립트 definition 파일, vscode 가 import 를 도와준다.
