import { GoIssueClosed, GoIssueOpened, GoComment } from "react-icons/go";
import { Link } from "react-router-dom";
import { relativeDate } from "../helpers/relativeDate";

export const IssueItem = ({
  assignee,
  commentCount,
  createdBy,
  createdDate,
  labels,
  number,
  status,
  title,
}) => (
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
        # {number} opened {relativeDate(createdDate)} by {createdBy}
      </small>
    </div>
    {assignee && <div>{assignee}</div>}
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
