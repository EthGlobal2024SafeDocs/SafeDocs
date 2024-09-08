import { AwardIcon } from "@/assets/Iconds";
import { HexToBase64 } from "@/services/crypto";
import { ImageType } from "@/services/document";
import { Button, Card } from "flowbite-react";

type Props = {
  payload: ImageType;
  onShareClicked?: (val: boolean) => void;
};

export function ImageDisplay({ payload, onShareClicked }: Props) {
  const { contentType, imageHex } = payload;
  return (
    <Card className="max-w-lg" imgSrc={`data:${contentType};base64,${HexToBase64(imageHex)}`}>
      <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
        <span className="flex place-items-center gap-1 text-xs">
          <AwardIcon /> Image
        </span>
      </h5>

      {payload && onShareClicked && (
        <Button color="blue" onClick={() => onShareClicked(true)}>
          Share
        </Button>
      )}
    </Card>
  );
}
