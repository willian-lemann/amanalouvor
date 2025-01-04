"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadFile(prevstate: any, file: File) {
  const client = await createClient();

  const { data: storageData, error: storageError } = await client.storage
    .from("musicas")
    .upload(file.name, file);

  if (storageError) {
    return {
      success: false,
      error: "Erro ao tentar salvar imagem no storage.",
    };
  }

  const { error } = await client.from("musicas").insert({
    name: file.name,
    url: `https://cpyvvzkslcscyoftatqs.supabase.co/storage/v1/object/public/musicas/${file.name}`,
  });

  if (error) {
    await client.storage.from("musicas").remove([file.name]);

    return {
      success: false,
      error: `Erro ao salvar imagem ${file.name} no banco de dados.`,
    };
  }

  revalidatePath("/");
}

export async function deleteFile(prevstate: any, id: string) {
  const client = await createClient();

  const { data, error } = await client.from("musicas").select().eq("id", id);

  if (error) {
    return {
      success: false,
      error: "Erro ao tentar buscar a música.",
    };
  }

  const { error: storageError } = await client.storage
    .from("musicas")
    .remove([data[0].name]);

  if (storageError) {
    return {
      success: false,
      error: "Erro ao tentar remover a música do storage.",
    };
  }

  const { error: dbError } = await client.from("musicas").delete().eq("id", id);

  if (dbError) {
    return {
      success: false,
      error: "Erro ao tentar remover a música do banco de dados.",
    };
  }

  revalidatePath("/");
}
