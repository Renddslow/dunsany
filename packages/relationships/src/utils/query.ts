import { Edge, GraphNode, QueryResult } from './graph.types';
import { has } from 'dot-prop';

export interface Query {
  to?: any;
  from?: any;
  weights?: {
    eros?: any;
    eris?: any;
    philos?: any;
    agape?: any;
  };
}

// traverseKeys traverses deeply through an object, adding keys in dot-notation
// to an array when a value is present. This ensures that a query can
// be done based on direct key look-ups.
const traverseKeys = (o: object, acc: Array<string> = [], parent = '') =>
  Object.keys(o).reduce((a, k) => {
    if (typeof o[k] === 'object' && !Array.isArray(o[k])) {
      return traverseKeys(o[k], a, parent ? `${parent}.${k}` : k);
    }

    a.push(parent ? `${parent}.${k}` : k);
    return acc;
  }, acc);

const query = (nodes: Array<GraphNode>, edges: Array<Edge>) => (q: Query): QueryResult => {
  const fromKeys = traverseKeys(q.from);
  const toKeys = traverseKeys(q.to);

  const matchingFroms = nodes.filter((n) => fromKeys.every((k) => has(n, k)));
  const matchingTos = nodes.filter((n) => toKeys.every((k) => has(n, k)));

  const possibleToIDs = matchingTos.map(({ id }) => id);
  const validEdges = matchingFroms.reduce((acc, n) => {
    const e = edges.filter((edge) => edge.from === n.id && possibleToIDs.includes(edge.to));

    if (e.length) {
      acc.push(...e);
    }

    return acc;
  }, []);
  const edgeToIDs = validEdges.map(({ to }) => to);

  return {
    edges: validEdges,
    source: matchingFroms,
    matched: matchingTos.filter(({ id }) => edgeToIDs.includes(id)),
  };
};

export default query;
