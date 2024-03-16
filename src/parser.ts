interface Directory {
    name: string;
    children: Node[];
}

interface File {
    name: string;
    size: string; // size holds the file size with its unit
}

// recursive function that takes json input and returns a tree of nodes
function parseNodes(json: any): Node {
    if (json.type === 'directory') {
        return {
            name: json.name,
            size: json.size,
            children: json.contents.map(parseNodes)
        };
    } else {
        const numbersOnly: RegExp = /\d+/;
        return {
            name: json.name,
            size: numbersOnly.test(json.size) ? `${json.size}B` : json.size,
        };
    }
}

export type Node = Directory | File;
export {parseNodes};