import { useState } from "react";
import { useQuery } from "react-query";
import { IssueItem } from "./IssueItem";
import fetchWithError from "../helpers/fetchWithError";

export default function IssuesList({ labels, status }) {
  const [searchValue, setSearchValue] = useState("");

  const issuesQuery = useQuery(
    ["issues", { labels, status }],
    () => {
      const statusString = status ? `&status=${status}` : "";
      const labelsString = labels.map((label) => `labels[]=${label}`).join("&");

      return fetchWithError(`/api/issues?${labelsString}${statusString}`);
    },
    {
      staleTime: 1000 * 60,
    }
  );

  const searchQuery = useQuery(
    ["issues", "search", searchValue],
    () =>
      fetch(`/api/search/issues?q=${searchValue}`).then((res) => res.json()),
    {
      enabled: searchValue.length > 0,
    }
  );

  const onSubmit = (event) => {
    event.preventDefault();
    setSearchValue(event.target.search.value);
  };

  const onChange = (event) => {
    setSearchValue(event.target.value.length === 0 && "");
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>Search Issues</label>
        <input
          id="search"
          name="search"
          placeholder="Search"
          type="search"
          onChange={onChange}
        />
      </form>
      <h2>Issues List</h2>
      {issuesQuery.isLoading ? (
        <p>Loading...</p>
      ) : issuesQuery.isError ? (
        <p>{issuesQuery.error.message}</p>
      ) : searchQuery.fetchStatus === "idle" &&
        searchQuery.isLoading === true ? (
        <ul className="issues-list">
          {issuesQuery.data.map((issue) => (
            <IssueItem
              key={issue.id}
              {...issue}
              assignee={issue.assignee}
              commentCount={issue.comments.length}
              createdBy={issue.createdBy}
              createdDate={issue.createdDate}
              labels={issue.labels}
              number={issue.number}
              status={issue.status}
              title={issue.title}
            />
          ))}
        </ul>
      ) : (
        <>
          <h2>Search Results</h2>
          {searchQuery.isLoading ? (
            <p>Loading...</p>
          ) : (
            <>
              <p>{searchQuery.data.count} Results</p>
              <ul className="issues-list">
                {searchQuery.data.items.map((issue) => (
                  <IssueItem
                    key={issue.id}
                    {...issue}
                    assignee={issue.assignee}
                    commentCount={issue.comments.length}
                    createdBy={issue.createdBy}
                    createdDate={issue.createdDate}
                    labels={issue.labels}
                    number={issue.number}
                    status={issue.status}
                    title={issue.title}
                  />
                ))}
              </ul>
            </>
          )}
        </>
      )}
    </div>
  );
}
