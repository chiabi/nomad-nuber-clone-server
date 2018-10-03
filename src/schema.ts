// import { GraphQLSchema } from "graphql";
import { makeExecutableSchema } from "graphql-tools";
import { fileLoader, mergeResolvers, mergeTypes } from "merge-graphql-schemas";
import path from "path";

const allTypes: any[] = fileLoader(path.join(__dirname, "./api/**/*.graphql"));

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
