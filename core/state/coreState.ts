import { SigningStargateClient } from "@cosmjs/stargate";
import { defaultChainInfo } from "core/config/chainInfo";
import { atom, selector } from "recoil";
import { LCDQueryClient } from "supernovajs/types/codegen/nova/gal/v1/query.lcd";
import { v1 } from "uuid";
import {
  CosmWasmClient,
  SigningCosmWasmClient,
} from "@cosmjs/cosmwasm-stargate";

export type ClientIndexMap = Record<string, number>;

export const chainClientIndices = atom<ClientIndexMap>({
  key: `chainClientIndices/${v1()}`,
  default: {},
});

export const chainClientAddresses = atom<string[]>({
  key: `chainClientAddresses/${v1()}`,
  default: [],
});

export const chainClientList = atom<SigningStargateClient[]>({
  key: `chainClientList/${v1()}`,
  default: [],
});

export const queryClient = atom<LCDQueryClient>({
  key: `queryClient/${v1()}`,
  default: undefined,
});

export const queryWasmClient = atom<CosmWasmClient>({
  key: `queryWasmClient/${v1()}`,
  default: undefined,
});

export const getNovaClient = selector<SigningStargateClient>({
  key: `novaClient/${v1()}`,
  get: ({ get }) => {
    const clinetKV = get(chainClientIndices);
    const novaIndex = clinetKV[defaultChainInfo.chainId];
    const clients = get(chainClientList);

    return clients[novaIndex];
  },
});

export const getNovaAddress = selector<string>({
  key: `novaAddress/${v1()}`,
  get: ({ get }) => {
    const clinetKV = get(chainClientIndices);
    const novaIndex = clinetKV[defaultChainInfo.chainId];
    const addresses = get(chainClientAddresses);

    return addresses[novaIndex];
  },
});

export const wasmClientList = atom<SigningCosmWasmClient[]>({
  key: `wasmClientList/${v1()}`,
  default: [],
});

export const getWasmClient = selector<SigningCosmWasmClient>({
  key: `wasmClient/${v1()}`,
  get: ({ get }) => {
    const clinetKV = get(chainClientIndices);
    const novaIndex = clinetKV[defaultChainInfo.chainId];
    const clients = get(wasmClientList);

    return clients[novaIndex];
  },
});
