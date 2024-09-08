import { useRouteContext, redirect, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Route } from "@/routes/_auth/documents/$documentId";
import { Card, Button, Modal } from "flowbite-react";

import { useState } from "react";
import { DocumentTypes, getDocument } from "@/services/document";
import { DriversLicenseDisplay } from "./Operations/DriversLicenseDisplay";
import { AwardIcon, BackIcon } from "@/assets/Iconds";
import { DocumentShareForm } from "./Operations/DocumentShareForm";

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
      <Card className="max-w-lg">
        <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {data?.document_type === DocumentTypes.DriversLicense && (
            <span className="flex place-items-center gap-1 text-xs">
              <AwardIcon /> Drivers License
            </span>
          )}
        </h5>
        {data && <DriversLicenseDisplay {...data.payload} />}
        <Button color="blue" onClick={() => setShareOpen(true)}>
          Share
        </Button>
      </Card>

      <DocumentShareForm documentId={documentId} shareOpen={shareOpen} setShareOpen={setShareOpen} />
    </div>
  );
}
