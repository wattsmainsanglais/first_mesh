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
  const [assets, setAssets] = useState<null | List>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [utxos, setUtxos] = useState<null | any>(null);

  const [address, setAddress ] = useState<string>("");
  const [value, setValue] = useState<number>(0);
  const [hash, setHash] = useState<string>("")

  async function getAssets() {
    if (wallet) {
      setLoading(true);
      const _assets = await wallet.getAssets();
      setAssets(_assets);
      console.log(assets);
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

  async function sendAda(){
    if(wallet){
      try{
        const tx = new Transaction({initiator: wallet})
      .sendLovelace(address, (value * 1000000).toString())

      const unsignedTx = await tx.build()
      const signedTx = await wallet.signTx(unsignedTx)
      const txHash = await wallet.submitTx(signedTx)
      setHash(txHash)
      } catch (error: any){
        console.log(error)
      setHash(error)
      }
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
              {assets.map((asset: Object) =>
                <li key={asset.policyID}  className="language-js">
                  {asset.assetName}
                </li>
              )}
             
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
        <section>
          <h2>Send Ada to address </h2>
          <h3>address</h3>
          <input type="string" onChange={e => {setAddress(e.target.value)}} value={address} ></input>
          <p>{address}</p>
          <h3>value</h3>
          <input type="number" onChange={e => {setValue(e.target.value)}} value={value} ></input>
          <button type="button" onClick={() => sendAda()} >send Ada</button>
          <p>{hash? JSON.stringify(hash): null }</p>
      </section>



            </>
      

      )}


    </div>
  )
}

export default Home;