"use client";

import { MoreVertical } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import { startTransition, useActionState, useRef, useState } from "react";
import { Input } from "./ui/input";
import { createClient } from "@/utils/supabase/client";
import { revalidatePath } from "next/cache";
import { deleteFile } from "@/actions/file-actions";

type ChordSheetItemProps = {
  sheet: { id: string; url: string; name: string };
};

export function ChordSheetItem({ sheet }: ChordSheetItemProps) {
  const [state, action, isPending] = useActionState(deleteFile, {
    error: "",
    success: true,
  });

  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleRename() {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  }

  async function handleBlur() {
    setIsEditing(false);

    const { error } = await createClient()
      .from("musicas")
      .update({ name: inputRef.current?.value })
      .eq("id", sheet.id);

    if (error) {
      setIsEditing(true);
      alert("Error ao atualizar o nome da música");
    }
  }

  async function handleDelete(id: string) {
    startTransition(async () => {
      action(id);
    });
  }

  return (
    <Card
      key={sheet.id}
      className="overflow-hidden w-auto hover:shadow-lg transition-shadow border-border bg-card"
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 p-2">
        <CardTitle className="text-sm font-medium">
          {isEditing ? (
            <Input
              ref={inputRef}
              placeholder="Editar o nome.."
              onBlur={handleBlur}
            />
          ) : (
            sheet.name
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
            <DropdownMenuItem>Compartilhar</DropdownMenuItem>
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
        <div className="relative w-[240px] h-[200px] bg-muted/20">
          <Image
            src={sheet.url}
            alt={`Preview of ${sheet.name}`}
            fill
            className="object-cover"
          />
        </div>
      </CardContent>
    </Card>
  );
}
