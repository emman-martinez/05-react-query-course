import { useState } from "react";
import IssuesList from "../components/IssuesList";
import LabelList from "../components/LabelList";
import { StatusSelect } from "../components/StatusSelect";
import { Link } from "react-router-dom";

export default function Issues() {
  const [labels, setLabels] = useState([]);
  const [status, setStatus] = useState("");
  const [pageNum, setPageNum] = useState(1);

  const onToggle = (label) => {
    setLabels((currentLabels) =>
      currentLabels.includes(label)
        ? currentLabels.filter((currentLabel) => currentLabel !== label)
        : currentLabels.concat(label)
    );
    setPageNum(1);
  };

  const onChangeStatus = (event) => {
    setStatus(event.target.value);
    setPageNum(1);
  };

  return (
    <div>
      <main>
        <section>
          <h1>Issues</h1>
          <IssuesList
            labels={labels}
            pageNum={pageNum}
            status={status}
            setPageNum={setPageNum}
          />
        </section>
        <aside>
          <LabelList selected={labels} toggle={onToggle} />
          <h3>Status</h3>
          <StatusSelect onChange={onChangeStatus} value={status} />
          <hr />
          <Link className="button" to="/add">
            Add Issue
          </Link>
        </aside>
      </main>
    </div>
  );
}
