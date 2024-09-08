import { Button, FileInput, Spinner } from "flowbite-react";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { createNewImageDocument } from "@/services/document";
import { useNavigate, useRouteContext } from "@tanstack/react-router";

type ImageForm = {
  images: FileList;
};

export function ImageUploadForm() {
  const context = useRouteContext({ from: "__root__" });
  const { register, handleSubmit, reset } = useForm<ImageForm>();
  const [image, setImage] = useState<File | undefined | null>();
  const [preview, setPreview] = useState<string | null>();
  const navigate = useNavigate();

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ["upload-image"],
    mutationFn: async () => {
      const buffer = await image!.arrayBuffer();
      let byteArray = new Int8Array(buffer);
      return await createNewImageDocument(context, byteArray, image?.type!);
    },
  });

  const onSubmit: SubmitHandler<ImageForm> = async (data) => {
    await mutateAsync();
    navigate({ to: "/documents" });
  };

  const handleOnChange = (files?: FileList | null) => {
    if (files == undefined || files == null || files.length <= 0) {
      setPreview(null);
      return;
    }
    const file = files.item(0);

    setImage(file);
    const urlImage = URL.createObjectURL(file!);
    console.log(urlImage);
    setPreview(urlImage);
  };

  useEffect(() => {}, [image]);

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-2">
        <FileInput
          {...register("images")}
          accept="image/*"
          helperText="SVG, PNG, JPG or GIF"
          onChange={(e) => handleOnChange(e.currentTarget.files)}
        />
        {preview && <img src={preview} alt="Preview Uploaded Image" id="file-preview" />}
        <div className="flex gap-2">
          <Button type="submit" disabled={!image}>
            Upload {isPending && <Spinner className="ml-2" />}
          </Button>
          <Button
            onClick={() => {
              setImage(null);
              setPreview(null);
              reset();
            }}
          >
            clear
          </Button>
        </div>
      </form>
    </div>
  );
}
