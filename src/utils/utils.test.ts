const filterArrTree = (treeData, path) => {
  if (!Array.isArray(path)) {
    throw new Error('Path must be an array.');
  }

  const res = []

  for (let p = 0; p < path.length; p++) {
    if (!Array.isArray(path[p])) {
      const currentNode = treeData.filter(item => item.id === path[p])[0]
      res.push(currentNode)
    } else {

    }
  }
  return res
}

describe('testFilter', () => {
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
      }
    ]
  }];

  it('returns all children of node 1', () => {
    expect(filterArrTree(testVariable, [1])).toEqual(testVariable);
  });

  it('returns node 2', () => {
    expect(filterArrTree(testVariable, [[1, 2]])).toEqual(testVariable[0].children.filter(node => node.id === 2));
  });

  it('returns node 5 and its children', () => {
    expect(filterArrTree(testVariable, [[1, 5]])).toEqual(testVariable[0].children.filter(node => node.id === 5));
  });
});