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


/*
* Sample Tree:
*  [{
*     "id": 1,
*     "name": "root",
*     "children": [
*         {
*             "id": 2,
*             "name": "leaf-1"
*         },
*         {
*             "id": 3,
*             "name": "leaf-2"
*         },
*         {
*             "id": 4,
*             "name": "leaf-3"
*         },
*         {
*             "id": 5,
*             "name": "leaf-4"
*             "children": [
*                 {
*                    "id": 6,
*                    "name": "leaf-5"
*                 }
*             ]
*         },
*     ]
* }]
*
*
*
* */

  const testVariable = [{
     "id": 1,
     "name": "root",
     "children": [
         {
             "id": 2,
             "name": "leaf-1"
         },
         {
             "id": 3,
             "name": "leaf-2"
         },
         {
             "id": 4,
             "name": "leaf-3"
         },
         {
             "id": 5,
             "name": "leaf-4",
             "children": [
                 {
                    "id": 6,
                    "name": "leaf-5"
                 }
             ]
         },
     ]
 }]




export const filterArrTree = (arrTree, path) => {
    if (!Array.isArray(path)) {
        throw new Error('Path must be an array.');
    }

    let currentNodes = treeData; // Start from the root nodes

    for (let step of path) {
        if (!Array.isArray(currentNodes)) {
            return null; // We've reached a leaf node but there's more in the path
        }

        currentNodes = currentNodes.filter(node => node.id === step);
        if (currentNodes.length === 0) {
            return null; // No matching node found
        }
        currentNodes = currentNodes[0].children || []; // Move to children if available
    }

    return currentNodes.length > 0 ? currentNodes[0] : currentNodes;
}