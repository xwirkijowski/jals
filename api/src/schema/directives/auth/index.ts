import {defaultFieldResolver} from "graphql";
import {getDirective, MapperKind, mapSchema} from '@graphql-tools/utils';

import {loadTypeDef} from "../typeDefLoader";
import {check} from "@util/helpers";

import {IContext} from "@type/context.types";
import {GraphQLSchema} from "graphql/type";

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

                        fieldConfig.resolve = (source: any, args: any, context: IContext, info) => {
                            if (level === 'ADMIN') {
                                check.isAdmin(context.session)
                            } else if (level === 'OWNER') {
                                // Only works on field level
                                check.isOwner(context.session, source?.createdBy);
                            } else if (level === 'SESSION') {
                                check.session(context.session)
                            }

                            return resolve(source, args, context, info);
                        }

                        return fieldConfig;
                    }
                }
            },
        }),
    }
}

export const {authDirectiveTypeDefs, authDirectiveTransformer} = authDirective('auth');