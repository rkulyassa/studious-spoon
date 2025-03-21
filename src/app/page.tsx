"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import {
  deleteFile,
  getPresignedDownloadUrl,
  listFiles,
  uploadFile,
} from "@/actions";
import { UploadedFile } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import {
  TrashIcon,
  DownloadIcon,
  CalendarArrowUpIcon,
  HardDriveIcon,
} from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Courier_Prime } from "next/font/google";

const courier_prime = Courier_Prime({
  weight: "400",
  subsets: ["latin"],
});

export default function Page() {
  const [loaded, setLoaded] = useState(false);
  // const [loaded, setLoaded] = useState(true);
  const [files, setFiles] = useState<UploadedFile[]>([]);
  // const [files, setFiles] = useState<UploadedFile[]>([
  //   {
  //     key: "sample file.png",
  //     size: 1024,
  //     uploaded: new Date(Date.now()),
  //   },
  //   {
  //     key: "another file.png",
  //     size: 48548,
  //     uploaded: new Date(Date.now() - 10000),
  //   },
  // ]);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      await uploadFile(formData);

      setFiles((prevFiles) => [
        ...prevFiles,
        {
          key: file.name,
          size: file.size,
          uploaded: new Date(file.lastModified),
        },
      ]);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxSize: 5 * 1024 * 1024,
  });

  useEffect(() => {
    (async () => {
      setFiles(await listFiles());
      setLoaded(true);
    })();
  }, []);

  const handleDownload = async (objectKey: string) => {
    const url = await getPresignedDownloadUrl(objectKey);
    window.open(url, "_blank");
  };

  const handleDelete = async (objectKey: string) => {
    await deleteFile(objectKey);
    setFiles((prevFiles) => prevFiles.filter((file) => file.key !== objectKey));
  };

  return (
    <div className="flex flex-col items-center justify-start space-y-6 min-h-screen p-10">
      <div
        {...getRootProps()}
        className="border border-dashed border-gray-300 p-6 rounded-md text-center cursor-pointer hover:border-gray-600 transition w-3/4 max-w-lg"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <span className="text-gray-600 text-sm">Drop the files here ...</span>
        ) : (
          <span className="text-gray-600 text-sm">
            Drag & drop some files here, or click to select files
          </span>
        )}
      </div>

      <div className="w-3/4 max-w-lg">
        <h2 className="text-lg font-semibold mb-2">Uploaded Files</h2>
        {!loaded ? (
          [...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 mb-2" />
          ))
        ) : files.length > 0 ? (
          <ul className="flex flex-col space-y-2">
            {files.map((file, i) => (
              <li
                key={i}
                className="border p-4 rounded-md bg-gray-50 text-sm flex flex-col space-y-2"
              >
                <div className="flex justify-between items-center">
                  <div className="flex flex-col pl-1">
                    <span className="text-base font-semibold pb-0.5">
                      {file.key}
                    </span>
                    <div className="flex space-x-1">
                      <CalendarArrowUpIcon size={14} color="gray" />
                      <span className="text-xs text-muted-foreground">
                        {file.uploaded.toISOString()}
                      </span>
                    </div>
                    <div className="flex space-x-1">
                      <HardDriveIcon size={14} color="gray" />
                      <span className="text-xs text-muted-foreground">
                        {/* {(file.size / 1024 / 1024).toFixed(2)} MB */}
                        {file.size} B
                      </span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleDownload(file.key)}
                    >
                      <DownloadIcon />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      className="cursor-pointer"
                      onClick={() => handleDelete(file.key)}
                    >
                      <TrashIcon />
                    </Button>
                  </div>
                </div>

                <ScrollArea
                  className={`${courier_prime.className} h-20 border rounded-md bg-white p-2 text-xs text-muted-foreground`}
                >
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation ullamco
                  laboris nisi ut aliquip ex ea commodo consequat. Duis aute
                  irure dolor in reprehenderit in voluptate velit esse cillum
                  dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                  cupidatat non proident, sunt in culpa qui officia deserunt
                  mollit anim id est laborum.
                </ScrollArea>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
