import { useRouteContext, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Route } from "@/routes/_auth/documents/$documentId";

import { useState } from "react";
import { Document, DocumentTypes, DriversLicenseType, getDocument, ImageType } from "@/services/document";
import { DriversLicenseDisplay } from "./Operations/DriversLicenseDisplay";
import { BackIcon } from "@/assets/Iconds";
import { DocumentShareForm } from "./Operations/DocumentShareForm";
import { ImageDisplay } from "./Operations/ImageDisplay";

export function DocumentPage() {
  const context = useRouteContext({ from: "__root__" });
  const { documentId } = Route.useParams();
  const [shareOpen, setShareOpen] = useState(false);

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["document", documentId],
    queryFn: async () => getDocument(context, documentId),
  });

  if (isPending) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (isError) {
    console.log(error);
    // throw redirect({ to: "/documents" });
  }

  // Assume data is good
  return (
    <div>
      <div className="mb-4 flex items-center py-2">
        <Link to="/documents">
          <BackIcon />
        </Link>
        <h3 className="text-xl">Document Details</h3>
      </div>
      {data?.document_type === DocumentTypes.DriversLicense && (
        <DriversLicenseDisplay payload={data.payload as DriversLicenseType} onShareClicked={() => setShareOpen(true)} />
      )}
      {data?.document_type === DocumentTypes.Image && (
        <ImageDisplay payload={data.payload as ImageType} onShareClicked={() => setShareOpen(true)} />
      )}
      <DocumentShareForm documentId={documentId} shareOpen={shareOpen} setShareOpen={setShareOpen} />
    </div>
  );
}
