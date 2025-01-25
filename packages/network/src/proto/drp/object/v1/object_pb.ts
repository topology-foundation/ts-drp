// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               unknown
// source: drp/object/v1/object.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { Value } from "../../../google/protobuf/struct_pb.js";

export const protobufPackage = "drp.object.v1";

/** Supposed to be the RIBLT stuff */
export interface Vertex {
  hash: string;
  peerId: string;
  operation: Vertex_Operation | undefined;
  dependencies: string[];
  timestamp: number;
  signature: Uint8Array;
}

export interface Vertex_Operation {
  drpType: string;
  opType: string;
  value: any | undefined;
}

export interface Attestation {
  data: string;
  signature: Uint8Array;
}

export interface AggregatedAttestation {
  data: string;
  signature: Uint8Array;
  aggregationBits: Uint8Array;
}

export interface DRPStateEntry {
  key: string;
  value: any | undefined;
}

export interface DRPState {
  state: DRPStateEntry[];
}

export interface DRPObjectBase {
  id: string;
  vertices: Vertex[];
}

function createBaseVertex(): Vertex {
  return { hash: "", peerId: "", operation: undefined, dependencies: [], timestamp: 0, signature: new Uint8Array(0) };
}

export const Vertex: MessageFns<Vertex> = {
  encode(message: Vertex, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.hash !== "") {
      writer.uint32(10).string(message.hash);
    }
    if (message.peerId !== "") {
      writer.uint32(18).string(message.peerId);
    }
    if (message.operation !== undefined) {
      Vertex_Operation.encode(message.operation, writer.uint32(26).fork()).join();
    }
    for (const v of message.dependencies) {
      writer.uint32(34).string(v!);
    }
    if (message.timestamp !== 0) {
      writer.uint32(40).int64(message.timestamp);
    }
    if (message.signature.length !== 0) {
      writer.uint32(50).bytes(message.signature);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Vertex {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVertex();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.hash = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.peerId = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.operation = Vertex_Operation.decode(reader, reader.uint32());
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.dependencies.push(reader.string());
          continue;
        }
        case 5: {
          if (tag !== 40) {
            break;
          }

          message.timestamp = longToNumber(reader.int64());
          continue;
        }
        case 6: {
          if (tag !== 50) {
            break;
          }

          message.signature = reader.bytes();
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

  fromJSON(object: any): Vertex {
    return {
      hash: isSet(object.hash) ? globalThis.String(object.hash) : "",
      peerId: isSet(object.peerId) ? globalThis.String(object.peerId) : "",
      operation: isSet(object.operation) ? Vertex_Operation.fromJSON(object.operation) : undefined,
      dependencies: globalThis.Array.isArray(object?.dependencies)
        ? object.dependencies.map((e: any) => globalThis.String(e))
        : [],
      timestamp: isSet(object.timestamp) ? globalThis.Number(object.timestamp) : 0,
      signature: isSet(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(0),
    };
  },

  toJSON(message: Vertex): unknown {
    const obj: any = {};
    if (message.hash !== "") {
      obj.hash = message.hash;
    }
    if (message.peerId !== "") {
      obj.peerId = message.peerId;
    }
    if (message.operation !== undefined) {
      obj.operation = Vertex_Operation.toJSON(message.operation);
    }
    if (message.dependencies?.length) {
      obj.dependencies = message.dependencies;
    }
    if (message.timestamp !== 0) {
      obj.timestamp = Math.round(message.timestamp);
    }
    if (message.signature.length !== 0) {
      obj.signature = base64FromBytes(message.signature);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vertex>, I>>(base?: I): Vertex {
    return Vertex.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vertex>, I>>(object: I): Vertex {
    const message = createBaseVertex();
    message.hash = object.hash ?? "";
    message.peerId = object.peerId ?? "";
    message.operation = (object.operation !== undefined && object.operation !== null)
      ? Vertex_Operation.fromPartial(object.operation)
      : undefined;
    message.dependencies = object.dependencies?.map((e) => e) || [];
    message.timestamp = object.timestamp ?? 0;
    message.signature = object.signature ?? new Uint8Array(0);
    return message;
  },
};

function createBaseVertex_Operation(): Vertex_Operation {
  return { drpType: "", opType: "", value: undefined };
}

export const Vertex_Operation: MessageFns<Vertex_Operation> = {
  encode(message: Vertex_Operation, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.drpType !== "") {
      writer.uint32(10).string(message.drpType);
    }
    if (message.opType !== "") {
      writer.uint32(18).string(message.opType);
    }
    if (message.value !== undefined) {
      Value.encode(Value.wrap(message.value), writer.uint32(26).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Vertex_Operation {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseVertex_Operation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.drpType = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.opType = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.value = Value.unwrap(Value.decode(reader, reader.uint32()));
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

  fromJSON(object: any): Vertex_Operation {
    return {
      drpType: isSet(object.drpType) ? globalThis.String(object.drpType) : "",
      opType: isSet(object.opType) ? globalThis.String(object.opType) : "",
      value: isSet(object?.value) ? object.value : undefined,
    };
  },

  toJSON(message: Vertex_Operation): unknown {
    const obj: any = {};
    if (message.drpType !== "") {
      obj.drpType = message.drpType;
    }
    if (message.opType !== "") {
      obj.opType = message.opType;
    }
    if (message.value !== undefined) {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Vertex_Operation>, I>>(base?: I): Vertex_Operation {
    return Vertex_Operation.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Vertex_Operation>, I>>(object: I): Vertex_Operation {
    const message = createBaseVertex_Operation();
    message.drpType = object.drpType ?? "";
    message.opType = object.opType ?? "";
    message.value = object.value ?? undefined;
    return message;
  },
};

function createBaseAttestation(): Attestation {
  return { data: "", signature: new Uint8Array(0) };
}

export const Attestation: MessageFns<Attestation> = {
  encode(message: Attestation, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.data !== "") {
      writer.uint32(10).string(message.data);
    }
    if (message.signature.length !== 0) {
      writer.uint32(18).bytes(message.signature);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): Attestation {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAttestation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.data = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.signature = reader.bytes();
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

  fromJSON(object: any): Attestation {
    return {
      data: isSet(object.data) ? globalThis.String(object.data) : "",
      signature: isSet(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(0),
    };
  },

  toJSON(message: Attestation): unknown {
    const obj: any = {};
    if (message.data !== "") {
      obj.data = message.data;
    }
    if (message.signature.length !== 0) {
      obj.signature = base64FromBytes(message.signature);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<Attestation>, I>>(base?: I): Attestation {
    return Attestation.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<Attestation>, I>>(object: I): Attestation {
    const message = createBaseAttestation();
    message.data = object.data ?? "";
    message.signature = object.signature ?? new Uint8Array(0);
    return message;
  },
};

function createBaseAggregatedAttestation(): AggregatedAttestation {
  return { data: "", signature: new Uint8Array(0), aggregationBits: new Uint8Array(0) };
}

export const AggregatedAttestation: MessageFns<AggregatedAttestation> = {
  encode(message: AggregatedAttestation, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.data !== "") {
      writer.uint32(10).string(message.data);
    }
    if (message.signature.length !== 0) {
      writer.uint32(18).bytes(message.signature);
    }
    if (message.aggregationBits.length !== 0) {
      writer.uint32(26).bytes(message.aggregationBits);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): AggregatedAttestation {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseAggregatedAttestation();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.data = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.signature = reader.bytes();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.aggregationBits = reader.bytes();
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

  fromJSON(object: any): AggregatedAttestation {
    return {
      data: isSet(object.data) ? globalThis.String(object.data) : "",
      signature: isSet(object.signature) ? bytesFromBase64(object.signature) : new Uint8Array(0),
      aggregationBits: isSet(object.aggregationBits) ? bytesFromBase64(object.aggregationBits) : new Uint8Array(0),
    };
  },

  toJSON(message: AggregatedAttestation): unknown {
    const obj: any = {};
    if (message.data !== "") {
      obj.data = message.data;
    }
    if (message.signature.length !== 0) {
      obj.signature = base64FromBytes(message.signature);
    }
    if (message.aggregationBits.length !== 0) {
      obj.aggregationBits = base64FromBytes(message.aggregationBits);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<AggregatedAttestation>, I>>(base?: I): AggregatedAttestation {
    return AggregatedAttestation.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<AggregatedAttestation>, I>>(object: I): AggregatedAttestation {
    const message = createBaseAggregatedAttestation();
    message.data = object.data ?? "";
    message.signature = object.signature ?? new Uint8Array(0);
    message.aggregationBits = object.aggregationBits ?? new Uint8Array(0);
    return message;
  },
};

function createBaseDRPStateEntry(): DRPStateEntry {
  return { key: "", value: undefined };
}

export const DRPStateEntry: MessageFns<DRPStateEntry> = {
  encode(message: DRPStateEntry, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      Value.encode(Value.wrap(message.value), writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DRPStateEntry {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDRPStateEntry();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.key = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.value = Value.unwrap(Value.decode(reader, reader.uint32()));
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

  fromJSON(object: any): DRPStateEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object?.value) ? object.value : undefined,
    };
  },

  toJSON(message: DRPStateEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== undefined) {
      obj.value = message.value;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DRPStateEntry>, I>>(base?: I): DRPStateEntry {
    return DRPStateEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DRPStateEntry>, I>>(object: I): DRPStateEntry {
    const message = createBaseDRPStateEntry();
    message.key = object.key ?? "";
    message.value = object.value ?? undefined;
    return message;
  },
};

function createBaseDRPState(): DRPState {
  return { state: [] };
}

export const DRPState: MessageFns<DRPState> = {
  encode(message: DRPState, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    for (const v of message.state) {
      DRPStateEntry.encode(v!, writer.uint32(10).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DRPState {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDRPState();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.state.push(DRPStateEntry.decode(reader, reader.uint32()));
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

  fromJSON(object: any): DRPState {
    return {
      state: globalThis.Array.isArray(object?.state) ? object.state.map((e: any) => DRPStateEntry.fromJSON(e)) : [],
    };
  },

  toJSON(message: DRPState): unknown {
    const obj: any = {};
    if (message.state?.length) {
      obj.state = message.state.map((e) => DRPStateEntry.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DRPState>, I>>(base?: I): DRPState {
    return DRPState.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DRPState>, I>>(object: I): DRPState {
    const message = createBaseDRPState();
    message.state = object.state?.map((e) => DRPStateEntry.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDRPObjectBase(): DRPObjectBase {
  return { id: "", vertices: [] };
}

export const DRPObjectBase: MessageFns<DRPObjectBase> = {
  encode(message: DRPObjectBase, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.id !== "") {
      writer.uint32(10).string(message.id);
    }
    for (const v of message.vertices) {
      Vertex.encode(v!, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): DRPObjectBase {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseDRPObjectBase();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.id = reader.string();
          continue;
        }
        case 2: {
          if (tag !== 18) {
            break;
          }

          message.vertices.push(Vertex.decode(reader, reader.uint32()));
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

  fromJSON(object: any): DRPObjectBase {
    return {
      id: isSet(object.id) ? globalThis.String(object.id) : "",
      vertices: globalThis.Array.isArray(object?.vertices) ? object.vertices.map((e: any) => Vertex.fromJSON(e)) : [],
    };
  },

  toJSON(message: DRPObjectBase): unknown {
    const obj: any = {};
    if (message.id !== "") {
      obj.id = message.id;
    }
    if (message.vertices?.length) {
      obj.vertices = message.vertices.map((e) => Vertex.toJSON(e));
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<DRPObjectBase>, I>>(base?: I): DRPObjectBase {
    return DRPObjectBase.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<DRPObjectBase>, I>>(object: I): DRPObjectBase {
    const message = createBaseDRPObjectBase();
    message.id = object.id ?? "";
    message.vertices = object.vertices?.map((e) => Vertex.fromPartial(e)) || [];
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

function longToNumber(int64: { toString(): string }): number {
  const num = globalThis.Number(int64.toString());
  if (num > globalThis.Number.MAX_SAFE_INTEGER) {
    throw new globalThis.Error("Value is larger than Number.MAX_SAFE_INTEGER");
  }
  if (num < globalThis.Number.MIN_SAFE_INTEGER) {
    throw new globalThis.Error("Value is smaller than Number.MIN_SAFE_INTEGER");
  }
  return num;
}

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
