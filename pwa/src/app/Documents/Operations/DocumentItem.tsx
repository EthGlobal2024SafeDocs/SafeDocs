import { Card } from "flowbite-react";
import { Link } from "@tanstack/react-router";
import { Document, DocumentTypes, DriversLicenseType } from "@/services/document";

import { AwardIcon } from "@/assets/Iconds";

export const DocumentItem = ({ _id, document_type, payload }: Document<DriversLicenseType>) => {
  return (
    <Link to="/documents/$documentId" params={{ documentId: _id }}>
      <Card href="#" className="max-w-sm">
        <p className="flex flex-col text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          {document_type === DocumentTypes.DriversLicense && (
            <span className="flex place-items-center gap-1 text-xs">
              <AwardIcon /> Drivers License
            </span>
          )}
          {(payload && (
            <>
              <span className="capitalize">{payload.fullName}</span>
              <span>{payload.licenseNumber}</span>
            </>
          )) || <p className="mx-auto pt-2 text-base">Issues Decrypting Document Information!</p>}
        </p>
      </Card>
    </Link>
  );
};
