"use client";
/// <reference types="react/experimental" />
import { ReactNode, useRef, unstable_postpone as postpone } from "react";
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

export function DeserializeRSC({ payload }: { payload: string }) {
  console.log(RSDW);
  const ref = useRef<Promise<ReactNode> | null>(null);
  if (typeof window === "undefined") {
    postpone();
  }
  if (!ref.current) {
    const stream = stringToStream(payload);
    ref.current = RSDW.createFromReadableStream(stream, {});
  }
  return ref.current;
}
