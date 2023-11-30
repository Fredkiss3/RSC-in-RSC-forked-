import Image from "next/image";
import * as RSDW from "react-server-dom-webpack/server.edge";
import * as React from "react";
import { Cached } from "./funky";
import { DeserializeRSC } from "./deserialize";
import { unstable_cache } from "next/cache";
// import { unstable_noStore } from "next/cache";

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

const getCachedRender = unstable_cache(
    async () => {
        const manifest =
            // @ts-expect-error
            globalThis.__RSC_MANIFEST?.["/page"]?.clientModules ?? {};
        const stream = RSDW.renderToReadableStream(<Cached />, manifest);

        const res = await streamToString(stream);
        return res;
    },
    ["my-funky-component"],
    {
        tags: ["my-funky-component"],
        revalidate: 5,
    }
);

export default async function Home() {
    // unstable_noStore();
    const res = await getCachedRender();

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
                {/* <pre>{res}</pre> */}
                <br />
                <DeserializeRSC payload={res} cache={{ current: null }} />
            </div>
        </main>
    );
}
