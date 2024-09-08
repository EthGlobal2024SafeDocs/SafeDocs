import { createNewDocument, DocumentTypes } from "@/services/document";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useRouteContext } from "@tanstack/react-router";
import { Button, Label, TextInput } from "flowbite-react";
import { SubmitHandler, useForm } from "react-hook-form";

export type DriversLicenseType = {
  fullName: string;
  licenseNumber: string;
  cardNumber: string;
  expiryDate: string;
};

export function DriversLicenseForm() {
  const { register, handleSubmit } = useForm<DriversLicenseType>();
  const context = useRouteContext({ from: "__root__" });
  const navigate = useNavigate();

  const { mutateAsync } = useMutation({
    mutationKey: ["new-document"],
    mutationFn: async (data: DriversLicenseType) => {
      return await createNewDocument(
        context,
        DocumentTypes.DriversLicense,
        JSON.stringify(data)
      );
    }
  });

  const onSubmit: SubmitHandler<DriversLicenseType> = async (data) => {
    await mutateAsync(data);
    navigate({ to: "/documents" });
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <div>
          <div className="mb-2 block">
            <Label htmlFor="fullName" value="Full Name" />
          </div>
          <TextInput
            {...register("fullName")}
            placeholder="Full Name"
            required
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="licenseNumber" value="License Number" />
          </div>
          <TextInput
            {...register("licenseNumber")}
            placeholder="License Number"
            required
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="cardNumber" value="Card Number" />
          </div>
          <TextInput
            {...register("cardNumber")}
            placeholder="Card Number (optional)"
          />
        </div>

        <div>
          <div className="mb-2 block">
            <Label htmlFor="expiryDate" value="Expiry Date" />
          </div>
          <TextInput
            {...register("expiryDate")}
            placeholder="Expiry Date"
            required
          />
        </div>
        <Button type="submit">Add Document</Button>
      </form>
    </div>
  );
}
