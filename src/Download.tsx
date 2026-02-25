import DownloadCard from "./components/DownloadCard";
import { useParams } from "react-router";

export default function Download() {
  const { hash } = useParams();

  return (
    <div className="container mx-auto">
      <div className="w-100 mx-auto">
        <DownloadCard hash={hash} />
      </div>
    </div>
  );
}
