import { DriversLicenseType } from "./DriversLicenseForm";

export function DriversLicenseDisplay({ fullName, licenseNumber, cardNumber, expiryDate }: DriversLicenseType) {
  return (
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
  );
}
