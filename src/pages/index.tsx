import { useState } from "react";
import type { NextPage } from "next";
import { useWallet } from '@meshsdk/react';
import { CardanoWallet } from '@meshsdk/react';
import {resolvePlutusScriptAddress,
  Transaction,
  KoiosProvider,
  resolveDataHash,
  resolvePaymentKeyHash, } from "@meshsdk/core"
import type { PlutusScript, Data } from "@meshsdk/core";
import cbor from "cbor"

import plutusScript from "../data/plutus.json"



const Home: NextPage = () => {
  const { connected, wallet } = useWallet();
  const [assets, setAssets] = useState<null | any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [utxos, setUtxos] = useState<null | any>(null);

  async function getAssets() {
    if (wallet) {
      setLoading(true);
      const _assets = await wallet.getAssets();
      setAssets(_assets);
      setLoading(false);
    }
  }

  async function getUtxos() {

    if (wallet){
      setLoading(true);
      const _utxos = await wallet.getUtxos()
      setUtxos(_utxos);
      setLoading(false);
      
    }
  }

  return (
    <div>
      <h1>Connect Wallet</h1>
      <CardanoWallet />
      {connected && (
        <>
          <h1>Get Wallet Assets</h1>
          {assets ? (
            <pre>
              <code className="language-js">
                {JSON.stringify(assets, null, 2)}
              </code>
            </pre>
          ) : (
            <button
              type="button"
              onClick={() => getAssets()}
              disabled={loading}
              style={{
                margin: "8px",
                backgroundColor: loading ? "orange" : "grey",
              }}
            >
              Get Wallet Assets
            </button>
          )}
          <div>
            {utxos? (
              <pre>
                <code className="language-js">
                {JSON.stringify(utxos, null, 2)}
                </code>
              </pre>
            ): (
              <button type="button" disabled={loading} onClick={() => getUtxos()}>
                Get Utxos
              </button>

            )}
          </div>

        </>
      )}
    </div>
  )
};

export default Home;