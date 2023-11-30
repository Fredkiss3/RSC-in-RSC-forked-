"use client";
/// <reference types="react/experimental" />
import React, {
    type ReactNode,
    // @ts-expect-error
    unstable_postpone as postpone,
    use,
} from "react";
// @ts-expect-error
import * as RSDWSSr from "react-server-dom-webpack/client.edge";
// @ts-expect-error
import * as RSDW from "react-server-dom-webpack/client";

function stringToStream(input: string) {
    // Using Flight to deserialize the args from the string.
    return new ReadableStream({
        start(controller) {
            controller.enqueue(new TextEncoder().encode(input));
            controller.close();
        },
    });
}

export function DeserializeRSC({
    payload,
    cache,
}: {
    payload: string;
    cache: { current: Promise<ReactNode> | null };
}) {
    const stream = stringToStream(payload);
    if (typeof document === "undefined") {
        // @ts-expect-error
        const rscManifest = globalThis.__RSC_MANIFEST?.["/page"];
        cache.current = RSDWSSr.createFromReadableStream(stream, {
            ssrManifest: {
                moduleLoading: rscManifest.moduleLoading,
                moduleMap: rscManifest.ssrModuleMapping,
            },
        });
    }
    if (!cache.current) {
        // console.log("setting cache");
        cache.current = RSDW.createFromReadableStream(stream, {});
    }
    // console.log(cache.current);
    const el = use(cache.current!);
    return <>{el}</>;
}
