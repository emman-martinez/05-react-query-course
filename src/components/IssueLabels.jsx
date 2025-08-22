import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";
import { GoGear } from "react-icons/go";
import { useLabelsData } from "../helpers/useLabelsData";

export default function IssueLabels({ issueNumber, labels }) {
  const labelsQuery = useLabelsData();
  const [menuOpen, setMenuOpen] = useState(false);

  const queryClient = useQueryClient();

  const setLabels = useMutation(
    (labelId) => {
      const newLabels = labels.includes(labelId)
        ? labels.filter((currentLabel) => currentLabel !== labelId)
        : [...labels, labelId];

      return fetch(`/api/issues/${issueNumber}`, {
        method: "PUT",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({ labels: newLabels }),
      }).then((res) => res.json());
    },
    {
      onMutate: (labelId) => {
        const oldLabels = queryClient.getQueryData([
          "issues",
          issueNumber,
        ]).labels;

        const newLabels = oldLabels.includes(labelId)
          ? oldLabels.filter((label) => label !== labelId)
          : [...oldLabels, labelId];

        queryClient.setQueryData(["issues", issueNumber], (old) => {
          return { ...old, labels: newLabels };
        });

        return function rollback() {
          queryClient.setQueryData(["issues", issueNumber], (old) => {
            const rollbackLabels = oldLabels.includes(labelId)
              ? [...old.labels, labelId]
              : old.labels.filter((label) => label !== labelId);

            return { ...old, labels: rollbackLabels };
          });
        };
      },
      onError: (error, variables, rollback) => {
        if (rollback) rollback();
      },
      onSettled: () => {
        queryClient.invalidateQueries(["issues", issueNumber], { exact: true });
      },
    }
  );

  return (
    <div className="issue-options">
      <div>
        <span>Labels</span>
        {labelsQuery.isLoading
          ? null
          : labels.map((label) => {
              const labelObject = labelsQuery.data.find(
                (queryLabel) => queryLabel.id === label
              );

              if (!labelObject) return null;

              return (
                <span key={label} className={`label ${labelObject.color}`}>
                  {labelObject.name}
                </span>
              );
            })}
      </div>
      <GoGear
        onClick={() => !labelsQuery.isLoading && setMenuOpen((open) => !open)}
      />
      {menuOpen && (
        <div className="picker-menu labels">
          {labelsQuery.data?.map((label) => {
            const selected = labels.includes(label.id);

            return (
              <div
                key={label.id}
                className={selected ? "selected" : ""}
                onClick={() => setLabels.mutate(label.id)}
              >
                <span
                  className="label-dot"
                  style={{ backgroundColor: label.color }}
                ></span>
                {label.name}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
