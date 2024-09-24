export const timestampToTime = (timestamp: number) => {
    if (!timestamp) {
        return ''
    }
    if (timestamp && timestamp.toString().length < 13) {
        timestamp = timestamp * 1000
    }
    const date = new Date(timestamp) //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    const Y = date.getFullYear() + '-'
    const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-'
    const D = (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + ' '
    const h = (date.getHours() < 10 ? '0' + date.getHours() : date.getHours()) + ':'
    const m = (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()) + ':'
    const s = date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
    return Y + M + D + h + m + s
}

export const timeToTimestamp = (timeString: string) => {
    if (!timeString) {
        return null
    }
    const dateObject = new Date(timeString)
    if (!isNaN(dateObject.getTime())) {
        return Math.round(dateObject.getTime() * 0.001)
    }
    throw new Error('invalid timestamp')
}

export const maxInArray = (target: any) => {
    // @ts-ignore
    return target.reduce((a: number, b: number) => Math.max(a, b))
}

export const createTree = (arr) => {
    // 创建一个 Map 对象来存储 id 和对象的关系
    const map = new Map();
    const tree = [];

    // 遍历数组，将每个对象存储到 map 中，并设置它们的 children 属性为空数组
    arr.forEach(item => {
        item.value = item.id
        item.label = item.tagName
        map.set(item.id, {...item, children: []});
    });

    // 再次遍历数组，这次是为了建立父子关系
    arr.forEach(item => {
        // 如果 item 有 parentId，则将 item 添加到对应父项的 children 数组中
        if (item.parentId !== undefined && item.parentId !== null && item.parentId !== 0) {
            const parent = map.get(item.parentId);
            if (parent) {
                parent.children.push(map.get(item.id));
            }
        } else {
            // 如果没有 parentId，则认为是根节点，添加到 tree 中
            tree.push(map.get(item.id));
        }
    });

    return tree;
}

export const flattenArr = (arr) => {
    return arr.reduce((acc, val) => {
        return acc.concat(Array.isArray(val) ? flattenArr(val) : val);
    }, []);
}

export const filterTreeByPaths = (tree, paths) => {
    if (!Array.isArray(paths)) {
        throw new Error('Paths must be an array.');
    }

    const findPath = (node, path) => {
        // 如果路径已经空了，说明找到了对应的子节点
        if (path.length === 0) {
            return { ...node };
        }

        // 当前路径的第一个元素是要找的子节点的 id
        const idToFind = path[0];
        console.log(idToFind)
        if (!node.children) return null;

        // 在 children 中找到 id 匹配的子节点
        const childNode = node.children.find(child => child.id === idToFind);
        console.log(childNode)
        if (!childNode) return null;

        // 递归地找下一个节点
        const filteredChild = findPath(childNode, path.slice(1));
        if (filteredChild) {
            return {
                ...node,
                children: [filteredChild]
            };
        }

        return null;
    }

    // 合并具有相同 id 的节点
    const mergeNodes = (nodeList) => {
        const merged = [];

        nodeList.forEach(node => {
            // 检查已合并的节点列表中是否存在相同 id 的节点
            const existingNode = merged.find(n => n.id === node.id);

            if (existingNode) {
                // 如果存在，合并它们的子节点
                if (node.children && existingNode.children) {
                    existingNode.children = mergeNodes([...existingNode.children, ...node.children]);
                } else if (node.children) {
                    existingNode.children = node.children;
                }
            } else {
                // 如果不存在相同 id 的节点，直接添加到合并列表
                merged.push({ ...node });
            }
        });

        return merged;
    }

    // 初始化返回的 filtered tree
    let filteredTree = {};

    paths.forEach(path => {
        let result = undefined
        let keyName = undefined
        if (!Array.isArray(path)) {
            result = tree.find(item => item.id === path)
            keyName = `_${path}`
            console.log(result, ' find path')
        } else {
            keyName = `_${path[0]}`
            result = findPath(tree.find(item => item.id === path[0]), path.slice(1));
            console.log(result, ' find path')
        }
        if (result) {
            if (filteredTree[keyName]) {
                // 如果 filteredTree 已经存在，合并子节点
                filteredTree[keyName].children = mergeNodes([...filteredTree[keyName].children, ...result.children]);
            } else {
                // 如果 filteredTree 还不存在，直接赋值
                filteredTree[keyName] = result;
            }
        }

    });

    return [...Object.values(filteredTree)];
}


export const findSubarrays = (arrays, subarray) => {
    return arrays.filter(array => {
        // 检查子数组的长度
        if (subarray.length > array.length) return false;

        // 尝试在数组中找到子数组
        for (let i = 0; i <= array.length - subarray.length; i++) {
            let match = true;
            for (let j = 0; j < subarray.length; j++) {
                if (array[i + j] !== subarray[j]) {
                    match = false;
                    break;
                }
            }
            if (match) return true;
        }

        return false;
    });
}