"use server";

import { randomUUID } from "node:crypto";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function uploadFile(prevstate: any, file: File) {
  const client = await createClient();

  let newFile = { ...file };

  const key = randomUUID();

  newFile = new File([file], key, {
    type: file.type,
  });

  const { data: _, error: storageError } = await client.storage
    .from("musicas")
    .upload(newFile.name, newFile);

  if (storageError) {
    return {
      success: false,
      error: "Erro ao tentar salvar imagem no storage.",
    };
  }

  const { error } = await client.from("musicas").insert({
    name: newFile.name,
    url: `https://cpyvvzkslcscyoftatqs.supabase.co/storage/v1/object/public/musicas/${newFile.name}`,
    storage_id: key,
  });

  if (error) {
    await client.storage.from("musicas").remove([newFile.name]);

    return {
      success: false,
      error: `Erro ao salvar imagem ${newFile.name} no banco de dados.`,
    };
  }

  revalidatePath("/");
}

export async function updateName(
  prevstate: any,
  data: { newName: string; id: number }
) {
  const client = await createClient();

  const { error } = await client
    .from("musicas")
    .update({ name: data.newName })
    .eq("id", data.id);

  if (error) {
    return {
      success: false,
      error: "Erro ao tentar atualizar o nome da música.",
    };
  }

  revalidatePath("/");
}

export async function deleteFile(prevstate: any, id: number) {
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
