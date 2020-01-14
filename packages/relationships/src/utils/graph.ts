import cuid from 'cuid';

interface Meta {
  type: string;
  action: 'added' | 'linked';
}

interface Data {
  type: string;
  id: string;
  attributes: any;
}

export default () => {
  const graph = new Map();
  const edges = [];

  const subscribers = [];

  const call = (event: string, data: object, meta: Meta) => {
    subscribers.filter((s) => s.event === event).forEach((s) => s.cb(data, meta));
  };

  const addNode = (data: Data) => {
    if (!data.id) throw new Error('');
    if (!data.type) throw new Error('');

    graph.set(data.id, data);

    const meta: Meta = {
      type: data.type,
      action: 'added',
    };

    call(data.type, data, meta);
    call('added', data, meta);
  };

  const addEdge = (from: string, to: string, data: object, directed: boolean = true) => {
    edges.push({
      from,
      to,
      directed,
      data,
      id: cuid(),
    });
  };

  const on = (event, cb) => {
    subscribers.push({
      event,
      cb,
    });
  };

  return {
    addNode,
    addEdge,
    on,
  };
};
