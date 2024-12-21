import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import { readFileSync } from 'fs';
import { makeExecutableSchema } from "@graphql-tools/schema";
import { mergeResolvers } from "@graphql-tools/merge";
import { loadFilesSync, loadFiles } from "@graphql-tools/load-files";
import { mergeTypeDefs } from "@graphql-tools/merge";

// Root resolvers
import resolvers from "./schema/resolvers.js";

// `__dirname` workaround for ES modules
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Root type definitions
const typeDefs = readFileSync(path.join(__dirname, './schema/typeDefs.graphql'), {encoding: 'utf-8'});

// Import type definitions and resolvers from all domains
const typeDefsArr = loadFilesSync(path.join(__dirname, './schema/**/*'), { extensions: ['graphql']});
const resolversArr = await loadFiles(path.join(__dirname, './schema/**/*.resolvers.js'), {
	requireMethod: async (p) => { return await import(pathToFileURL(p)); }
});

// Create a final schema object form merged root and domain-specific type definitions and their resolvers
export default makeExecutableSchema({
	typeDefs: mergeTypeDefs([typeDefs, ...typeDefsArr]),
	resolvers: mergeResolvers([resolvers, ...resolversArr]),
});