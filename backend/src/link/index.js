import model from './link.model';
import types from './link.types';
import mutations from './link.mutations';
import resolvers from './link.resolvers';

export default { model, types: [ types, mutations ], resolvers };