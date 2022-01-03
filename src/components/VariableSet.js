import Variable from "./Variable";
import "styles/variableSet.scss";

const VariableSet = ({
  variableSet,
  isEditing,
  onNewVariableClick,
  onRemoveVariableSetClick,
  onVariableChange,
  onRemoveVariableClick,
}) => {
  const { id, name, items } = variableSet;

  return (
    <div className="variable-set">
      <div className="flex align-center">
        <h3 className="flex-fill">{name}</h3>
        <div>
          {isEditing && (
            <button
              className="button remove"
              onClick={() => onRemoveVariableSetClick(variableSet)}
            >
              x
            </button>
          )}
        </div>
      </div>
      <div>
        {items.map((variable, i) =>
          isEditing ? (
            <Variable
              key={i}
              type={variable.type}
              value={variable.value}
              onChange={(val) => onVariableChange(id, i, val)}
              onRemove={() => {
                onRemoveVariableClick(id, i);
              }}
            />
          ) : (
            variable.value && (
              <div className="variable flex">
                <div className={`variable-type ${variable.type}`}>
                  {variable.type}
                </div>
                <div className="variable-value">{variable.value}</div>
              </div>
            )
          )
        )}
        {isEditing && (
          <div className="add-variable">
            <button className="button " onClick={() => onNewVariableClick(id)}>
              Add {name}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VariableSet;
