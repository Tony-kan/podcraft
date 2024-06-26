import React, { useRef, useState } from "react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { GenerateThumbnailProps } from "@/types";
import { Loader } from "lucide-react";
import { Input } from "./ui/input";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import { useToast } from "./ui/use-toast";

import { useUploadFiles } from "@xixixao/uploadstuff/react";
import { useAction, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

const GenerateThumbnail = ({
  setImage,
  setImageStorageId,
  image,
  imagePrompt,
  setImagePrompt,
}: GenerateThumbnailProps) => {
  const [isAiThumbnail, setIsAiThumbnail] = useState(true);
  const [isImageLoading, setIsImageLoading] = useState(false);
  const { toast } = useToast();

  const generateUploadUrl = useMutation(api.file.generateUploadUrl);

  const { startUpload } = useUploadFiles(generateUploadUrl);

  const getImageUrl = useMutation(api.podcast.getUrl);

  const imageRef = useRef<HTMLInputElement>(null);
  const handleGenerateThumbnail = useAction(api.openai.generateThumbnailAction);

  const handleImage = async (blob: Blob, fileName: string) => {
    setIsImageLoading(true);
    setImage("");
    try {
      const file = new File([blob], fileName, { type: "image/png" });

      const uploaded = await startUpload([file]);
      const storageId = (uploaded[0].response as any).storageId;

      setImageStorageId(storageId);

      const imageUrl = await getImageUrl({ storageId });
      setImage(imageUrl!);
      setIsImageLoading(false);
      toast({
        title: "Thumbnail generated/uploaded Successfully",
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Error generating thumbnail",
        description: `Error description: ${error}`,
        variant: "destructive",
      });
    }
  };

  const generateThumbnail = async () => {
    try {
      const response = await handleGenerateThumbnail({ prompt: imagePrompt });
      const blob = new Blob([response], { type: "image/png" });
      handleImage(blob, `thumbnail-${uuidv4}`);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Generating thumbnail",
        description: `Error description : ${error}`,
        variant: "destructive",
      });
    }
  };

  const uploadeImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    try {
      const files = e.target.files;
      if (!files) return;
      const file = files[0];
      const blob = await file.arrayBuffer().then((ab) => new Blob([ab]));
      handleImage(blob, file.name);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error Uploading thumbnail",
        description: `Error description : ${error}`,
        variant: "destructive",
      });
    }
  };
  return (
    <>
      <div className="generate_thumbnail">
        <Button
          type="button"
          variant="plain"
          className={cn("", { "bg-black-6 text-orange-1 ": isAiThumbnail })}
          onClick={() => setIsAiThumbnail(true)}
        >
          Use AI to generate a thumbnail
        </Button>
        <Button
          type="button"
          variant="plain"
          className={cn("", { "bg-black-6  text-orange-1": !isAiThumbnail })}
          onClick={() => setIsAiThumbnail(false)}
        >
          Upload Custom Image
        </Button>
      </div>
      {isAiThumbnail ? (
        <div>
          <div className="flex flex-col gap-2.5 mt-5">
            <Label className="text-16 font-bold text-white-1">
              AI Prompt to generate Thumbnail
            </Label>
            <Textarea
              className="input-class font-light focus-visible:ring-offset-orange-1"
              placeholder="Provide text to generate podcast Thumbnail"
              rows={5}
              value={imagePrompt}
              onChange={(e) => setImagePrompt(e.target.value)}
            />
          </div>
          <div className="mt-5 w-full max-w-[200px]">
            <Button
              type="submit"
              className="text-16 w-full bg-orange-1 py-4 font-extrabold text-white-1 transition-all duration-500 hover:bg-black-1 hover:border-2 hover:border-orange-1"
              onClick={generateThumbnail}
            >
              {isImageLoading ? (
                <>
                  Generating
                  <Loader size={20} className="animate-spin ml-2" />
                </>
              ) : (
                "Generate Thumbnail"
              )}
            </Button>
          </div>
        </div>
      ) : (
        <div className="image_div" onClick={() => imageRef.current?.click()}>
          <Input
            type="file"
            className="hidden"
            ref={imageRef}
            onChange={(e) => uploadeImage(e)}
          />
          {!isImageLoading ? (
            <Image
              src="/icons/upload-image.svg"
              width={40}
              height={40}
              alt="upload"
            />
          ) : (
            <div className="text-16 flex-center font-medium text-white-1">
              Uploading
              <Loader size={20} className="animate-spin ml-2" />
            </div>
          )}
          <div className="flex flex-col items-center gap-1">
            <h2 className="text-12 font-bold text-orange-1">Click to upload</h2>
            <p className="text-12 font-normal text-gray-1">
              PNG, JPG or GIF (max. 1080x1080px)
            </p>
          </div>
        </div>
      )}
      {image && (
        <Image
          src={image}
          width={200}
          height={200}
          className="mt-5"
          alt="thumbnail"
        />
      )}
    </>
  );
};

export default GenerateThumbnail;
