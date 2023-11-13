import { Color4, Quaternion, Vector3 } from '@dcl/sdk/math'
import { BlackPianoKey, WhitePianoKey } from './pianoKey'
import resources from './resources'
import { requestKeyStates, setUpEvents } from './sceneBus';
import { Material, MeshRenderer, Transform, engine } from '@dcl/sdk/ecs';

/*
  Set up key positions and sizes in resources.ts
*/

function createWhiteKeys() {
  resources.keys.white.forEach((key, index) => {
    const { position, scale } = key
    new WhitePianoKey(
      Vector3.create(position.x, position.y, position.z),
      Vector3.create(scale.x, scale.y, scale.z),
      key.sound,
      index,
      key.pitch
    )
  })
}

function createBlackKeys() {
  resources.keys.black.forEach((key, index) => {
    const { position, scale } = key
    new BlackPianoKey(
      Vector3.create(position.x, position.y, position.z),
      Vector3.create(scale.x, scale.y, scale.z),
      key.sound,
      index,
      key.pitch
    )
  })
}

export function main() {
  const floorEntity = engine.addEntity();
  MeshRenderer.setPlane(floorEntity);
  Transform.create(floorEntity, {
    position: Vector3.create(16, 0, 8),
    rotation: Quaternion.fromEulerDegrees(90, 90, 90),
    scale: Vector3.create(32, 16, 16),
  });
  Material.setPbrMaterial(floorEntity, {
    albedoColor: Color4.Gray()
  });

  setUpEvents();
  createWhiteKeys()
  createBlackKeys()
  requestKeyStates()
}

// utils.triggers.enableDebugDraw(true); // To debug trigger areas

// UI with GitHub link
// setupUi()


