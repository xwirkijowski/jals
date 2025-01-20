import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { readFileSync } from 'fs';
import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync, loadFiles } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";

// Root resolvers
import rootResolvers from "@schema/resolvers";

// `__dirname` workaround for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Root type definitions
const rootTypeDefs = readFileSync(path.join(__dirname, './schema/typeDefs.graphql'), {encoding: 'utf-8'});

// Import type definitions and resolvers from all domains
const typeDefsArr = loadFilesSync(path.join(__dirname, './schema/**/*'), { extensions: ['graphql']});
const resolversArr = await loadFiles([path.join(__dirname, './schema/**/*.resolvers.js'), path.join(__dirname, './schema/**/*.resolvers.ts')], {
	requireMethod: async (p: string) => await import(pathToFileURL(p).pathname),
});

// Import directives
import {authDirectiveTypeDefs, authDirectiveTransformer} from '@schema/directives/auth';

// Create a final schema object form merged root and domain-specific type definitions and their resolvers
let schema = makeExecutableSchema({
	typeDefs: mergeTypeDefs([
		rootTypeDefs,
		authDirectiveTypeDefs,
		...typeDefsArr
	]),
	resolvers: mergeResolvers([
		rootResolvers,
		...resolversArr
	]),
});

schema = authDirectiveTransformer(schema)

export default schema;