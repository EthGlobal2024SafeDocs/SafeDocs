import { AwardIcon } from "@/assets/Iconds";
import { Document, DriversLicenseType } from "@/services/document";
import { Button, Card } from "flowbite-react";

type Props = {
  payload: DriversLicenseType;
  onShareClicked?: (val: boolean) => void;
};

export function DriversLicenseDisplay({ payload, onShareClicked }: Props) {
  const { fullName, licenseNumber, cardNumber, expiryDate } = payload;
  return (
    <Card className="max-w-lg">
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <span className="flex place-items-center gap-1 text-xs">
          <AwardIcon /> Drivers License
        </span>

        {/* {data?.document_type === DocumentTypes.Image && (
          <span className="flex place-items-center gap-1 text-xs">
            <AwardIcon /> Image
          </span>
        )} */}
      </h5>
      {payload && (
        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2 flex gap-x-2">
              <span className="font-bold">Full Name:</span>
              <span className="capitalize">{fullName}</span>
            </div>
            <div className="mb-2 flex gap-x-2">
              <span className="font-bold">License Number:</span>
              <span className="capitalize">{licenseNumber}</span>
            </div>
            <div className="mb-2 flex gap-x-2">
              <span className="font-bold">Card Number:</span>
              <span className="capitalize">{cardNumber}</span>
            </div>
            <div className="mb-2 flex gap-x-2">
              <span className="font-bold">Expiry:</span>
              <span className="capitalize">{expiryDate}</span>
            </div>
          </div>
        </div>
      )}

      {payload && onShareClicked && (
        <Button color="blue" onClick={() => onShareClicked(true)}>
          Share
        </Button>
      )}
    </Card>
  );
}
