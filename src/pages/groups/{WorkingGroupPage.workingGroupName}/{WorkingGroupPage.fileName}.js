import React from "react";
import { graphql, Link } from "gatsby";
import PropTypes from "prop-types";

function WorkingGroupPage({
  data: {
    workingGroupPage: {
      workingGroup: { workingGroupPages },
      markdownRemark: {
        html,
        frontmatter: { title },
      },
    },
  },
}) {
  const groupIndex = workingGroupPages.find(
    ({ fileName }) => fileName === "index"
  );
  const groupPages = workingGroupPages.filter(
    ({ fileName }) => fileName !== "index"
  );
  return (
    <div>
      <Link to="/">EI2030 Home</Link>
      <h2>
        <Link activeStyle={{ textDecoration: "none" }} to={groupIndex.path}>
          Working Group: {groupIndex.workingGroupName}
        </Link>
      </h2>
      <ul>
        {groupPages.map(
          ({
            markdownRemark: {
              frontmatter: { title },
            },
            path,
            fileName,
          }) => (
            <li
              key={title}
              style={{ display: "inline-block", marginLeft: "1em" }}
            >
              <Link to={path} activeStyle={{ textDecoration: "none" }}>
                {title || fileName}
              </Link>
            </li>
          )
        )}
      </ul>
      <h1>{title}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

WorkingGroupPage.propTypes = {
  data: PropTypes.object,
};

export default WorkingGroupPage;

// This is the page query that connects the data to the actual component. Here you can query for any and all fields
// you need access to within your code. Again, since Gatsby always queries for `id` in the collection, you can use that
// to connect to this GraphQL query
export const query = graphql`
  query($id: String) {
    workingGroupPage(id: { eq: $id }) {
      markdownRemark {
        html
        frontmatter {
          title
        }
      }
      workingGroup {
        workingGroupPages {
          fileName
          path: gatsbyPath(
            filePath: "/groups/{WorkingGroupPage.workingGroupName}/{WorkingGroupPage.fileName}"
          )
          workingGroupName
          markdownRemark {
            frontmatter {
              title
            }
          }
        }
      }
    }
  }
`;
