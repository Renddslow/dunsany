import cuid from 'cuid';

import Query from './query';

interface Meta {
  type: string;
  action: 'added' | 'linked';
}

interface GraphNode {
  type: string;
  id: string;
  attributes: any;
}

interface EdgeWeights {
  eros: number;
  eris: number;
  philos: number;
  agape: number;
}

interface Edge extends EdgeWeights {
  type: string;
  directed: boolean;
  from: string;
  to: string;
  id: string;
}

interface Graph {
  addNode(type: string, data: any): void;
  addEdge(from: string, to: string, type: string, weights: EdgeWeights, directed: boolean): void;
  on(event: string, cb: (node: GraphNode, meta: Meta) => void): void;
  query(query: Query): Edge;
  queryAll(query: Query): Array<Edge>;
}

export default (): Graph => {
  const nodes: Map<string, GraphNode> = new Map();
  const edges: Array<Edge> = [];

  const subscribers = [];

  const call = (event: string, node: GraphNode, meta: Meta) => {
    subscribers.filter((s) => s.event === event).forEach((s) => s.cb(node, meta));
  };

  const addNode = (type: string, data: any) => {
    if (!data.id) throw new Error('');

    const node = {
      id: data.id,
      type,
      attributes: data,
    };

    nodes.set(data.id, node);

    const meta: Meta = {
      type: type,
      action: 'added',
    };

    call(type, node, meta);
    call('added', node, meta);
  };

  const addEdge = (
    from: string,
    to: string,
    type: string,
    weights: EdgeWeights,
    directed: boolean = true,
  ) =>
    edges.push({
      from,
      to,
      type,
      directed,
      ...weights,
      id: cuid(),
    });

  const on = (event: string, cb: (node: GraphNode, meta: Meta) => void) =>
    subscribers.push({
      event,
      cb,
    });

  const query = (query: Query): Edge => {
    const [first] = queryAll(query);

    if (!first) return null;

    return first;
  };

  const queryAll = (query: Query): Array<Edge> => {
    if (query.id && query.relationshipType) {
      return edges.filter(
        (e) => (e.from === query.id || e.to === query.id) && e.type === query.relationshipType,
      );
    }

    return [];
  };

  return {
    addNode,
    addEdge,
    on,
    query,
    queryAll,
  };
};
