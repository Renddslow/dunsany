# Dunsany

## Example

```js
import Graph, { mapFamily } from '@dunsany/relationships';
import createPantheon from '@dunsany/pantheon';

const graph = Graph();
const pantheon = createPantheon();

pantheon.deities.forEach((deity) => graph.addNode('deity', deity));
mapFamily(graph, pantheon.relationships).map(graph.addEdge);
```
