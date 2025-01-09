"use client";

import { MoreVertical, XIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import {
  KeyboardEvent,
  startTransition,
  useActionState,
  useRef,
  useState,
} from "react";
import { Input } from "./ui/input";
import { createClient } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";
import { deleteFile, updateName } from "@/actions/file-actions";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from "./ui/context-menu";

type ChordSheetItemProps = {
  sheet: { id: number; url: string; name: string };
};

export function ChordSheetItem({ sheet }: ChordSheetItemProps) {
  const [deleteState, deleteAction] = useActionState(deleteFile, {
    error: "",
    success: true,
  });

  const [updateNameState, updateNameAction] = useActionState(updateName, {
    error: "",
    success: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleRename() {
    setIsEditing(true);
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current?.focus();
      }
    }, 100);
  }

  function handleUpdateName() {
    startTransition(async () => {
      const newName = inputRef.current?.value!;

      if (newName) {
        updateNameAction({ id: sheet.id, newName });
      }
    });
  }

  async function handleUpdateNameOnBlur() {
    if (inputRef.current?.value.length === 0) return setIsEditing(false);

    setIsEditing(false);
    handleUpdateName();
  }

  async function handleUpdateNameOnEnter(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      if (inputRef.current?.value.length === 0) return setIsEditing(false);
      setIsEditing(false);
      handleUpdateName();
    }
  }

  async function handleDelete(id: number) {
    startTransition(async () => {
      deleteAction(id);
    });
  }

  async function copyImageToClipboard() {
    try {
      const response = await fetch(sheet.url);
      const blob = await response.blob();
      const clipboardItem = new ClipboardItem({ [blob.type]: blob });
      await navigator.clipboard.write([clipboardItem]);
      alert("Image copied to clipboard!");
    } catch (error) {
      console.error("Failed to copy image:", error);
    }
  }

  return (
    <Card
      key={sheet.id}
      className="overflow-hidden  w-auto mx-4 md:mx-0 hover:shadow-lg transition-shadow border-border bg-card"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
        <CardTitle className="text-sm font-medium">
          {isEditing ? (
            <Input
              ref={inputRef}
              placeholder="Editar o nome.."
              onFocus={(e) => (e.target.value = sheet.name)}
              onBlur={handleUpdateNameOnBlur}
              onKeyDown={handleUpdateNameOnEnter}
              className="py-0 min-h-0 h-6"
            />
          ) : (
            <Label className="cursor-pointer" onClick={handleRename}>
              {sheet.name}
            </Label>
          )}
        </CardTitle>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>Abrir</DropdownMenuItem>
            <DropdownMenuItem onClick={handleRename}>Renomear</DropdownMenuItem>
            <DropdownMenuItem onClick={copyImageToClipboard}>
              Copiar
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleDelete(sheet.id)}
              className="text-red-600"
            >
              Excluir
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>
      <CardContent className="p-0">
        <div className="relative md:w-[240px] h-[200px] bg-muted/20">
          <Dialog>
            <DialogTrigger asChild>
              <Image
                src={sheet.url}
                alt={`Preview of ${sheet.name}`}
                fill
                className="object-cover cursor-pointer"
              />
            </DialogTrigger>

            <DialogContent className="h-full bg-white outline-none shadow-none border-none">
              <DialogTitle hidden />
              <DialogClose className="bg-white rounded h-fit w-fit  z-50 ml-auto">
                <XIcon className="bg-black" />
              </DialogClose>

              {/* <ContextMenu>
                <ContextMenuTrigger  className="flex h-[150px] w-[300px] items-center justify-center rounded-md border border-dashed z-50 text-sm">
                  Right click here
                </ContextMenuTrigger>
                <ContextMenuContent className="w-64">
                  <ContextMenuItem inset>
                    Back
                    <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem inset disabled>
                    Forward
                    <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                  </ContextMenuItem>
                  <ContextMenuItem inset>
                    Reload
                    <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                  </ContextMenuItem>
                </ContextMenuContent>
              </ContextMenu> */}

              <Image
                src={sheet.url}
                alt={`Preview of ${sheet.name}`}
                fill
                className="object-contain cursor-pointer"
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}
