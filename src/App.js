import "styles/app.scss";
import { useEffect, useState } from "react";
import { cloneDeep } from "lodash";
import JSONCrush from "jsoncrush";
import Node from "components/Node";

const defaultComponent = {
  id: 1,
  name: "NewComponent",
  variables: [],
};

const defaultNode = {
  id: 1,
  componentId: 1,
  collapsed: false,
  children: [],
};

function App() {
  const [data, _setData] = useState({
    components: [{ ...defaultComponent, name: "App" }],
    tree: [{ ...defaultNode }],
    componentIdIncrementer: 2,
    nodeIdIncrementer: 2,
  });
  const [selectedNode, setSelectedNode] = useState(null);

  console.log(data);

  const urlParams = new URLSearchParams(window.location.search);
  const urlData = urlParams.get("data");

  useEffect(() => {
    pullStateFromUrl(urlData);
  }, [urlData]);

  useEffect(() => {
    window.onpopstate = (e) => {
      pullStateFromUrl(urlData);
    };
    window.document.addEventListener("click", (e) => {
      if (
        window.document.contains(e.target) &&
        !e.target.closest(".component")
      ) {
        setSelectedNode(null);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { components, tree, componentIdIncrementer, nodeIdIncrementer } = data;

  /**
   * Update the data state and url state
   * @param {object} newData New data set to be applied
   */
  function setData(newData) {
    _setData(newData);
    const crushedData = JSONCrush.crush(JSON.stringify(newData));
    const url = new URL(window.location);
    url.searchParams.set("data", crushedData);
    window.history.pushState({}, "", url);
  }

  function newComponent() {
    const component = { ...defaultComponent, id: componentIdIncrementer };
    const node = {
      ...defaultNode,
      componentId: component.id,
      id: nodeIdIncrementer,
    };
    setData({
      ...data,
      components: [...components, component],
      tree: [...tree, node],
      componentIdIncrementer: componentIdIncrementer + 1,
      nodeIdIncrementer: nodeIdIncrementer + 1,
    });
  }

  function handleComponentChange(component) {
    const newData = { ...data };
    const index = newData.components.findIndex(
      (item) => item.id === component.id
    );
    newData.components[index] = { ...component };
    setData(newData);
  }

  function handleAddChildToComponent(parentNode) {
    const component = { ...defaultComponent, id: componentIdIncrementer };
    const newTree = cloneDeep(data.tree);
    const node = findNode(parentNode.id, newTree);
    if (node) {
      node.children.push({
        ...defaultNode,
        componentId: component.id,
        id: nodeIdIncrementer,
      });

      setData({
        components: [...components, component],
        tree: newTree,
        componentIdIncrementer: componentIdIncrementer + 1,
        nodeIdIncrementer: nodeIdIncrementer + 1,
      });
    }
  }

  function handleDeleteNodeClick(node) {
    const newTree = cloneDeep(data.tree);
    const parentNode = newTree.reduce((prev, acc) => {
      return prev || findParentNode(acc, node.id);
    }, null);
    if (parentNode) {
      parentNode.children = parentNode.children.filter(
        (child) => child.id !== node.id
      );
    } else {
      const index = newTree.findIndex((item) => item.id === node.id);
      newTree.splice(index, 1);
    }
    setData({
      ...data,
      tree: newTree,
    });
  }

  function findNode(id, items) {
    let found;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.componentId === id) {
        return item;
      } else if (item.children.length > 0) {
        found = findNode(id, item.children);
        if (found) {
          return found;
        }
      }
    }
    return found;
  }

  function findParentNode(parentNode, id) {
    let found;
    const { children: items } = parentNode;
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.componentId === id) {
        return parentNode;
      } else if (item.children.length > 0) {
        found = findParentNode(item, id);
        if (found) {
          return found;
        }
      }
    }
    return found;
  }

  function pullStateFromUrl(urlData) {
    if (urlData) {
      const uncrushed = JSONCrush.uncrush(urlData);
      try {
        const newData = JSON.parse(uncrushed);
        _setData(newData);
      } catch (e) {
        console.log(e);
      }
    }
  }

  function handleSelectNode(e, node) {
    setSelectedNode(node?.id);
  }

  function handleNodeCollapseClick(node, newCollapseValue) {
    const newTree = cloneDeep(data.tree);
    const newNode = findNode(node.id, newTree);
    newNode.collapsed = newCollapseValue;
    setData({
      ...data,
      tree: newTree,
    });
  }

  return (
    <div className="App">
      <header className="App-header">React Blueprinter</header>
      <div className="tree">
        {tree.map((node) => (
          <Node
            key={node.id}
            node={node}
            components={components}
            selectedNode={selectedNode}
            onComponentChange={handleComponentChange}
            onAddChildClick={handleAddChildToComponent}
            onDeleteClick={handleDeleteNodeClick}
            onSelected={handleSelectNode}
            onCollapseClick={handleNodeCollapseClick}
          />
        ))}
      </div>
      <div className="new-component">
        <button className="button" onClick={newComponent}>
          New Component
        </button>
      </div>
    </div>
  );
}

export default App;
