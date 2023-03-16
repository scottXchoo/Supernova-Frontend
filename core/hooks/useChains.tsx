import {
  ChainInfo,
  chainInfoList,
  defaultChainInfo,
} from "../config/chainInfo";
import {
  chainClientAddresses,
  chainClientIndices,
  chainClientList,
  queryClient,
  wasmClientList,
} from "../state/coreState";
import { useRecoilState, useSetRecoilState } from "recoil";
import { useWallet } from "./useWallet";
import {
  SigningStargateClient,
  defaultRegistryTypes,
  AminoTypes,
  GasPrice,
} from "@cosmjs/stargate";
import { OfflineSigner, Registry } from "@cosmjs/proto-signing";

import { nova } from "supernovajs";
import {
  SigningCosmWasmClient,
  SigningCosmWasmClientOptions,
} from "@cosmjs/cosmwasm-stargate";
import { useEffect } from "react";
import { Decimal } from "cosmwasm";

type UseChainsType = {
  init: () => Promise<void>;
};

export const useChains: () => UseChainsType = () => {
  const [clientKV, setClientKV] = useRecoilState(chainClientIndices);
  const [clients, setClients] = useRecoilState(chainClientList);
  const [addresses, setAddresses] = useRecoilState(chainClientAddresses);
  // eslint-disable-next-line no-unused-vars
  const setNovaQueryClient = useSetRecoilState(queryClient);
  const { enableClient, getSigner, enabled } = useWallet();
  const [wasmClients, setWasmClients] = useRecoilState(wasmClientList);

  const newWalletClient = async (
    info: ChainInfo,
  ): Promise<SigningStargateClient> => {
    const registry = new Registry(defaultRegistryTypes);
    const aminoTypes = new AminoTypes({
      ...nova.gal.v1.AminoConverter,
    });
    nova.gal.v1.load(registry);

    const offlineSigner: OfflineSigner = getSigner(info.chainId);
    const client = await SigningStargateClient.connectWithSigner(
      info.rpc,
      offlineSigner,
      { registry, aminoTypes, gasPrice: GasPrice.fromString("0.01unova") },
    );

    return client;
  };

  const newWasmClient = async (info: ChainInfo) => {
    const offlineSigner: OfflineSigner = window.keplr.getOfflineSigner(
      info.chainId,
    );

    const options: SigningCosmWasmClientOptions = {
      gasPrice: {
        amount: Decimal.fromUserInput("1000", 10),
        denom: "unova",
      },
    };

    const client = SigningCosmWasmClient.connectWithSigner(
      info.rpc,
      offlineSigner,
      options,
    );

    return client;
  };

  const newNovaQueryClient = async () => {
    const novaQueryClient = (
      await nova.ClientFactory.createLCDClient({
        restEndpoint: defaultChainInfo.rest,
      })
    ).nova.gal.v1;

    return novaQueryClient;
  };

  useEffect(() => {
    window.addEventListener("keplr_keystorechange", init);
    return () => {
      window.removeEventListener("keplr_keystorechange", init);
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      setClientKV({});
      setClients([]);
      setAddresses([]);
    }
  }, [enabled]);

  const init = async () => {
    const result = [];
    const addrs = [];
    let curr = 0;
    let kv = clientKV;
    const wasm = [];

    for (let i = 0; i < chainInfoList.length; i++) {
      const el = chainInfoList[i];

      if (!(el.chainId in clientKV)) {
        // suggest chain & try to connect to the wallet
        await enableClient(el);

        // create client
        const client = await newWalletClient(el);
        result.push(client);

        // create wasmClient
        const wasmClient = await newWasmClient(el);
        wasm.push(wasmClient);

        // get signer
        const chainAddr = await getSigner(el.chainId).getAccounts();
        if (chainAddr.length == 0) {
          throw new Error(
            `the chain ${el.chainId} was incorrectly initialized`,
          );
        }

        addrs.push(chainAddr[0].address);

        // increase index
        kv = { ...kv, [el.chainId]: curr + clients.length };
        curr++;
      }
    }

    const queryClient = await newNovaQueryClient();
    setNovaQueryClient(queryClient);
    setClientKV(kv);
    setAddresses([...addresses, ...addrs]);
    setClients([...clients, ...result]);
    setWasmClients([...wasmClients, ...wasm]);
  };

  return { init };
};
