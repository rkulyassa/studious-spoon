"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { listFiles, uploadFile } from "@/actions";
import { UploadedFile } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function Page() {
  const [loaded, setLoaded] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    (async () => {
      const data = await listFiles();
      setFiles(data);
      setLoaded(true);
    })();
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // console.log(acceptedFiles);
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append("file", file);
      await uploadFile(formData);
    }
    // setFiles((prevFiles) => [...prevFiles, ...acceptedFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".jpeg", ".gif"],
    },
    maxSize: 5 * 1024 * 1024,
  });

  return (
    <div className="flex flex-col items-center justify-start min-h-screen p-10">
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

      <div className="mt-6 w-3/4 max-w-lg">
        <h2 className="text-lg font-semibold mb-2">Uploaded Files</h2>
        {!loaded ? (
          [...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-14 mb-2" />
          ))
        ) : files.length > 0 ? (
          <ul>
            {files.map((file, i) => (
              <li
                key={i}
                className="border h-14 p-4 rounded-md bg-gray-50 mb-2 text-sm"
              >
                {file.key} - {(file.size / 1024 / 1024).toFixed(2)} MB
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
