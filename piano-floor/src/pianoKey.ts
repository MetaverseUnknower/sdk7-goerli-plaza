import * as utils from '@dcl-sdk/utils'
import { AudioSource, Entity, Material, MeshRenderer, Transform, engine, PBAudioSource } from '@dcl/sdk/ecs'
import { Color4, Vector3 } from '@dcl/sdk/math'
import { AudioController } from './audioController'
import { getUserId } from './userData'
import { sceneMessageBus } from './sceneBus'

export const whiteKeys: WhitePianoKey[] = []
export const blackKeys: BlackPianoKey[] = []
const playerEntity: Entity = engine.PlayerEntity

const BLACK_LAYER = utils.LAYER_2
const WHITE_LAYER = utils.LAYER_3
const PLAYER_LAYER = utils.triggers.getLayerMask(playerEntity)
utils.triggers.setTriggeredByMask(playerEntity, 2 || 3)

interface CustomPBAudioSource extends PBAudioSource {
  isBlackKey?: boolean
}

export class WhitePianoKey {
  public whiteKeyEntity: Entity
  public audioEntity: Entity
  onColor: Color4
  offColor: Color4
  note: number = 0
  isBlackKey: boolean = false
  parent?: Entity
  pressed: boolean = false
  sound: string;
  pitch: number;
  public playersPressing: string[] = []

  constructor(position: Vector3, scale: Vector3, sound: string, note: number = 0, pitch: number) {
    this.whiteKeyEntity = engine.addEntity()
    this.audioEntity = AudioController.createAudioEntity(sound, pitch);
    this.sound = sound
    this.pitch = pitch
    this.note = note
    this.offColor = Color4.White()
    this.onColor = Color4.Yellow()

    MeshRenderer.setBox(this.whiteKeyEntity)
    Transform.create(this.whiteKeyEntity, {
      position: position,
      scale: scale,
    })
    Transform.create(this.audioEntity, {
      position: position,
      scale: scale,
    })

    AudioSource.create(this.whiteKeyEntity, {
      audioClipUrl: sound,
      loop: false,
      playing: false,
      pitch: pitch,
      isBlackKey: false
    } as CustomPBAudioSource)

    this.createWhiteKeyTrigger(position, scale, this.audioEntity)

    Material.setPbrMaterial(this.whiteKeyEntity, {
      albedoColor: this.playersPressing.length > 0 ? this.onColor : this.offColor,
      emissiveColor: this.playersPressing.length > 0 ? this.onColor : this.offColor,
      emissiveIntensity: 1,
      specularIntensity: 1,
      roughness: 0.5,
      metallic: 0.2
    })
    whiteKeys.push(this)
  }

  play: CallableFunction = (userId?: string): void => {
    if (userId && !this.playersPressing.includes(userId)) {
      this.playersPressing.push(userId)
    }
    console.log('players pressing this key: ', this.pressed, this.playersPressing)
    AudioSource.getMutable(this.audioEntity).playing = true
    if (this.pressed) return;
    this.pressed = true
    Material.setPbrMaterial(this.whiteKeyEntity, {
      albedoColor: this.onColor,
      emissiveColor: this.onColor,
      emissiveIntensity: 1,
      specularIntensity: 1,
      roughness: 0.5,
      metallic: 0.2
    })
    const entityTransform = Transform.getMutable(this.whiteKeyEntity);
    entityTransform.position.y -= entityTransform.scale.y;
  }

  end: CallableFunction = (userId?: string): void => {
    if (userId) {
      this.playersPressing = this.playersPressing.filter((id) => id !== userId)
    }
    AudioSource.getMutable(this.audioEntity).playing = false
    if (!this.pressed || this.playersPressing.length > 0) return;
    this.pressed = false
    Material.setPbrMaterial(this.whiteKeyEntity, {
      albedoColor: this.offColor,
      emissiveColor: this.offColor,
      emissiveIntensity: 1,
      specularIntensity: 1,
      roughness: 0.5,
      metallic: 0.2
    })
    const entityTransform = Transform.getMutable(this.whiteKeyEntity)
    entityTransform.position.y += entityTransform.scale.y
  }

  createWhiteKeyTrigger(triggerPosition: Vector3, triggerScale: Vector3, audioEntity: Entity): void {
    const { position, scale } = Transform.get(this.whiteKeyEntity)

    triggerPosition = Vector3.create(0, 0.25, 0)
    triggerScale = Vector3.create(scale.x, scale.y, scale.z)

    utils.triggers.addTrigger(
      this.whiteKeyEntity,
      WHITE_LAYER,
      PLAYER_LAYER,
      [
        {
          type: 'box',
          position: triggerPosition,
          scale: triggerScale
        }
      ],
      // on camera enter
      async () => {
        console.log('enter white key trigger: ')
        const userId = await getUserId()
        sceneMessageBus.emit('noteOn', { userId, note: this.note, keyEntity: this.whiteKeyEntity, audioEntity, position, scale })
      },
      // on camera exit
      async () => {
        console.log('exit white key trigger: ')
        const userId = await getUserId()
        sceneMessageBus.emit('noteOff', { userId, note: this.note, keyEntity: this.whiteKeyEntity, audioEntity, position, scale })
      },
      Color4.Blue() // debug
    )
  }
}

