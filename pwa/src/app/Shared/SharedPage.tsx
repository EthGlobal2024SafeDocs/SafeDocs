import { useRouteContext, Link, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { Card } from "flowbite-react";

import { DocumentTypes, DriversLicenseType, getSharedDocument, ImageType } from "@/services/document";
import { AwardIcon, BackIcon } from "@/assets/Iconds";
import { DriversLicenseDisplay } from "../Documents/Operations/DriversLicenseDisplay";
import { ImageDisplay } from "../Documents/Operations/ImageDisplay";

export function SharedPage() {
  const context = useRouteContext({ from: "__root__" });
  const { attestationId } = useParams({ from: "/_auth/shared/$attestationId" });

  const { isPending, isError, data, error } = useQuery({
    queryKey: ["shared-document", attestationId],
    queryFn: async () => await getSharedDocument(context, attestationId),
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
        <Link to="/shared">
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
        {data?.document_type === DocumentTypes.DriversLicense && (
          <DriversLicenseDisplay payload={data.payload as DriversLicenseType} />
        )}
        {data?.document_type === DocumentTypes.Image && (
          <ImageDisplay payload={data.payload as ImageType} />
        )}
      </Card>
    </div>
  );
}
