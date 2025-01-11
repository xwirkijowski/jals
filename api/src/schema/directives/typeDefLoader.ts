import path from "path";
import {fileURLToPath} from "url";
import {readFileSync} from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const loadTypeDef = (directory: string) => {
    return readFileSync(path.join(__dirname, `./${directory}/typeDef.graphql`), {encoding: 'utf-8'});
}

