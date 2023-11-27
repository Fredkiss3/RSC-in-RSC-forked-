"use client";
/// <reference types="react/experimental" />
import React, {
  ReactNode,
  useRef,
  unstable_postpone as postpone,
  use,
} from "react";
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
  if (typeof window === "undefined") {
    const rscManifest = __RSC_MANIFEST["/page"];
    cache.current = RSDW.createFromReadableStream(stringToStream(payload), {
      moduleLoading: rscManifest.moduleLoading,
      ssrManifest: rscManifest.ssrModuleMapping,
    });
    // postpone();
  }
  if (!cache.current) {
    console.log("setting cache");
    const stream = stringToStream(payload);
    cache.current = RSDW.createFromReadableStream(stream, {});
  }
  // console.log(cache.current);
  const el = use(cache.current!);
  return <>{el}</>;
}
