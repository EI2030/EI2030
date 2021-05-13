const WORKING_GROUP_PAGE_TYPE = "WorkingGroupPage";

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions;

  const typeDefs = [
    `
	    type WorkingGroup implements Node {
		    workingGroupPages: [WorkingGroupPage] @link(by: "workingGroup.id" from: "id")
	    }
	`,
    `
		type MarkdownRemark implements Node
	`,
    `
		type File implements Node {
			workingGroup: WorkingGroup @link(by: "name", from: "sourceInstanceName")
		}
    `,
    `
		type ${WORKING_GROUP_PAGE_TYPE} implements Node {
			markdownRemark: MarkdownRemark @link
			file: File @link
			workingGroup: WorkingGroup @link
		}
	`,
  ];

  createTypes(typeDefs);
};

exports.onCreateNode = ({
  node,
  actions,
  getNode,
  getNodesByType,
  createNodeId,
  createContentDigest,
}) => {
  const { createNode } = actions;

  if (node.internal.type === "MarkdownRemark") {
    const parentFileNode = getNode(node.parent);
    const workingGroup = getNodesByType("WorkingGroup").find(
      ({ name }) => name === parentFileNode.sourceInstanceName
    );
    if (workingGroup) {
      const workingGroupPage = {
        workingGroup: workingGroup.id,
        markdownRemark: node.id,
        file: parentFileNode.id,
        // these are placed on the WorkingGroupPage so that the File System Route API can use them.
        // Currently there is no support for using graphql relations, just raw node data.  Therefore
        // we have to dupe the data here.
        fileName: parentFileNode.name,
        workingGroupName: workingGroup.name,
      };

      createNode({
        id: createNodeId(`${WORKING_GROUP_PAGE_TYPE}-${node.id}`),
        ...workingGroupPage,
        parent: null,
        children: [],
        internal: {
          type: WORKING_GROUP_PAGE_TYPE,
          contentDigest: createContentDigest(node),
        },
      });
    }
  }
};
