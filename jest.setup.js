// jest.setup.js  (in your project root)
const { TextDecoder, TextEncoder } = require("util");
const { ReadableStream, TransformStream } = require("stream/web");
const { MessageChannel, MessagePort } = require("worker_threads");

global.TextDecoder = TextDecoder;
global.TextEncoder = TextEncoder;
global.ReadableStream = ReadableStream;
global.TransformStream = TransformStream;
global.MessageChannel = MessageChannel;
global.MessagePort = MessagePort;

const { Response, Request, Headers, fetch } = require("undici");

global.Response = Response;
global.Request = Request;
global.Headers = Headers;
global.fetch = fetch;