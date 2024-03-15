import docs from './static/docs.json';

interface Directory {
    name: string;
    children: Node[];
}

interface File {
    name: string;
}


// recursive function that takes json input and returns a tree of nodes
function parseNodes(json: any): Node {
    if (json.type === 'directory') {
        return {
            name: json.name,
            children: json.contents.map(parseNodes)
        };
    } else {
        return {
            name: json.name
        };
    }
}

export type Node = Directory | File;
export {parseNodes};