import React, { useState, useEffect } from "react";
import client from "../client.js";
import qs from "qs";

const pageSize = 2;

function Posts({ location }) {
  const [posts, setPosts] = useState({ meta: {}, posts: [] });

  useEffect(() => {
    const page = qs.parse(location.search.split("?")[1]).page || 1;

    const fetchData = async () => {
      try {
        const result = await client.request(query, {
          skip: (page - 1) * pageSize,
          first: pageSize,
        });
        console.log(result);
        setPosts(result);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [location.search]);

  return (
    <div className="Posts">
      {posts.posts.map((item) => (
        <div key={item.id}>
          <h4>{item.title}</h4>
          <p
            dangerouslySetInnerHTML={{
              __html: item.content.substr(0, 100) + "...",
            }}
          ></p>
        </div>
      ))}
    </div>
  );
}

const query = `
query posts($first: IntType!, $skip: IntType!) {
    meta: _allPostsMeta{
        count
    }
    posts: allPosts(orderBy: _createdAt_DESC, first:$first, skip: $skip) {
        id
        title
        content
        createdAt
    }
}
`;

export default Posts;
