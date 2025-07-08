import { GoIssueClosed, GoIssueOpened, GoComment } from "react-icons/go";
import { Link } from "react-router-dom";
import { relativeDate } from "../helpers/relativeDate";
import { useUserData } from "../helpers/useUserData";

export const IssueItem = ({
  assignee,
  commentCount,
  createdBy,
  createdDate,
  labels,
  number,
  status,
  title,
}) => {
  const assigneeUser = useUserData(assignee);
  const createdByUser = useUserData(createdBy);

  return (
    <li>
      <div>
        {status === "done" || status === "cancelled" ? (
          <GoIssueClosed style={{ color: "red" }} />
        ) : (
          <GoIssueOpened style={{ color: "green" }} />
        )}
      </div>
      <div className="issue-content">
        <span>
          <Link to={`/issues/${number}`}>{title}</Link>
          {labels.map((label) => (
            <span key={label} className={`label red`}>
              {label}
            </span>
          ))}
        </span>
        <small>
          # {number} opened {relativeDate(createdDate)}{" "}
          {createdByUser.isSuccess && `by ${createdByUser.data?.name}`}
        </small>
      </div>
      {assignee && (
        <img
          alt={`Assigned to ${
            assigneeUser.isSuccess ? assigneeUser.data.name : "avatar"
          }`}
          className="assigned-to"
          src={assigneeUser.isSuccess && assigneeUser.data.profilePictureUrl}
        />
      )}
      <span className="comment-count">
        {commentCount > 0 && (
          <>
            <GoComment />
            {commentCount}
          </>
        )}
      </span>
    </li>
  );
};
