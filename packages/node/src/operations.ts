import { TopologyObject } from "@topology-foundation/object";
import { TopologyNode } from ".";
import { Message, Message_MessageType } from "@topology-foundation/network";

/* Object operations */
export enum OPERATIONS {
  /* Create a new CRO */
  CREATE,
  /* Update operation on a CRO */
  UPDATE,

  /* Subscribe to a PubSub group (either CRO or custom) */
  SUBSCRIBE,
  /* Unsubscribe from a PubSub group */
  UNSUBSCRIBE,

  /* Actively send the CRO RIBLT to a random peer */
  SYNC
}

export function executeObjectOperation(node: TopologyNode, operation: OPERATIONS, data: Uint8Array) {
  switch (operation) {
    case OPERATIONS.CREATE:
      // data = CRO
      createObject(node, data);
      break;
    case OPERATIONS.UPDATE:
      // data = [CRO_ID, OPERATION]
      updateObject(node, data)
      break;
    case OPERATIONS.SUBSCRIBE:
      // data = CRO_ID
      subscribeObject(node, data)
      break;
    case OPERATIONS.UNSUBSCRIBE:
      // data = CRO_ID
      unsubscribeObject(node, data)
      break;
    case OPERATIONS.SYNC:
      // data = CRO
      // TODO: data = [CRO_ID, RIBLT]
      syncObject(node, data)
      break;
    default:
      console.error("topology::node::executeObjectOperation", "Invalid operation");
      break;
  }
}

function createObject(node: TopologyNode, data: Uint8Array) {
  const object = TopologyObject.decode(data)
  node.networkNode.subscribe(object.id);
  node.objectStore.put(object.id, object);
}

function updateObject(node: TopologyNode, data: Uint8Array) {
  // TODO: should just send the object diff, not the full object
  // this is handler, we want the action of sending
  const object = TopologyObject.decode(data)
  node.objectStore.put(object.id, object);

  const message = Message.create({
    type: Message_MessageType.UPDATE,
    data: data
  });

  node.networkNode.broadcastMessage(
    object.id,
    message,
  );
}

function subscribeObject(node: TopologyNode, data: Uint8Array) {
  // process data as only the object id and not the full obj
  const object = TopologyObject.decode(data)
  node.networkNode.subscribe(object.id);
}

function unsubscribeObject(node: TopologyNode, data: Uint8Array) {
  // process data as only the object id and not the full obj
  const object = TopologyObject.decode(data)
  node.networkNode.unsubscribe(object.id);
}

function syncObject(node: TopologyNode, data: Uint8Array) {
  // Send sync request to a random peer
  const object = TopologyObject.decode(data)

  const message = Message.create({
    type: Message_MessageType.SYNC,
    data: data
  })

  // TODO: check how to do it better
  node.networkNode.sendGroupMessageRandomPeer(object.id, ["/topology/message"], message)
}
