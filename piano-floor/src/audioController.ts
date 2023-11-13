import { engine, AudioSource, Entity } from '@dcl/sdk/ecs'

export class AudioController {
  public static createAudioEntity: CallableFunction = (audioClipUrl: string, pitch: number): Entity => {
    const audioEntity = engine.addEntity()
    console.log('creating audio entity', audioClipUrl, pitch)
    console.log(typeof audioClipUrl)
    AudioSource.create(audioEntity, {
      audioClipUrl,
      loop: false,
      playing: false,
      pitch: this.semitoneToPercentage(pitch),
      volume: 1
    })
    console.log('audio entity created', audioEntity, AudioSource.getMutable(audioEntity))
    return audioEntity
  }

  static semitoneToPercentage(semitones: number): number {
    // If semitones is 0, return 100% (or 1)
    if (semitones === 0) {
      return 1;
    }

    let percentage = Math.pow(2, semitones / 12);
    return percentage;
  }
}
