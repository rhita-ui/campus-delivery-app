"use server";

import dbConnect from "@/app/db";
import Store from "@/app/models/store.model";
import VendingMachine from "@/app/models/vendingMachine.model";
import { revalidatePath } from "next/cache";

export async function getStoresAction(timestamp?: number) {
  await dbConnect();
  const stores = await Store.find({}).lean();
  return JSON.parse(JSON.stringify(stores)).map((store: any) => ({
    ...store,
    id: store.id || store._id,
  }));
}

export async function getVendingMachinesAction(timestamp?: number) {
  await dbConnect();
  const vms = await VendingMachine.find({}).lean();
  return JSON.parse(JSON.stringify(vms)).map((vm: any) => ({
    ...vm,
    id: vm.id || vm._id,
    name: vm.names,
  }));
}
