import { createFileRoute } from "@tanstack/react-router";
import { MediaLibrary } from "../../components/admin/media-library";

export const Route = createFileRoute("/_authenticated/admin/media")({ component: MediaPage });

function MediaPage() {
  return (
    <div>
      <h1 className="mb-5 text-2xl font-extrabold md:text-3xl" style={{ fontFamily: "var(--font-display)" }}>Media</h1>
      <MediaLibrary />
    </div>
  );
}
