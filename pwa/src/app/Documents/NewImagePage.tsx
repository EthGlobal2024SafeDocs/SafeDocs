import { BackIcon } from "@/assets/Iconds";
import { Link } from "@tanstack/react-router";
import { Helmet } from "react-helmet";
import { ImageUploadForm } from "./Operations/ImageUploadForm";

export function NewImagePage() {
  return (
    <>
      <Helmet>
        <title>New Image</title>
      </Helmet>
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex items-center border-b border-b-orange-400 py-2">
          <Link to="/documents">
            <BackIcon />
          </Link>

          <h3 className="text-xl">Add a new image</h3>
        </div>

        <ImageUploadForm />
      </div>
    </>
  );
}
