// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.0
//   protoc               unknown
// source: drp/network/v1/messages.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Attestation, Vertex } from "../../object/v1/object_pb.js";

export const protobufPackage = "drp.network.v1";

export enum MessageType {
  MESSAGE_TYPE_UNSPECIFIED = 0,
  MESSAGE_TYPE_UPDATE = 1,
  MESSAGE_TYPE_SYNC = 2,
  MESSAGE_TYPE_SYNC_ACCEPT = 3,
  MESSAGE_TYPE_SYNC_REJECT = 4,
  MESSAGE_TYPE_ATTESTATION_UPDATE = 5,
  MESSAGE_TYPE_CUSTOM = 6,
  UNRECOGNIZED = -1,
}

export function messageTypeFromJSON(object: any): MessageType {
  switch (object) {
    case 0:
    case "MESSAGE_TYPE_UNSPECIFIED":
      return MessageType.MESSAGE_TYPE_UNSPECIFIED;
    case 1:
    case "MESSAGE_TYPE_UPDATE":
      return MessageType.MESSAGE_TYPE_UPDATE;
    case 2:
    case "MESSAGE_TYPE_SYNC":
      return MessageType.MESSAGE_TYPE_SYNC;
    case 3:
    case "MESSAGE_TYPE_SYNC_ACCEPT":
      return MessageType.MESSAGE_TYPE_SYNC_ACCEPT;
    case 4:
    case "MESSAGE_TYPE_SYNC_REJECT":
      return MessageType.MESSAGE_TYPE_SYNC_REJECT;
    case 5:
    case "MESSAGE_TYPE_ATTESTATION_UPDATE":
      return MessageType.MESSAGE_TYPE_ATTESTATION_UPDATE;
    case 6:
    case "MESSAGE_TYPE_CUSTOM":
      return MessageType.MESSAGE_TYPE_CUSTOM;
    case -1:
    case "UNRECOGNIZED":
    default:
      return MessageType.UNRECOGNIZED;
  }
}

