const repoBaseUrl = 'https://github.com/7Last/docs';
const rawContentUrl = `https://raw.githubusercontent.com/7Last/docs/main`;

interface Directory {
    name: string;
    children: Node[];
}

interface File {
    name: string;
    size: string; // size holds the file size with its unit
    url: string;
}

// recursive function that takes json input and returns a tree of nodes
function parseNodes(json: any): Node {
    const lastSegment: RegExp = /[^/]*$/;
    const lastSegmentName = lastSegment.exec(json.name) !== null ? lastSegment.exec(json.name)![0] : json.name;

    if (json.type === 'directory') {
        return {
            name: lastSegmentName,
            size: json.size,
            children: json.contents.map(parseNodes)
        };
    } else {
        const numbersOnly: RegExp = /\d+/;

        return {
            name: lastSegmentName,
            size: numbersOnly.test(json.size) ? `${json.size}B` : json.size,
            url: rawContentUrl + '/' + json.name.replace('docs/', '')
        };
    }
}

export type Node = Directory | File;
export {parseNodes};
export {repoBaseUrl, rawContentUrl};