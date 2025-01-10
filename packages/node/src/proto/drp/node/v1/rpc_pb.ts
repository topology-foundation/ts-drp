// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.0
//   protoc               unknown
// source: drp/node/v1/rpc.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";

export const protobufPackage = "drp.node.v1";

export interface SubscribeDRPRequest {
  drpId: string;
}

export interface UnsubscribeDRPRequest {
  drpId: string;
}

export interface GetDRPHashGraphRequest {
  drpId: string;
}

export interface GetDRPHashGraphResponse {
  /** linearized vertices hashes */
  verticesHashes: string[];
}

export interface GenericRespone {
  /** return error codes if different than 0 */
  returnCode: number;
}

export interface SyncDRPObjectRequest {
  drpId: string;
  peerId: string;
}

export interface SendCustomMessageRequest {
  peerId: string;
  data: Uint8Array;
}

export interface SendGroupMessageRequest {
  group: string;
  data: Uint8Array;
}

export interface AddCustomGroupRequest {
  group: string;
}

function createBaseSubscribeDRPRequest(): SubscribeDRPRequest {
  return { drpId: "" };
}

export const SubscribeDRPRequest: MessageFns<SubscribeDRPRequest> = {
  encode(message: SubscribeDRPRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.drpId !== "") {
      writer.uint32(10).string(message.drpId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SubscribeDRPRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSubscribeDRPRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.drpId = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SubscribeDRPRequest {
    return { drpId: isSet(object.drpId) ? globalThis.String(object.drpId) : "" };
  },

  toJSON(message: SubscribeDRPRequest): unknown {
    const obj: any = {};
    if (message.drpId !== "") {
      obj.drpId = message.drpId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SubscribeDRPRequest>, I>>(base?: I): SubscribeDRPRequest {
    return SubscribeDRPRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SubscribeDRPRequest>, I>>(object: I): SubscribeDRPRequest {
    const message = createBaseSubscribeDRPRequest();
    message.drpId = object.drpId ?? "";
    return message;
  },
};

function createBaseUnsubscribeDRPRequest(): UnsubscribeDRPRequest {
  return { drpId: "" };
}

export const UnsubscribeDRPRequest: MessageFns<UnsubscribeDRPRequest> = {
  encode(message: UnsubscribeDRPRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.drpId !== "") {
      writer.uint32(10).string(message.drpId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): UnsubscribeDRPRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUnsubscribeDRPRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.drpId = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): UnsubscribeDRPRequest {
    return { drpId: isSet(object.drpId) ? globalThis.String(object.drpId) : "" };
  },

  toJSON(message: UnsubscribeDRPRequest): unknown {
    const obj: any = {};
    if (message.drpId !== "") {
      obj.drpId = message.drpId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<UnsubscribeDRPRequest>, I>>(base?: I): UnsubscribeDRPRequest {
    return UnsubscribeDRPRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<UnsubscribeDRPRequest>, I>>(object: I): UnsubscribeDRPRequest {
    const message = createBaseUnsubscribeDRPRequest();
    message.drpId = object.drpId ?? "";
    return message;
  },
};

function createBaseGetDRPHashGraphRequest(): GetDRPHashGraphRequest {
  return { drpId: "" };
}

export const GetDRPHashGraphRequest: MessageFns<GetDRPHashGraphRequest> = {
  encode(message: GetDRPHashGraphRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.drpId !== "") {
      writer.uint32(10).string(message.drpId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetDRPHashGraphRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDRPHashGraphRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.drpId = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetDRPHashGraphRequest {
    return { drpId: isSet(object.drpId) ? globalThis.String(object.drpId) : "" };
  },

  toJSON(message: GetDRPHashGraphRequest): unknown {
    const obj: any = {};
    if (message.drpId !== "") {
      obj.drpId = message.drpId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetDRPHashGraphRequest>, I>>(base?: I): GetDRPHashGraphRequest {
    return GetDRPHashGraphRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetDRPHashGraphRequest>, I>>(object: I): GetDRPHashGraphRequest {
    const message = createBaseGetDRPHashGraphRequest();
    message.drpId = object.drpId ?? "";
    return message;
  },
};

function createBaseGetDRPHashGraphResponse(): GetDRPHashGraphResponse {
  return { verticesHashes: [] };
}

export const GetDRPHashGraphResponse: MessageFns<GetDRPHashGraphResponse> = {
  encode(message: GetDRPHashGraphResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    for (const v of message.verticesHashes) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GetDRPHashGraphResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGetDRPHashGraphResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.verticesHashes.push(reader.string());
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GetDRPHashGraphResponse {
    return {
      verticesHashes: globalThis.Array.isArray(object?.verticesHashes)
        ? object.verticesHashes.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: GetDRPHashGraphResponse): unknown {
    const obj: any = {};
    if (message.verticesHashes?.length) {
      obj.verticesHashes = message.verticesHashes;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GetDRPHashGraphResponse>, I>>(base?: I): GetDRPHashGraphResponse {
    return GetDRPHashGraphResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GetDRPHashGraphResponse>, I>>(object: I): GetDRPHashGraphResponse {
    const message = createBaseGetDRPHashGraphResponse();
    message.verticesHashes = object.verticesHashes?.map((e) => e) || [];
    return message;
  },
};

function createBaseGenericRespone(): GenericRespone {
  return { returnCode: 0 };
}

export const GenericRespone: MessageFns<GenericRespone> = {
  encode(message: GenericRespone, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.returnCode !== 0) {
      writer.uint32(8).int32(message.returnCode);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): GenericRespone {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseGenericRespone();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 8) {
            break;
          }

          message.returnCode = reader.int32();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): GenericRespone {
    return { returnCode: isSet(object.returnCode) ? globalThis.Number(object.returnCode) : 0 };
  },

  toJSON(message: GenericRespone): unknown {
    const obj: any = {};
    if (message.returnCode !== 0) {
      obj.returnCode = Math.round(message.returnCode);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<GenericRespone>, I>>(base?: I): GenericRespone {
    return GenericRespone.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<GenericRespone>, I>>(object: I): GenericRespone {
    const message = createBaseGenericRespone();
    message.returnCode = object.returnCode ?? 0;
    return message;
  },
};

function createBaseSyncDRPObjectRequest(): SyncDRPObjectRequest {
  return { drpId: "", peerId: "" };
}

export const SyncDRPObjectRequest: MessageFns<SyncDRPObjectRequest> = {
  encode(message: SyncDRPObjectRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.drpId !== "") {
      writer.uint32(10).string(message.drpId);
    }
    if (message.peerId !== "") {
      writer.uint32(18).string(message.peerId);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SyncDRPObjectRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSyncDRPObjectRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.drpId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.peerId = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SyncDRPObjectRequest {
    return {
      drpId: isSet(object.drpId) ? globalThis.String(object.drpId) : "",
      peerId: isSet(object.peerId) ? globalThis.String(object.peerId) : "",
    };
  },

  toJSON(message: SyncDRPObjectRequest): unknown {
    const obj: any = {};
    if (message.drpId !== "") {
      obj.drpId = message.drpId;
    }
    if (message.peerId !== "") {
      obj.peerId = message.peerId;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SyncDRPObjectRequest>, I>>(base?: I): SyncDRPObjectRequest {
    return SyncDRPObjectRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SyncDRPObjectRequest>, I>>(object: I): SyncDRPObjectRequest {
    const message = createBaseSyncDRPObjectRequest();
    message.drpId = object.drpId ?? "";
    message.peerId = object.peerId ?? "";
    return message;
  },
};

function createBaseSendCustomMessageRequest(): SendCustomMessageRequest {
  return { peerId: "", data: new Uint8Array(0) };
}

export const SendCustomMessageRequest: MessageFns<SendCustomMessageRequest> = {
  encode(message: SendCustomMessageRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.peerId !== "") {
      writer.uint32(10).string(message.peerId);
    }
    if (message.data.length !== 0) {
      writer.uint32(18).bytes(message.data);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SendCustomMessageRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSendCustomMessageRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.peerId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.data = reader.bytes();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SendCustomMessageRequest {
    return {
      peerId: isSet(object.peerId) ? globalThis.String(object.peerId) : "",
      data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(0),
    };
  },

  toJSON(message: SendCustomMessageRequest): unknown {
    const obj: any = {};
    if (message.peerId !== "") {
      obj.peerId = message.peerId;
    }
    if (message.data.length !== 0) {
      obj.data = base64FromBytes(message.data);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SendCustomMessageRequest>, I>>(base?: I): SendCustomMessageRequest {
    return SendCustomMessageRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SendCustomMessageRequest>, I>>(object: I): SendCustomMessageRequest {
    const message = createBaseSendCustomMessageRequest();
    message.peerId = object.peerId ?? "";
    message.data = object.data ?? new Uint8Array(0);
    return message;
  },
};

function createBaseSendGroupMessageRequest(): SendGroupMessageRequest {
  return { group: "", data: new Uint8Array(0) };
}

export const SendGroupMessageRequest: MessageFns<SendGroupMessageRequest> = {
  encode(message: SendGroupMessageRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.group !== "") {
      writer.uint32(10).string(message.group);
    }
    if (message.data.length !== 0) {
      writer.uint32(26).bytes(message.data);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SendGroupMessageRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSendGroupMessageRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.group = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.data = reader.bytes();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): SendGroupMessageRequest {
    return {
      group: isSet(object.group) ? globalThis.String(object.group) : "",
      data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(0),
    };
  },

  toJSON(message: SendGroupMessageRequest): unknown {
    const obj: any = {};
    if (message.group !== "") {
      obj.group = message.group;
    }
    if (message.data.length !== 0) {
      obj.data = base64FromBytes(message.data);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SendGroupMessageRequest>, I>>(base?: I): SendGroupMessageRequest {
    return SendGroupMessageRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SendGroupMessageRequest>, I>>(object: I): SendGroupMessageRequest {
    const message = createBaseSendGroupMessageRequest();
    message.group = object.group ?? "";
    message.data = object.data ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAddCustomGroupRequest(): AddCustomGroupRequest {
  return { group: "" };
}

export const AddCustomGroupRequest: MessageFns<AddCustomGroupRequest> = {
  encode(message: AddCustomGroupRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.group !== "") {
      writer.uint32(10).string(message.group);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): AddCustomGroupRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAddCustomGroupRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.group = reader.string();
          continue;
        }
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(object: any): AddCustomGroupRequest {
    return { group: isSet(object.group) ? globalThis.String(object.group) : "" };
  },

  toJSON(message: AddCustomGroupRequest): unknown {
    const obj: any = {};
    if (message.group !== "") {
      obj.group = message.group;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AddCustomGroupRequest>, I>>(base?: I): AddCustomGroupRequest {
    return AddCustomGroupRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AddCustomGroupRequest>, I>>(object: I): AddCustomGroupRequest {
    const message = createBaseAddCustomGroupRequest();
    message.group = object.group ?? "";
    return message;
  },
};

export interface DrpRpcService {
  SubscribeDRP(request: SubscribeDRPRequest): Promise<GenericRespone>;
  UnsubscribeDRP(request: UnsubscribeDRPRequest): Promise<GenericRespone>;
  GetDRPHashGraph(request: GetDRPHashGraphRequest): Promise<GetDRPHashGraphResponse>;
  SyncDRPObject(request: SyncDRPObjectRequest): Promise<GenericRespone>;
  SendCustomMessage(request: SendCustomMessageRequest): Promise<GenericRespone>;
  SendGroupMessage(request: SendGroupMessageRequest): Promise<GenericRespone>;
  AddCustomGroup(request: AddCustomGroupRequest): Promise<GenericRespone>;
}

export const DrpRpcServiceServiceName = "drp.node.v1.DrpRpcService";
export class DrpRpcServiceClientImpl implements DrpRpcService {
  private readonly rpc: Rpc;
  private readonly service: string;
  constructor(rpc: Rpc, opts?: { service?: string }) {
    this.service = opts?.service || DrpRpcServiceServiceName;
    this.rpc = rpc;
    this.SubscribeDRP = this.SubscribeDRP.bind(this);
    this.UnsubscribeDRP = this.UnsubscribeDRP.bind(this);
    this.GetDRPHashGraph = this.GetDRPHashGraph.bind(this);
    this.SyncDRPObject = this.SyncDRPObject.bind(this);
    this.SendCustomMessage = this.SendCustomMessage.bind(this);
    this.SendGroupMessage = this.SendGroupMessage.bind(this);
    this.AddCustomGroup = this.AddCustomGroup.bind(this);
  }
  SubscribeDRP(request: SubscribeDRPRequest): Promise<GenericRespone> {
    const data = SubscribeDRPRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "SubscribeDRP", data);
    return promise.then((data) => GenericRespone.decode(new BinaryReader(data)));
  }

  UnsubscribeDRP(request: UnsubscribeDRPRequest): Promise<GenericRespone> {
    const data = UnsubscribeDRPRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "UnsubscribeDRP", data);
    return promise.then((data) => GenericRespone.decode(new BinaryReader(data)));
  }

  GetDRPHashGraph(request: GetDRPHashGraphRequest): Promise<GetDRPHashGraphResponse> {
    const data = GetDRPHashGraphRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "GetDRPHashGraph", data);
    return promise.then((data) => GetDRPHashGraphResponse.decode(new BinaryReader(data)));
  }

  SyncDRPObject(request: SyncDRPObjectRequest): Promise<GenericRespone> {
    const data = SyncDRPObjectRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "SyncDRPObject", data);
    return promise.then((data) => GenericRespone.decode(new BinaryReader(data)));
  }

  SendCustomMessage(request: SendCustomMessageRequest): Promise<GenericRespone> {
    const data = SendCustomMessageRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "SendCustomMessage", data);
    return promise.then((data) => GenericRespone.decode(new BinaryReader(data)));
  }

  SendGroupMessage(request: SendGroupMessageRequest): Promise<GenericRespone> {
    const data = SendGroupMessageRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "SendGroupMessage", data);
    return promise.then((data) => GenericRespone.decode(new BinaryReader(data)));
  }

  AddCustomGroup(request: AddCustomGroupRequest): Promise<GenericRespone> {
    const data = AddCustomGroupRequest.encode(request).finish();
    const promise = this.rpc.request(this.service, "AddCustomGroup", data);
    return promise.then((data) => GenericRespone.decode(new BinaryReader(data)));
  }
}

interface Rpc {
  request(service: string, method: string, data: Uint8Array): Promise<Uint8Array>;
}

function bytesFromBase64(b64: string): Uint8Array {
  if ((globalThis as any).Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if ((globalThis as any).Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(globalThis.String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}

export interface MessageFns<T> {
  encode(message: T, writer?: BinaryWriter): BinaryWriter;
  decode(input: BinaryReader | Uint8Array, length?: number): T;
  fromJSON(object: any): T;
  toJSON(message: T): unknown;
  create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
  fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
