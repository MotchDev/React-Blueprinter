import { useEffect, useRef } from "react";
import Component from "./Component";
import "styles/node.scss";

const Node = ({
  node,
  components,
  selectedNode,
  onComponentChange,
  onAddChildClick,
  onDeleteClick,
  onSelected,
  onCollapseClick,
}) => {
  const nodeRef = useRef(null);
  const { id, componentId, children, collapsed } = node;
  const component = components.find((item) => item.id === componentId);
  const selected = id === selectedNode;

  useEffect(() => {
    if (nodeRef.current) {
      nodeRef.current.onclick = (e) => {
        if (
          !selected &&
          e.target.closest(".node")?.dataset?.id === String(id)
        ) {
          onSelected(e, node);
        }
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selected]);

  function handleCollapseButtonClick(e) {
    onCollapseClick(node, !collapsed);
    onSelected(e, null);
  }

  return (
    <div className="node" ref={nodeRef} data-id={id}>
      <Component
        key={node.id}
        node={node}
        component={component}
        collapsed={node.collapsed}
        selected={selected}
        onChange={onComponentChange}
        onAddChildClick={onAddChildClick}
        onDeleteClick={onDeleteClick}
      >
        {children.length > 0 &&
          children.map((child) => (
            <Node
              key={child.id}
              node={child}
              components={components}
              selectedNode={selectedNode}
              onComponentChange={onComponentChange}
              onAddChildClick={onAddChildClick}
              onDeleteClick={onDeleteClick}
              onSelected={onSelected}
              onCollapseClick={onCollapseClick}
            />
          ))}
      </Component>
      <button className="collapse-button" onClick={handleCollapseButtonClick}>
        {collapsed ? ">" : "v"}
      </button>
    </div>
  );
};

export default Node;
