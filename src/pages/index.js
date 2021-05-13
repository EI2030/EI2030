import * as React from "react";
import { Link, StaticQuery, graphql } from "gatsby";

const WorkingGroupList = () => (
  <StaticQuery
    query={graphql`
      {
        allWorkingGroupPage(filter: { file: { name: { eq: "index" } } }) {
          nodes {
            workingGroup {
              name
            }
            path: gatsbyPath(
              filePath: "/groups/{WorkingGroupPage.workingGroupName}/{WorkingGroupPage.fileName}"
            )
          }
        }
      }
    `}
    render={(data) => (
      <ul>
        {data.allWorkingGroupPage.nodes.map(
          ({ workingGroup: { name }, path }) => (
            <li key={name}>
              <Link to={path}>{name}</Link>
            </li>
          )
        )}
      </ul>
    )}
  />
);

// markup
const IndexPage = () => {
  return (
    <main>
      <title>EI2030</title>
      <h1>Working Groups</h1>

      <WorkingGroupList />
    </main>
  );
};

export default IndexPage;
