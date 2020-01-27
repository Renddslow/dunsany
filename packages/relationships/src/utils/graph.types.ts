import { Query } from './query';

export interface Meta {
  type: string;
  action: 'added' | 'linked';
}

export interface GraphNode {
  type: string;
  id: string;
  attributes: any;
}

export interface EdgeWeights {
  eros: number;
  eris: number;
  philos: number;
  agape: number;
}

export interface EdgeOptions extends EdgeWeights {
  type: string;
  directed: boolean;
  from: string;
  to: string;
}

export type Edge = EdgeOptions & {
  id: string;
};

export interface RelationshipEvent {
  first: string;
  second: string;
  action: string;
}

export interface QueryResult {
  matched: Array<GraphNode>;
  edges: Array<Edge>;
  source: Array<GraphNode>;
}

export interface Graph {
  addNode(type: string, data: any): void;
  addEdge(edge: EdgeOptions): void;
  on(event: string, cb: (node: GraphNode, meta: Meta) => void): void;
  query(query: Query): QueryResult;
}
