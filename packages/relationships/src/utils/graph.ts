import cuid from 'cuid';

import query from './query';
import { Graph, GraphNode, Edge, EdgeOptions, Meta } from './graph.types';

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

  const addEdge = (edge: EdgeOptions) =>
    edges.push({
      ...edge,
      id: cuid(),
    });

  const on = (event: string, cb: (node: GraphNode, meta: Meta) => void) =>
    subscribers.push({
      event,
      cb,
    });

  return {
    addNode,
    addEdge,
    on,
    query: query(nodes, edges),
  };
};
