import { useEffect, useState } from "react";

function CallServerSide() {
  const [someText, setData] = useState("");

  useEffect(() => {
    fetch("api/something")
      .then((res) => res.text())
      .then((data) => JSON.parse(data))
      .then((data) => setData(data.message));
  });

  return someText;
}

export default CallServerSide;
