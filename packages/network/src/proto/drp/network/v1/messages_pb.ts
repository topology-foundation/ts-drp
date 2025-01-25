// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.6.1
//   protoc               unknown
// source: drp/network/v1/messages.proto

/* eslint-disable */
import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
import { AggregatedAttestation, Attestation, DRPState, Vertex } from "../../object/v1/object_pb.js";

export const protobufPackage = "drp.network.v1";

export enum MessageType {
  MESSAGE_TYPE_UNSPECIFIED = 0,
  MESSAGE_TYPE_FETCH_STATE = 1,
  MESSAGE_TYPE_FETCH_STATE_RESPONSE = 2,
  MESSAGE_TYPE_UPDATE = 3,
  MESSAGE_TYPE_SYNC = 4,
  MESSAGE_TYPE_SYNC_ACCEPT = 5,
  MESSAGE_TYPE_SYNC_REJECT = 6,
  MESSAGE_TYPE_ATTESTATION_UPDATE = 7,
  MESSAGE_TYPE_CUSTOM = 8,
  MESSAGE_TYPE_TOPIC_DISCOVERY_REQUEST = 9,
  MESSAGE_TYPE_TOPIC_DISCOVERY_RESPONSE = 10,
  UNRECOGNIZED = -1,
}

export function messageTypeFromJSON(object: any): MessageType {
  switch (object) {
    case 0:
    case "MESSAGE_TYPE_UNSPECIFIED":
      return MessageType.MESSAGE_TYPE_UNSPECIFIED;
    case 1:
    case "MESSAGE_TYPE_FETCH_STATE":
      return MessageType.MESSAGE_TYPE_FETCH_STATE;
    case 2:
    case "MESSAGE_TYPE_FETCH_STATE_RESPONSE":
      return MessageType.MESSAGE_TYPE_FETCH_STATE_RESPONSE;
    case 3:
    case "MESSAGE_TYPE_UPDATE":
      return MessageType.MESSAGE_TYPE_UPDATE;
    case 4:
    case "MESSAGE_TYPE_SYNC":
      return MessageType.MESSAGE_TYPE_SYNC;
    case 5:
    case "MESSAGE_TYPE_SYNC_ACCEPT":
      return MessageType.MESSAGE_TYPE_SYNC_ACCEPT;
    case 6:
    case "MESSAGE_TYPE_SYNC_REJECT":
      return MessageType.MESSAGE_TYPE_SYNC_REJECT;
    case 7:
    case "MESSAGE_TYPE_ATTESTATION_UPDATE":
      return MessageType.MESSAGE_TYPE_ATTESTATION_UPDATE;
    case 8:
    case "MESSAGE_TYPE_CUSTOM":
      return MessageType.MESSAGE_TYPE_CUSTOM;
    case 9:
    case "MESSAGE_TYPE_TOPIC_DISCOVERY_REQUEST":
      return MessageType.MESSAGE_TYPE_TOPIC_DISCOVERY_REQUEST;
    case 10:
    case "MESSAGE_TYPE_TOPIC_DISCOVERY_RESPONSE":
      return MessageType.MESSAGE_TYPE_TOPIC_DISCOVERY_RESPONSE;
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
    case MessageType.MESSAGE_TYPE_FETCH_STATE:
      return "MESSAGE_TYPE_FETCH_STATE";
    case MessageType.MESSAGE_TYPE_FETCH_STATE_RESPONSE:
      return "MESSAGE_TYPE_FETCH_STATE_RESPONSE";
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
    case MessageType.MESSAGE_TYPE_TOPIC_DISCOVERY_REQUEST:
      return "MESSAGE_TYPE_TOPIC_DISCOVERY_REQUEST";
    case MessageType.MESSAGE_TYPE_TOPIC_DISCOVERY_RESPONSE:
      return "MESSAGE_TYPE_TOPIC_DISCOVERY_RESPONSE";
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

export interface FetchState {
  objectId: string;
  vertexHash: string;
}

export interface FetchStateResponse {
  objectId: string;
  vertexHash: string;
  aclState: DRPState | undefined;
  drpState: DRPState | undefined;
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
  attestations: AggregatedAttestation[];
  requesting: string[];
}

export interface SyncReject {
}

export interface TopicDiscoveryRequest {
  topic: string;
}

export interface TopicDiscoveryResponse {
  subscribers: { [key: string]: TopicDiscoveryResponse_Subscribers };
}

export interface TopicDiscoveryResponse_Subscribers {
  multiaddrs: string[];
}

export interface TopicDiscoveryResponse_SubscribersEntry {
  key: string;
  value: TopicDiscoveryResponse_Subscribers | undefined;
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

function createBaseFetchState(): FetchState {
  return { objectId: "", vertexHash: "" };
}

export const FetchState: MessageFns<FetchState> = {
  encode(message: FetchState, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.objectId !== "") {
      writer.uint32(10).string(message.objectId);
    }
    if (message.vertexHash !== "") {
      writer.uint32(18).string(message.vertexHash);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): FetchState {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFetchState();
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

          message.vertexHash = reader.string();
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

  fromJSON(object: any): FetchState {
    return {
      objectId: isSet(object.objectId) ? globalThis.String(object.objectId) : "",
      vertexHash: isSet(object.vertexHash) ? globalThis.String(object.vertexHash) : "",
    };
  },

  toJSON(message: FetchState): unknown {
    const obj: any = {};
    if (message.objectId !== "") {
      obj.objectId = message.objectId;
    }
    if (message.vertexHash !== "") {
      obj.vertexHash = message.vertexHash;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FetchState>, I>>(base?: I): FetchState {
    return FetchState.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FetchState>, I>>(object: I): FetchState {
    const message = createBaseFetchState();
    message.objectId = object.objectId ?? "";
    message.vertexHash = object.vertexHash ?? "";
    return message;
  },
};

function createBaseFetchStateResponse(): FetchStateResponse {
  return { objectId: "", vertexHash: "", aclState: undefined, drpState: undefined };
}

export const FetchStateResponse: MessageFns<FetchStateResponse> = {
  encode(message: FetchStateResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.objectId !== "") {
      writer.uint32(10).string(message.objectId);
    }
    if (message.vertexHash !== "") {
      writer.uint32(18).string(message.vertexHash);
    }
    if (message.aclState !== undefined) {
      DRPState.encode(message.aclState, writer.uint32(26).fork()).join();
    }
    if (message.drpState !== undefined) {
      DRPState.encode(message.drpState, writer.uint32(34).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): FetchStateResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFetchStateResponse();
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

          message.vertexHash = reader.string();
          continue;
        }
        case 3: {
          if (tag !== 26) {
            break;
          }

          message.aclState = DRPState.decode(reader, reader.uint32());
          continue;
        }
        case 4: {
          if (tag !== 34) {
            break;
          }

          message.drpState = DRPState.decode(reader, reader.uint32());
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

  fromJSON(object: any): FetchStateResponse {
    return {
      objectId: isSet(object.objectId) ? globalThis.String(object.objectId) : "",
      vertexHash: isSet(object.vertexHash) ? globalThis.String(object.vertexHash) : "",
      aclState: isSet(object.aclState) ? DRPState.fromJSON(object.aclState) : undefined,
      drpState: isSet(object.drpState) ? DRPState.fromJSON(object.drpState) : undefined,
    };
  },

  toJSON(message: FetchStateResponse): unknown {
    const obj: any = {};
    if (message.objectId !== "") {
      obj.objectId = message.objectId;
    }
    if (message.vertexHash !== "") {
      obj.vertexHash = message.vertexHash;
    }
    if (message.aclState !== undefined) {
      obj.aclState = DRPState.toJSON(message.aclState);
    }
    if (message.drpState !== undefined) {
      obj.drpState = DRPState.toJSON(message.drpState);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<FetchStateResponse>, I>>(base?: I): FetchStateResponse {
    return FetchStateResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<FetchStateResponse>, I>>(object: I): FetchStateResponse {
    const message = createBaseFetchStateResponse();
    message.objectId = object.objectId ?? "";
    message.vertexHash = object.vertexHash ?? "";
    message.aclState = (object.aclState !== undefined && object.aclState !== null)
      ? DRPState.fromPartial(object.aclState)
      : undefined;
    message.drpState = (object.drpState !== undefined && object.drpState !== null)
      ? DRPState.fromPartial(object.drpState)
      : undefined;
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
  return { objectId: "", requested: [], attestations: [], requesting: [] };
}

export const SyncAccept: MessageFns<SyncAccept> = {
  encode(message: SyncAccept, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.objectId !== "") {
      writer.uint32(10).string(message.objectId);
    }
    for (const v of message.requested) {
      Vertex.encode(v!, writer.uint32(18).fork()).join();
    }
    for (const v of message.attestations) {
      AggregatedAttestation.encode(v!, writer.uint32(26).fork()).join();
    }
    for (const v of message.requesting) {
      writer.uint32(34).string(v!);
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

          message.attestations.push(AggregatedAttestation.decode(reader, reader.uint32()));
          continue;
        }
        case 4: {
          if (tag !== 34) {
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
      attestations: globalThis.Array.isArray(object?.attestations)
        ? object.attestations.map((e: any) => AggregatedAttestation.fromJSON(e))
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
    if (message.attestations?.length) {
      obj.attestations = message.attestations.map((e) => AggregatedAttestation.toJSON(e));
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
    message.attestations = object.attestations?.map((e) => AggregatedAttestation.fromPartial(e)) || [];
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

function createBaseTopicDiscoveryRequest(): TopicDiscoveryRequest {
  return { topic: "" };
}

export const TopicDiscoveryRequest: MessageFns<TopicDiscoveryRequest> = {
  encode(message: TopicDiscoveryRequest, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.topic !== "") {
      writer.uint32(10).string(message.topic);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): TopicDiscoveryRequest {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTopicDiscoveryRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.topic = reader.string();
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

  fromJSON(object: any): TopicDiscoveryRequest {
    return { topic: isSet(object.topic) ? globalThis.String(object.topic) : "" };
  },

  toJSON(message: TopicDiscoveryRequest): unknown {
    const obj: any = {};
    if (message.topic !== "") {
      obj.topic = message.topic;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TopicDiscoveryRequest>, I>>(base?: I): TopicDiscoveryRequest {
    return TopicDiscoveryRequest.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TopicDiscoveryRequest>, I>>(object: I): TopicDiscoveryRequest {
    const message = createBaseTopicDiscoveryRequest();
    message.topic = object.topic ?? "";
    return message;
  },
};

function createBaseTopicDiscoveryResponse(): TopicDiscoveryResponse {
  return { subscribers: {} };
}

export const TopicDiscoveryResponse: MessageFns<TopicDiscoveryResponse> = {
  encode(message: TopicDiscoveryResponse, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    Object.entries(message.subscribers).forEach(([key, value]) => {
      TopicDiscoveryResponse_SubscribersEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).join();
    });
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): TopicDiscoveryResponse {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTopicDiscoveryResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          const entry1 = TopicDiscoveryResponse_SubscribersEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.subscribers[entry1.key] = entry1.value;
          }
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

  fromJSON(object: any): TopicDiscoveryResponse {
    return {
      subscribers: isObject(object.subscribers)
        ? Object.entries(object.subscribers).reduce<{ [key: string]: TopicDiscoveryResponse_Subscribers }>(
          (acc, [key, value]) => {
            acc[key] = TopicDiscoveryResponse_Subscribers.fromJSON(value);
            return acc;
          },
          {},
        )
        : {},
    };
  },

  toJSON(message: TopicDiscoveryResponse): unknown {
    const obj: any = {};
    if (message.subscribers) {
      const entries = Object.entries(message.subscribers);
      if (entries.length > 0) {
        obj.subscribers = {};
        entries.forEach(([k, v]) => {
          obj.subscribers[k] = TopicDiscoveryResponse_Subscribers.toJSON(v);
        });
      }
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TopicDiscoveryResponse>, I>>(base?: I): TopicDiscoveryResponse {
    return TopicDiscoveryResponse.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TopicDiscoveryResponse>, I>>(object: I): TopicDiscoveryResponse {
    const message = createBaseTopicDiscoveryResponse();
    message.subscribers = Object.entries(object.subscribers ?? {}).reduce<
      { [key: string]: TopicDiscoveryResponse_Subscribers }
    >((acc, [key, value]) => {
      if (value !== undefined) {
        acc[key] = TopicDiscoveryResponse_Subscribers.fromPartial(value);
      }
      return acc;
    }, {});
    return message;
  },
};

function createBaseTopicDiscoveryResponse_Subscribers(): TopicDiscoveryResponse_Subscribers {
  return { multiaddrs: [] };
}

export const TopicDiscoveryResponse_Subscribers: MessageFns<TopicDiscoveryResponse_Subscribers> = {
  encode(message: TopicDiscoveryResponse_Subscribers, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    for (const v of message.multiaddrs) {
      writer.uint32(10).string(v!);
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): TopicDiscoveryResponse_Subscribers {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTopicDiscoveryResponse_Subscribers();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1: {
          if (tag !== 10) {
            break;
          }

          message.multiaddrs.push(reader.string());
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

  fromJSON(object: any): TopicDiscoveryResponse_Subscribers {
    return {
      multiaddrs: globalThis.Array.isArray(object?.multiaddrs)
        ? object.multiaddrs.map((e: any) => globalThis.String(e))
        : [],
    };
  },

  toJSON(message: TopicDiscoveryResponse_Subscribers): unknown {
    const obj: any = {};
    if (message.multiaddrs?.length) {
      obj.multiaddrs = message.multiaddrs;
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TopicDiscoveryResponse_Subscribers>, I>>(
    base?: I,
  ): TopicDiscoveryResponse_Subscribers {
    return TopicDiscoveryResponse_Subscribers.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TopicDiscoveryResponse_Subscribers>, I>>(
    object: I,
  ): TopicDiscoveryResponse_Subscribers {
    const message = createBaseTopicDiscoveryResponse_Subscribers();
    message.multiaddrs = object.multiaddrs?.map((e) => e) || [];
    return message;
  },
};

function createBaseTopicDiscoveryResponse_SubscribersEntry(): TopicDiscoveryResponse_SubscribersEntry {
  return { key: "", value: undefined };
}

export const TopicDiscoveryResponse_SubscribersEntry: MessageFns<TopicDiscoveryResponse_SubscribersEntry> = {
  encode(message: TopicDiscoveryResponse_SubscribersEntry, writer: BinaryWriter = new BinaryWriter()): BinaryWriter {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      TopicDiscoveryResponse_Subscribers.encode(message.value, writer.uint32(18).fork()).join();
    }
    return writer;
  },

  decode(input: BinaryReader | Uint8Array, length?: number): TopicDiscoveryResponse_SubscribersEntry {
    const reader = input instanceof BinaryReader ? input : new BinaryReader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseTopicDiscoveryResponse_SubscribersEntry();
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

          message.value = TopicDiscoveryResponse_Subscribers.decode(reader, reader.uint32());
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

  fromJSON(object: any): TopicDiscoveryResponse_SubscribersEntry {
    return {
      key: isSet(object.key) ? globalThis.String(object.key) : "",
      value: isSet(object.value) ? TopicDiscoveryResponse_Subscribers.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: TopicDiscoveryResponse_SubscribersEntry): unknown {
    const obj: any = {};
    if (message.key !== "") {
      obj.key = message.key;
    }
    if (message.value !== undefined) {
      obj.value = TopicDiscoveryResponse_Subscribers.toJSON(message.value);
    }
    return obj;
  },

  create<I extends Exact<DeepPartial<TopicDiscoveryResponse_SubscribersEntry>, I>>(
    base?: I,
  ): TopicDiscoveryResponse_SubscribersEntry {
    return TopicDiscoveryResponse_SubscribersEntry.fromPartial(base ?? ({} as any));
  },
  fromPartial<I extends Exact<DeepPartial<TopicDiscoveryResponse_SubscribersEntry>, I>>(
    object: I,
  ): TopicDiscoveryResponse_SubscribersEntry {
    const message = createBaseTopicDiscoveryResponse_SubscribersEntry();
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? TopicDiscoveryResponse_Subscribers.fromPartial(object.value)
      : undefined;
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

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
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