export class BlackPianoKey {
  public blackKeyEntity: Entity
  onColor2: Color4
  offColor: Color4
  note: number = 0
  isBlackKey: Boolean = true
  audioEntity: Entity
  playersPressing: string[] = []
  pressed: boolean = false

  constructor(position: Vector3, scale: Vector3, sound: string, note: number = 0, pitch: number) {
    this.blackKeyEntity = engine.addEntity()
    this.audioEntity = AudioController.createAudioEntity(sound, pitch)
    this.note = note
    Transform.createOrReplace(this.blackKeyEntity, {
      position: position,
      scale: scale,
    })
    Transform.create(this.audioEntity, {
      position: position,
      scale: scale,
    })


    MeshRenderer.setBox(this.blackKeyEntity)
    this.offColor = Color4.Black()
    this.onColor2 = Color4.Yellow()
    this.createBlackKeyTrigger(position, scale, this.audioEntity)

    Material.setPbrMaterial(this.blackKeyEntity, {
      albedoColor: this.offColor,
      emissiveColor: this.offColor,
      emissiveIntensity: 0,
      specularIntensity: 0,
      roughness: 0.5,
      metallic: 0.2
    })

    AudioSource.create(this.blackKeyEntity, {
      audioClipUrl: sound,
      loop: false,
      playing: false,
      pitch: pitch,
      isBlackKey: true
    } as CustomPBAudioSource)

    blackKeys.push(this)
  }

  play: CallableFunction = (userId?: string): void => {
    if (userId && !this.playersPressing.includes(userId)) {
      this.playersPressing.push(userId)
    }
    console.log('players pressing this key: ', this.pressed, this.playersPressing)
    AudioSource.getMutable(this.audioEntity).playing = true
    if (this.pressed) return;
    this.pressed = true
    Material.setPbrMaterial(this.blackKeyEntity, {
      albedoColor: this.onColor2,
      emissiveColor: this.onColor2,
      emissiveIntensity: 2,
      specularIntensity: 1,
      roughness: 0.5,
      metallic: 0.2
    })
    const entityTransform = Transform.getMutable(this.blackKeyEntity);
    entityTransform.position.y -= entityTransform.scale.y;

    AudioSource.getMutable(this.audioEntity).playing = true
  }

  end: CallableFunction = (userId?: string): void => {
    if (userId) {
      this.playersPressing = this.playersPressing.filter((id) => id !== userId)
    }
    if (!this.pressed || this.playersPressing.length > 0) return;
    this.pressed = false
    Material.setPbrMaterial(this.blackKeyEntity, {
      albedoColor: this.offColor,
      emissiveColor: this.offColor,
      emissiveIntensity: 2,
      specularIntensity: 1,
      roughness: 0.5,
      metallic: 0.2
    })
    const entityTransform = Transform.getMutable(this.blackKeyEntity)
    entityTransform.position.y += entityTransform.scale.y

    AudioSource.getMutable(this.audioEntity).playing = false
  }

  createBlackKeyTrigger(triggerPosition: Vector3, triggerScale: Vector3, audioEntity: Entity): void {
    const { position, scale } = Transform.get(this.blackKeyEntity)

    triggerPosition = Vector3.create(0, 0.25, 0)
    triggerScale = Vector3.create(scale.x, scale.y, scale.z)

    utils.triggers.addTrigger(
      this.blackKeyEntity,
      BLACK_LAYER,
      PLAYER_LAYER,
      [
        {
          type: 'box',
          position: triggerPosition,
          scale: triggerScale
        }
      ],
      // on camera enter
      async () => {
        console.log('enter black key trigger: ')
        const userId = await getUserId()
        sceneMessageBus.emit('noteOn', { userId, note: this.note, keyEntity: this.blackKeyEntity, audioEntity, position, scale, isBlackKey: true })
      },
      // on camera exit
      async () => {
        console.log('exit black key trigger: ')
        const userId = await getUserId()
        sceneMessageBus.emit('noteOff', { userId, note: this.note, keyEntity: this.blackKeyEntity, audioEntity, position, scale, isBlackKey: true })
      },
      Color4.Red() // debug
    )
  }
}
