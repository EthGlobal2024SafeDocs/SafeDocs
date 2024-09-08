import { shareDocument } from "@/services/document";
import { useMutation } from "@tanstack/react-query";
import { useRouteContext } from "@tanstack/react-router";
import { Button, Datepicker, Label, Modal, Spinner, TextInput } from "flowbite-react";
import { SubmitHandler, useForm } from "react-hook-form";

type Props = {
  documentId: string;
  setShareOpen: (value: boolean) => void;
  shareOpen: boolean;
};

type ShareForm = {
  email: string;
  expiry: Date;
};

export function DocumentShareForm({ documentId, setShareOpen, shareOpen }: Props) {
  const context = useRouteContext({ from: "__root__" });
  const { register, handleSubmit, setValue } = useForm<ShareForm>();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["share", documentId],
    mutationFn: async (data: ShareForm) => {
      return await shareDocument(context, documentId, data.email, data.expiry);
    },
    onSuccess: () => {
      setShareOpen(false);
    },
  });

  const onSubmit: SubmitHandler<ShareForm> = async (data) => {
    await mutateAsync(data);
  };

  return (
    <Modal show={shareOpen} onClose={() => setShareOpen(false)}>
      <form id="share-form" onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
        <Modal.Header>Share Document</Modal.Header>
        <Modal.Body>
          <div className="mx-auto max-w-md">
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value="Recipient Email" />
              </div>
              <TextInput {...register("email")} placeholder="email" required />
            </div>
            <div>
              <div className="mb-2 block">
                <Label htmlFor="expiry" value="Valid until" />
              </div>
              <Datepicker onSelectedDateChanged={(e) => setValue("expiry", e)} required inline />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button form="share-form" type="submit" disabled={isPending}>
            Share {isPending && <Spinner />}
          </Button>
          <Button color="gray" onClick={() => setShareOpen(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </form>
    </Modal>
  );
}
