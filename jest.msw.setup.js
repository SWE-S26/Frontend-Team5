/**
 * Setup for MSW handler tests only (jest.msw.config.cjs).
 * Uses Node's built-in fetch / Request / Response (Node 18+).
 * Avoids jest.setup.js + undici, which breaks when node_modules is fully transformed.
 *
 * MSW resolves relative paths like `/api/...` against `location.href`. Node has no
 * `location`, so handlers would not match `http://localhost/api/...` without this.
 */
globalThis.location = { href: "http://localhost/" };

const { TextDecoder, TextEncoder } = require("util");
const { ReadableStream, TransformStream } = require("stream/web");
const { MessageChannel, MessagePort } = require("worker_threads");

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
global.ReadableStream = ReadableStream;
global.TransformStream = TransformStream;
global.MessageChannel = MessageChannel;
global.MessagePort = MessagePort;
