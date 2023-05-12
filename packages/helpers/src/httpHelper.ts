import * as http from "http";
import * as https from "https";
import type { IncomingMessage } from "http";
import { Injectable } from "@bnqkl/util-node";

@Injectable()
export class HttpHelper {
    constructor(host: string) {}

    checkHttp(url: string) {
        if (url.toLocaleLowerCase().startsWith("https")) {
            return https;
        } else {
            return http;
        }
    }
    sendPostRequest<T>(url: string, argv: { [key: string]: any }) {
        return new Promise<T>((resolve, reject) => {
            const req = this.checkHttp(url).request(
                url,
                { method: "POST", headers: { "content-type": "application/json" } },
                async (res) => {
                    parsePostRequestParameter(res, resolve, reject);
                },
            );
            req.setTimeout(10 * 1000, () => {
                return reject("timeout");
            });
            req.on("error", (e) => {
                return reject(e);
            });
            req.write(JSON.stringify(argv));
            req.end();
        });
    }

    sendGetRequest<T>(url: string, argv?: { [key: string]: any }) {
        const completeUrl =
            url +
            (argv
                ? url.includes("?")
                    ? `&${parseGetRequestParamter(argv)}`
                    : `?${parseGetRequestParamter(argv)}`
                : "");
        return new Promise<T>((resolve, reject) => {
            const req = this.checkHttp(url).get(completeUrl, async (res) => {
                parsePostRequestParameter(res, resolve, reject);
            });
            req.setTimeout(10 * 1000, () => {
                return reject("timeout");
            });
            req.on("error", (e) => {
                return reject(e);
            });
        });
    }

    sendApiGetRequest<T>(
        url: string,
        argv?: { [key: string]: any },
        headers?: { [key: string]: any },
    ) {
        const completeUrl = url + (argv ? `?${parseGetRequestParamter(argv)}` : "");
        return new Promise<T>((resolve, reject) => {
            const req = this.checkHttp(url).get(completeUrl, { headers }, async (res) => {
                parsePostRequestParameter<T>(res, resolve, reject);
            });
            req.setTimeout(10 * 1000, () => {
                return reject("timeout");
            });
            req.on("error", (e) => {
                return reject(e);
            });
        });
    }
}

function parseGetRequestParamter(argv: { [key: string]: any }) {
    let param = "";
    if (argv) {
        for (const k in argv) {
            if (argv[k] === undefined) continue;
            param = (param ? param + "&" : param) + `${k}=${argv[k]}`;
        }
    }
    return param;
}

function parsePostRequestParameter<T>(
    imcomingMessage: IncomingMessage,
    resolve: (value: T | PromiseLike<T>) => void,
    reject: (reason?: any) => void,
) {
    const buffers: Uint8Array[] = [];
    imcomingMessage.on("error", (error) => {
        return reject(error.message);
    });
    imcomingMessage.on("data", (chunk: Uint8Array) => buffers.push(chunk));
    imcomingMessage.on("end", () => {
        const requestString = Buffer.concat(buffers).toString();
        try {
            return resolve(JSON.parse(requestString));
        } catch (e) {
            return reject(`parse parameter error`);
        }
    });
}