export function messageTypeToJSON(object: MessageType): string {
  switch (object) {
    case MessageType.MESSAGE_TYPE_UNSPECIFIED:
      return "MESSAGE_TYPE_UNSPECIFIED";
    case MessageType.MESSAGE_TYPE_UPDATE:
      return "MESSAGE_TYPE_UPDATE";
    case MessageType.MESSAGE_TYPE_SYNC:
      return "MESSAGE_TYPE_SYNC";
    case MessageType.MESSAGE_TYPE_SYNC_ACCEPT:
      return "MESSAGE_TYPE_SYNC_ACCEPT";
    case MessageType.MESSAGE_TYPE_SYNC_REJECT:
      return "MESSAGE_TYPE_SYNC_REJECT";
    case MessageType.MESSAGE_TYPE_ATTESTATION_UPDATE:
      return "MESSAGE_TYPE_ATTESTATION_UPDATE";
    case MessageType.MESSAGE_TYPE_CUSTOM:
      return "MESSAGE_TYPE_CUSTOM";
    case MessageType.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface Message {
  sender: string;
  type: MessageType;
  data: Uint8Array;
}

export interface Update {
  objectId: string;
  vertices: Vertex[];
  attestations: Attestation[];
}

export interface AttestationUpdate {
  objectId: string;
  attestations: Attestation[];
}

export interface Sync {
  objectId: string;
  vertexHashes: string[];
}

export interface SyncAccept {
  objectId: string;
  requested: Vertex[];
  requesting: string[];
}

export interface SyncReject {
}

function createBaseMessage(): Message {
  return { sender: "", type: 0, data: new Uint8Array(0) };
}

export const Message: MessageFns<Message> = {
  encode(message: Message, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.sender !== "") {
      writer.uint32(10).string(message.sender);
    }
    if (message.type !== 0) {
      writer.uint32(16).int32(message.type);
    }
    if (message.data.length !== 0) {
      writer.uint32(26).bytes(message.data);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Message {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMessage();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.sender = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 16) {
            break;
          }

          message.type = reader.int32() as any;
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

  fromJSON(object: any): Message {
    return {
      sender: isSet(object.sender) ? globalThis.String(object.sender) : "",
      type: isSet(object.type) ? messageTypeFromJSON(object.type) : 0,
      data: isSet(object.data) ? bytesFromBase64(object.data) : new Uint8Array(0),
    };
  },

  toJSON(message: Message): unknown {
    const obj: any = {};
    if (message.sender !== "") {
      obj.sender = message.sender;
    }
    if (message.type !== 0) {
      obj.type = messageTypeToJSON(message.type);
    }
    if (message.data.length !== 0) {
      obj.data = base64FromBytes(message.data);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Message>, I>>(base?: I): Message {
    return Message.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Message>, I>>(object: I): Message {
    const message = createBaseMessage();
    message.sender = object.sender ?? "";
    message.type = object.type ?? 0;
    message.data = object.data ?? new Uint8Array(0);
    return message;
  },
};

function createBaseUpdate(): Update {
  return { objectId: "", vertices: [], attestations: [] };
}

export const Update: MessageFns<Update> = {
  encode(message: Update, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.objectId !== "") {
      writer.uint32(10).string(message.objectId);
    }
    for (const v of message.vertices) {
      Vertex.encode(v!, writer.uint32(18).fork()).join();
    }
    for (const v of message.attestations) {
      Attestation.encode(v!, writer.uint32(26).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Update {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.objectId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.vertices.push(Vertex.decode(reader, reader.uint32()));
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.attestations.push(Attestation.decode(reader, reader.uint32()));
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

  fromJSON(object: any): Update {
    return {
      objectId: isSet(object.objectId) ? globalThis.String(object.objectId) : "",
      vertices: globalThis.Array.isArray(object?.vertices) ? object.vertices.map((e: any) => Vertex.fromJSON(e)) : [],
      attestations: globalThis.Array.isArray(object?.attestations)
        ? object.attestations.map((e: any) => Attestation.fromJSON(e))
        : [],
    };
  },

  toJSON(message: Update): unknown {
    const obj: any = {};
    if (message.objectId !== "") {
      obj.objectId = message.objectId;
    }
    if (message.vertices?.length) {
      obj.vertices = message.vertices.map((e) => Vertex.toJSON(e));
    }
    if (message.attestations?.length) {
      obj.attestations = message.attestations.map((e) => Attestation.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Update>, I>>(base?: I): Update {
    return Update.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Update>, I>>(object: I): Update {
    const message = createBaseUpdate();
    message.objectId = object.objectId ?? "";
    message.vertices = object.vertices?.map((e) => Vertex.fromPartial(e)) || [];
    message.attestations = object.attestations?.map((e) => Attestation.fromPartial(e)) || [];
    return message;
  },
};

function createBaseAttestationUpdate(): AttestationUpdate {
  return { objectId: "", attestations: [] };
}

export const AttestationUpdate: MessageFns<AttestationUpdate> = {
  encode(message: AttestationUpdate, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.objectId !== "") {
      writer.uint32(10).string(message.objectId);
    }
    for (const v of message.attestations) {
      Attestation.encode(v!, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): AttestationUpdate {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAttestationUpdate();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.objectId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.attestations.push(Attestation.decode(reader, reader.uint32()));
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

  fromJSON(object: any): AttestationUpdate {
    return {
      objectId: isSet(object.objectId) ? globalThis.String(object.objectId) : "",
      attestations: globalThis.Array.isArray(object?.attestations)
        ? object.attestations.map((e: any) => Attestation.fromJSON(e))
        : [],
    };
  },

  toJSON(message: AttestationUpdate): unknown {
    const obj: any = {};
    if (message.objectId !== "") {
      obj.objectId = message.objectId;
    }
    if (message.attestations?.length) {
      obj.attestations = message.attestations.map((e) => Attestation.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AttestationUpdate>, I>>(base?: I): AttestationUpdate {
    return AttestationUpdate.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AttestationUpdate>, I>>(object: I): AttestationUpdate {
    const message = createBaseAttestationUpdate();
    message.objectId = object.objectId ?? "";
    message.attestations = object.attestations?.map((e) => Attestation.fromPartial(e)) || [];
    return message;
  },
};

function createBaseSync(): Sync {
  return { objectId: "", vertexHashes: [] };
}

export const Sync: MessageFns<Sync> = {
  encode(message: Sync, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.objectId !== "") {
      writer.uint32(10).string(message.objectId);
    }
    for (const v of message.vertexHashes) {
      writer.uint32(18).string(v!);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Sync {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSync();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.objectId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.vertexHashes.push(reader.string());
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

  fromJSON(object: any): Sync {
    return {
      objectId: isSet(object.objectId) ? globalThis.String(object.objectId) : "",
      vertexHashes: globalThis.Array.isArray(object?.vertexHashes)
        ? object.vertexHashes.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: Sync): unknown {
    const obj: any = {};
    if (message.objectId !== "") {
      obj.objectId = message.objectId;
    }
    if (message.vertexHashes?.length) {
      obj.vertexHashes = message.vertexHashes;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Sync>, I>>(base?: I): Sync {
    return Sync.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Sync>, I>>(object: I): Sync {
    const message = createBaseSync();
    message.objectId = object.objectId ?? "";
    message.vertexHashes = object.vertexHashes?.map((e) => e) || [];
    return message;
  },
};

function createBaseSyncAccept(): SyncAccept {
  return { objectId: "", requested: [], requesting: [] };
}

export const SyncAccept: MessageFns<SyncAccept> = {
  encode(message: SyncAccept, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.objectId !== "") {
      writer.uint32(10).string(message.objectId);
    }
    for (const v of message.requested) {
      Vertex.encode(v!, writer.uint32(18).fork()).join();
    }
    for (const v of message.requesting) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SyncAccept {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSyncAccept();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.objectId = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.requested.push(Vertex.decode(reader, reader.uint32()));
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.requesting.push(reader.string());
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

  fromJSON(object: any): SyncAccept {
    return {
      objectId: isSet(object.objectId) ? globalThis.String(object.objectId) : "",
      requested: globalThis.Array.isArray(object?.requested)
        ? object.requested.map((e: any) => Vertex.fromJSON(e))
        : [],
      requesting: globalThis.Array.isArray(object?.requesting)
        ? object.requesting.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: SyncAccept): unknown {
    const obj: any = {};
    if (message.objectId !== "") {
      obj.objectId = message.objectId;
    }
    if (message.requested?.length) {
      obj.requested = message.requested.map((e) => Vertex.toJSON(e));
    }
    if (message.requesting?.length) {
      obj.requesting = message.requesting;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<SyncAccept>, I>>(base?: I): SyncAccept {
    return SyncAccept.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SyncAccept>, I>>(object: I): SyncAccept {
    const message = createBaseSyncAccept();
    message.objectId = object.objectId ?? "";
    message.requested = object.requested?.map((e) => Vertex.fromPartial(e)) || [];
    message.requesting = object.requesting?.map((e) => e) || [];
    return message;
  },
};

function createBaseSyncReject(): SyncReject {
  return {};
}

export const SyncReject: MessageFns<SyncReject> = {
  encode(_: SyncReject, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): SyncReject {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseSyncReject();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
      }
      if ((tag & 7) === 4 || tag === 0) {
        break;
      }
      reader.skip(tag & 7);
    }
    return message;
  },

  fromJSON(_: any): SyncReject {
    return {};
  },

  toJSON(_: SyncReject): unknown {
    const obj: any = {};
    return obj;
  },

  create<I extends Exact<DeepPartial<SyncReject>, I>>(base?: I): SyncReject {
    return SyncReject.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<SyncReject>, I>>(_: I): SyncReject {
    const message = createBaseSyncReject();
    return message;
  },
};

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
