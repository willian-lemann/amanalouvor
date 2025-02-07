"use client";

import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { uploadFile } from "@/actions/file-actions";
import { startTransition, useActionState, useEffect } from "react";
import { Loading } from "./loading";

export function UploadButton() {
  const [state, action, isPending] = useActionState(uploadFile, {
    error: "",
    success: true,
  });

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

  if (isPending) {
    if (typeof window !== "undefined") {
      document.body.style.overflow = "hidden";
    }

    return (
      <div className="bg-black/50 flex flex-col gap-4 items-center justify-center fixed top-[64px] left-0 right-0 bottom-0 z-20 overflow-hidden overscroll-contain">
        <Loading color="black" size={10} />

        <span className="text-2xl ml-2 text-white z-50 overflow-hidden overscroll-contain">
          Adicionando arquivo...
        </span>
      </div>
    );
  }

  if (typeof window !== "undefined") {
    document.body.style.overflow = "auto";
  }

  return (
    <Button
      onClick={handleUpload}
      className="gap-4 fixed md:relative z-50 p-3 md:p-2 bottom-3 md:bottom-0 right-3 md:right-0 shadow-lg bg-primary hover:bg-primary/90 md:min-w-40 rounded-full md:rounded-md w-12 h-12 md:h-auto md:w-auto"
    >
      {isPending ? <Loading color="black" /> : <Upload className="h-6 w-6" />}
      <span className="hidden md:block">Adicionar</span>
    </Button>
  );
}
