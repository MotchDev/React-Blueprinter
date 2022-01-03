const variableCategories = [
  {
    id: "properties",
    name: "Properties",
    default: {
      name: "newProperty",
      type: "string",
    },
  },
  {
    id: "redux",
    name: "Redux",
    default: {
      name: "newUseSelector",
      type: "string",
    },
  },
  {
    id: "localState",
    name: "Local State",
    default: {
      name: "newUseState",
      type: "string",
    },
  },
  {
    id: "consts",
    name: "Consts",
    default: {
      name: "newConst",
      type: "string",
    },
  },
  {
    id: "custom",
    name: "Custom",
    default: {
      name: "",
      type: "string",
    },
  },
];

export default variableCategories;
