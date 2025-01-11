import {GraphQLSchema} from "graphql/type";
import {getDirective, MapperKind, mapSchema} from '@graphql-tools/utils';
import {loadTypeDef} from "../typeDefLoader";
import {defaultFieldResolver} from "graphql/execution";
import {check} from "../../../utilities/helpers";
import {ContextInterface} from "../../../types/context.types";

const authDirective = (directiveName: string)=>  {
    const typeDirectiveArgumentMaps: Record<string, any> = {}

    return {
        authDirectiveTypeDefs: loadTypeDef(directiveName),
        authDirectiveTransformer: (schema: GraphQLSchema) => mapSchema(schema, {
            [MapperKind.TYPE]: type => {
                const directive = getDirective(schema, type, directiveName)?.[0];

                if (directive) {
                    typeDirectiveArgumentMaps[type.name] = directive;
                }

                return undefined;
            },
            [MapperKind.OBJECT_FIELD]: (fieldConfig, _fieldName, typeName) => {
                const directive = getDirective(schema, fieldConfig, directiveName)?.[0] ?? typeDirectiveArgumentMaps[typeName];

                if (directive) {
                    const {level} = directive;

                    if (level) {
                        const {resolve = defaultFieldResolver} = fieldConfig

                        fieldConfig.resolve = (source: any, args: any, context: ContextInterface, info) => {
                            if (level === 'ADMIN') {
                                check.isAdmin(context.session)
                            } else if (level === 'OWNER' && source?.createdBy) {
                                check.isOwner(context.session, source.createdBy);
                            }

                            resolve(source, args, context, info);
                        }

                        return fieldConfig;
                    }
                }
            },
        }),
    }
}

export const {authDirectiveTypeDefs, authDirectiveTransformer} = authDirective('auth');