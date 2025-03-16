"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import { listFiles, uploadFile } from "@/actions";
import { UploadedFile } from "@/types";

export default function Page() {
  const [files, setFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    async function fetchFiles() {
      const data = await listFiles();
      setFiles(data);
    }

    fetchFiles();
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
        className="border-2 border-dashed border-gray-400 p-6 rounded-md text-center cursor-pointer hover:border-gray-600 transition w-3/4 max-w-md"
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>Drag & drop some files here, or click to select files</p>
        )}
      </div>

      <div className="mt-6 w-3/4 max-w-md">
        <h2 className="text-lg font-semibold mb-2">Uploaded Files</h2>
        {files.length > 0 ? (
          <ul className="border p-4 rounded-md bg-gray-100">
            {files.map((file, i) => (
              <li key={i} className="text-sm text-gray-700">
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
