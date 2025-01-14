"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createClient } from "@/utils/supabase/client";
import { uploadFile } from "@/actions/file-actions";
import { startTransition, useActionState, useEffect } from "react";

export function UploadButton() {
  const [state, action, isPending] = useActionState(uploadFile, {
    error: "",
    success: true,
  });

  console.log(state);

  const handleUpload = () => {
    // Here you would implement the upload functionality
    // This could open a file picker and handle the file upload
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        startTransition(async () => {
          action(file);
        });
      }
    };
    input.click();
  };

  useEffect(() => {
    async function handlePaste(event: ClipboardEvent) {
      const items = event.clipboardData?.items;

      if (items) {
        for (let i = 0; i < items.length; i++) {
          const item = items[i];

          if (item.kind === "file" && item.type.startsWith("image/")) {
            const file = item.getAsFile();

            if (file) {
              startTransition(async () => {
                action(file);
              });
            }
          }
        }
      }
    }

    document.addEventListener("paste", handlePaste);

    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }, []);

  return (
    <Button
      onClick={handleUpload}
      className="gap-4 fixed md:relative z-50 p-3 md:p-2 bottom-3 md:bottom-0 right-3 md:right-0 shadow-lg bg-primary hover:bg-primary/90 md:min-w-40 rounded-full md:rounded-md w-12 h-12 md:h-auto md:w-auto"
    >
      {isPending ? (
        <div role="status">
          <svg
            aria-hidden="true"
            className="w-5 h-5 animate-spin fill-primary"
            viewBox="0 0 100 101"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
              fill="currentColor"
            />
            <path
              d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
              fill="currentFill"
            />
          </svg>
          <span className="sr-only">Loading...</span>
        </div>
      ) : (
        <Upload className="h-6 w-6" />
      )}
      <span className="hidden md:block">Adicionar</span>
    </Button>
  );
}
