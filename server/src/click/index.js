import model from './click.model';
import types from './click.types';
import mutations from './click.mutations';
import resolvers from './click.resolvers';

export default { model, types: [ types, mutations ], resolvers };