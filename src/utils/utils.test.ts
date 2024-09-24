const filterTreeByPaths = (tree, paths) => {
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


const filterArrTree = (treeData, path) => {
  if (!Array.isArray(path)) {
    throw new Error('Path must be an array.');
  }
  return filterTreeByPaths(treeData, path)
}

describe('testFilter', () => {
  const testVariable = [
    {
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
              "name": "leaf-5",
              "children": [
                {
                  "id": 8,
                  "name": "leaf-7"
                },
                {
                  "id": 9,
                  "name": "leaf-8"
                }
              ]
            },
            {
              "id": 7,
              "name": "leaf-6"
            }
          ]
        }
      ]
    },
    {
      "id": 100,
      "name": "root2",
      "children": [
        {
          "id": 101,
          "name": "leaf-2-1"
        },
      ]
    }
  ];

  it('returns all children of node 1', () => {
    expect(filterArrTree(testVariable, [1])).toEqual(testVariable.filter(item => item.id === 1));
  });

  it('returns node 2', () => {
    expect(filterArrTree(testVariable, [[1, 2]])).toEqual(
      [{
        "id": 1,
        "name": "root",
        "children": [
          {
            "id": 2,
            "name": "leaf-1"
          }
        ]
      }]
    );
  });

  it('returns different nodes under node 1', () => {
    expect(filterArrTree(testVariable, [[1, 5, 6, 8], [1, 5, 7]])).toEqual(
      [{
        "id": 1,
        "name": "root",
        "children": [
          {
            "id": 5,
            "name": "leaf-4",
            "children": [
              {
                "id": 6,
                "name": "leaf-5",
                "children": [
                  {
                    "id": 8,
                    "name": "leaf-7"
                  }
                ]
              },
              {
                "id": 7,
                "name": "leaf-6"
              }
            ]
          }
        ]
      }]
    );
  });



  it('returns different nodes under node 1', () => {
    expect(filterArrTree(testVariable, [[1, 5, 6, 8], [100, 101]])).toEqual(
      [{
        "id": 1,
        "name": "root",
        "children": [
          {
            "id": 5,
            "name": "leaf-4",
            "children": [
              {
                "id": 6,
                "name": "leaf-5",
                "children": [
                  {
                    "id": 8,
                    "name": "leaf-7"
                  }
                ]
              }
            ]
          }
        ]
      },
        {
          "id": 100,
          "name": "root2",
          "children": [
            {
              "id": 101,
              "name": "leaf-2-1"
            },
          ]
        }]
    );
  });
});