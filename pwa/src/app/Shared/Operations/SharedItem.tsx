import { Card } from "flowbite-react";
import { Link } from "@tanstack/react-router";
import { Document, DocumentTypes, DriversLicenseType, ImageType, SharedDocument } from "@/services/document";

import { AwardIcon } from "@/assets/Iconds";
import { HexToBase64 } from "@/services/crypto";

function isDriverLicense(payload: DriversLicenseType | ImageType): payload is DriversLicenseType {
  return (payload as DriversLicenseType).fullName != undefined;
}

function isImage(payload: DriversLicenseType | ImageType): payload is ImageType {
  return (payload as ImageType).imageHex != undefined;
}

export const SharedItem = ({ attestation_id, payload }: SharedDocument<DriversLicenseType | ImageType>) => {
  return (
    <Link to="/shared/$attestationId" params={{ attestationId: attestation_id }}>
      <Card href="#" className="max-w-sm">
        <p className="flex flex-col text-lg font-bold tracking-tight text-gray-900 dark:text-white">
          {isDriverLicense(payload) && (
            <>
              <span className="flex place-items-center gap-1 text-xs">
                <AwardIcon /> Drivers License
              </span>
              <div>
                <span className="capitalize">{payload.fullName}</span>
                <span>{payload.licenseNumber}</span>
              </div>
            </>
          )}

          {isImage(payload) && (
            <>
              <span className="flex place-items-center gap-1 text-xs">
                <AwardIcon /> Image
              </span>
              <div>
                <img src={`data:${payload.contentType};base64,${HexToBase64(payload.imageHex)}`} />
              </div>
            </>
          )}
        </p>
      </Card>
    </Link>
  );
};
