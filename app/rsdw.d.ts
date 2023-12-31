declare module "react-server-dom-webpack/server.edge" {
    export type ReactClientValue = any;
    export type ClientReferenceManifestEntry = {
        id: string;
        // chunks is a double indexed array of chunkId / chunkFilename pairs
        chunks: Array<string>;
        name: string;
    };

    export type ClientManifest = {
        [id: string]: ClientReferenceManifestEntry;
    };

    export type Options = {
        identifierPrefix?: string;
        signal?: AbortSignal;
        // context?: Array<[string, ServerContextJSONValue]>;
        onError?: (error: unknown) => void;
        onPostpone?: (reason: string) => void;
    };

    export function renderToReadableStream(
        model: ReactClientValue,
        webpackMap: ClientManifest,
        options?: Options
    ): ReadableStream;
}
