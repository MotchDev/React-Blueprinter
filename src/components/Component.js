import { useState } from "react";
import variableCategories from "../config/variableCategories";
import VariableSet from "./VariableSet";
import DropdownMenu from "./DropdownMenu";
import "styles/component.scss";
import kebabIcon from "assets/icons/kebab.svg";

const emptyDefault = {
  type: "string",
  value: "",
};

const Component = ({
  node,
  component,
  collapsed,
  selected,
  children,
  onChange,
  onAddChildClick,
  onDeleteClick,
}) => {
  const [menuTab, setMenuTab] = useState("default");
  const { id, name, variables } = component;
  const isEditing = Boolean(selected);

  function setName(newName) {
    onChange({
      ...component,
      name: newName.replace(/ /g, ""),
    });
  }

  function handleNewVariableSetClick(variableCategory) {
    const { id, name } = variableCategory;
    const newVariableSet = { id, name, items: [] };

    if (variableCategory.id === "custom") {
      newVariableSet.name = prompt("Enter your variable set name");
      newVariableSet.id = newVariableSet.name.toLowerCase().replace(/ /g, "-");
    }

    const variables = [...component.variables, { ...newVariableSet }].sort(
      sortVariableSet
    );

    onChange({
      ...component,
      variables,
    });
  }

  function handleNewVariableClick(variableSetId) {
    const defaultObject = {
      ...emptyDefault,
      ...variableCategories[variableSetId]?.default,
    };
    const items = variables.find(
      (variableSet) => variableSet.id === variableSetId
    )?.items;

    onChange({
      ...component,
      variables: variables.map((variableSet) => {
        if (variableSet.id === variableSetId) {
          return {
            ...variableSet,
            items: [...items, defaultObject],
          };
        }
        return variableSet;
      }),
    });
  }

  function sortVariableSet(setA, setB) {
    const weightA = variableCategories.findIndex((cat) => cat.id === setA.id);
    const weightB = variableCategories.findIndex((cat) => cat.id === setB.id);

    if (weightA === -1) {
      return 1;
    }

    if (weightB === -1) {
      return -1;
    }

    return weightA - weightB;
  }

  function handleVariableChange(variableSetId, index, variable) {
    const items = variables.find(
      (variableSet) => variableSet.id === variableSetId
    )?.items;

    onChange({
      ...component,
      variables: variables.map((variableSet) => {
        if (variableSet.id === variableSetId) {
          return {
            ...variableSet,
            items: items.map((item, i) => {
              if (index === i) {
                return { ...item, ...variable };
              }
              return item;
            }),
          };
        }
        return variableSet;
      }),
    });
  }

  function handleVariableRemove(variableSetId, index) {
    const items = variables.find(
      (variableSet) => variableSet.id === variableSetId
    )?.items;
    onChange({
      ...component,
      variables: variables.map((variableSet) => {
        if (variableSet.id === variableSetId) {
          return {
            ...variableSet,
            items: items.filter((item, i) => i !== index),
          };
        }
        return variableSet;
      }),
    });
  }

  function shouldShowDropdownOption(option) {
    const used = variables.findIndex(
      (variableSet) => variableSet.id === option.id
    );

    return used === -1 || option.id === "custom";
  }

  function handleVariableSetRemove(variableSet) {
    const { id } = variableSet;
    const variables = component.variables
      .filter((check) => check.id !== id)
      .sort(sortVariableSet);

    onChange({
      ...component,
      variables,
    });
  }

  return (
    <div className={`component ${selected ? "selected" : ""}`} data-id={id}>
      <div className="flex align-center">
        <div className="name">
          <input
            value={name}
            type="text"
            onChange={(e) => setName(e.target.value)}
          />
          <span className="name-hidden">{name}</span>
        </div>
        <div className="flex-fill"></div>
        <div className="dropdown-container">
          {selected && (
            <DropdownMenu
              buttonIcon={kebabIcon}
              onClose={() => setMenuTab("default")}
            >
              {menuTab === "default" && (
                <>
                  <button
                    keepMenuOpen
                    onClick={() => setMenuTab("addVariableSet")}
                  >
                    Add Variable Set
                  </button>
                  <button key="a" onClick={() => onAddChildClick(node)}>
                    Add Child
                  </button>
                  <button key="b" onClick={() => onDeleteClick(node)}>
                    Delete
                  </button>
                </>
              )}
              {menuTab === "addVariableSet" && (
                <>
                  <button keepMenuOpen onClick={() => setMenuTab("default")}>
                    Back
                  </button>
                  {variableCategories.map(
                    (option) =>
                      shouldShowDropdownOption(option) && (
                        <button
                          key={option.id}
                          onClick={() => handleNewVariableSetClick(option)}
                        >
                          {option.name}
                        </button>
                      )
                  )}
                </>
              )}
            </DropdownMenu>
          )}
        </div>
      </div>

      {!collapsed && (
        <>
          {variables.map((variableSet) => (
            <VariableSet
              key={variableSet.id}
              isEditing={isEditing}
              variableSet={variableSet}
              onNewVariableClick={handleNewVariableClick}
              onVariableChange={handleVariableChange}
              onRemoveVariableClick={handleVariableRemove}
              onRemoveVariableSetClick={handleVariableSetRemove}
            />
          ))}
          {children}
        </>
      )}
    </div>
  );
};

export default Component;
