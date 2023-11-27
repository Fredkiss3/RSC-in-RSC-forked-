import Image from "next/image";
import * as RSDW from "react-server-dom-webpack/server.edge";
import { Funky } from "./funky";
import { DeserializeRSC } from "./deserialize";

async function streamToString(stream: ReadableStream) {
  const reader = stream.getReader();
  const textDecoder = new TextDecoder();
  let result = "";

  async function read() {
    const { done, value } = await reader.read();

    if (done) {
      return result;
    }

    result += textDecoder.decode(value, { stream: true });
    return read();
  }

  return read();
}

export default async function Home() {
  const manifest = globalThis.__RSC_MANIFEST?.["/page"]?.clientModules ?? {};
  const stream = RSDW.renderToReadableStream(<Funky />, manifest);

  const res = await streamToString(stream);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <pre>{res}</pre>
        <br />
        <DeserializeRSC payload={res} cache={{ current: null }} />
      </div>
    </main>
  );
}
