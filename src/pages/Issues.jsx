import { useState } from "react";
import IssuesList from "../components/IssuesList";
import LabelList from "../components/LabelList";
export default function Issues() {
  const [labels, setLabels] = useState([]);

  const onToggle = (label) => {
    setLabels((currentLabels) =>
      currentLabels.includes(label)
        ? currentLabels.filter((currentLabel) => currentLabel !== label)
        : currentLabels.concat(label)
    );
  };

  return (
    <div>
      <main>
        <section>
          <h1>Issues</h1>
          <IssuesList labels={labels} />
        </section>
        <aside>
          <LabelList selected={labels} toggle={onToggle} />
        </aside>
      </main>
    </div>
  );
}
