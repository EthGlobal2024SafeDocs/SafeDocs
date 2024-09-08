import { Select } from "flowbite-react";
import { Helmet } from "react-helmet";
import { DriversLicenseForm } from "./Operations/DriversLicenseForm";
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { DocumentTypes } from "@/services/document";
import { BackIcon } from "@/assets/Iconds";

export default function NewDocumentPage() {
  const [formType, setForm] = useState<DocumentTypes | undefined>(undefined);

  const handleDocumentTypeSelected = (e: React.SyntheticEvent<HTMLSelectElement, Event>) => {
    const value = e.currentTarget.value as DocumentTypes;

    setForm(value);
  };

  return (
    <>
      <Helmet>
        <title>New Document</title>
      </Helmet>
      <div className="mx-auto max-w-md">
        <div className="mb-4 flex items-center border-b border-b-orange-400 py-2">
          <Link to="/documents">
            <BackIcon />
          </Link>

          <h3 className="text-xl">Add a new document</h3>
        </div>

        <div className="mb-2 rounded bg-slate-300 p-2">
          <label>Document Type</label>
          <Select id="type" className="mt-2" onChange={handleDocumentTypeSelected} value={formType} required>
            <option></option>
            <option value="DriversLicense">Driver's License</option>
          </Select>
        </div>
        {formType === DocumentTypes.DriversLicense && <DriversLicenseForm />}
      </div>
    </>
  );
}
