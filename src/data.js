const mockData = {
    nodes: [
        {
            id: "node1",
            label: "Parent Node A",
            slug: "parent-node-a",
            inputs: [{ key: "input1", socket: { name: "socket" } }],
            outputs: [{ key: "output1", socket: { name: "socket" } }],
            subnodes: [
                {
                    id: "subnode1",
                    label: "Child 1",
                    inputs: [{ key: "input1", socket: { name: "socket" } }],
                    outputs: [{ key: "output1", socket: { name: "socket" } }],
                },
                {
                    id: "subnode2",
                    label: "Child 2",
                    inputs: [{ key: "input1", socket: { name: "socket" } }],
                    outputs: [{ key: "output1", socket: { name: "socket" } }],
                },
            ],
        },
        {
            id: "node2",
            label: "Parent Node B",
            slug: "parent-node-b",
            inputs: [{ key: "input1", socket: { name: "socket" } }],
            outputs: [{ key: "output1", socket: { name: "socket" } }],
            subnodes: [
                {
                    id: "subnode3",
                    label: "Child 3",
                    inputs: [{ key: "input1", socket: { name: "socket" } }],
                    outputs: [{ key: "output1", socket: { name: "socket" } }],
                },
                {
                    id: "subnode4",
                    label: "Child 4",
                    inputs: [{ key: "input1", socket: { name: "socket" } }],
                    outputs: [{ key: "output1", socket: { name: "socket" } }],
                },
            ],
        },
    ],
    connections: [
        {
            source: "node1",
            sourceOutput: "output1",
            target: "node2",
            targetInput: "input1",
        },
        {
            source: "subnode1",
            sourceOutput: "output1",
            target: "subnode3",
            targetInput: "input1",
        },
    ],
};
