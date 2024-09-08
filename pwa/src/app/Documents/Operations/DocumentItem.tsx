import { Card } from "flowbite-react";
import { Link } from "@tanstack/react-router";
import { DocumentTypes } from "@/services/document";
import { DriversLicenseType } from "./DriversLicenseForm";
import { AwardIcon } from "@/assets/Iconds";

export const DocumentItem = ({
  id,
  type,
  payload,
}: {
  id: string;
  type: DocumentTypes;
  payload: DriversLicenseType;
}) => {
  return (
    <Link to="/documents/$documentId" params={{ documentId: id }}>
      <Card href="#" className="max-w-sm">
        <p className="flex flex-col text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          {type === DocumentTypes.DriversLicense && (
            <span className="flex place-items-center gap-1 text-xs">
              <AwardIcon /> Drivers License
            </span>
          )}

          <span className="capitalize">{payload.fullName}</span>
          <span>{payload.licenseNumber}</span>
        </p>
      </Card>
    </Link>
  );
};
