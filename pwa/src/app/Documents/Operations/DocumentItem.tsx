import { Card } from "flowbite-react";
import { Link } from "@tanstack/react-router";
import { Document, DocumentTypes, DriversLicenseType, ImageType } from "@/services/document";

import { AwardIcon } from "@/assets/Iconds";
import { HexToBase64 } from "@/services/crypto";

function isDriverLicense(payload: DriversLicenseType | ImageType): payload is DriversLicenseType {
  return (payload as DriversLicenseType).fullName != undefined;
}

function isImage(payload: DriversLicenseType | ImageType): payload is ImageType {
  return (payload as ImageType).imageHex != undefined;
}

export const DocumentItem = ({ _id, payload }: Document<DriversLicenseType | ImageType>) => {
  return (
    <Link to="/documents/$documentId" params={{ documentId: _id }}>
      <Card href="#" className="max-w-sm">
        <p className="flex flex-col text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          {isDriverLicense(payload) && (
            <>
              <span className="flex place-items-center text-xs pb-1">
                <AwardIcon /> Drivers License
              </span>
              <div className="flex flex-col">
                <span className="capitalize">{payload.fullName}</span>
                <span>{payload.licenseNumber}</span>
              </div>
            </>
          )}

          {isImage(payload) && (
            <>
              <span className="flex place-items-center text-xs pb-1">
                <AwardIcon /> Image
              </span>
              <div>
                <img src={`data:${payload.contentType};base64,${HexToBase64(payload.imageHex)}`} className="rounded "/>
              </div>
            </>
          )}
        </p>
      </Card>
    </Link>
  );
};
