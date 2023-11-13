/* 
To add a new key, copy this snippet into the keys resources.ts:
  {
    position: { x: 2, y: 0.11, z: 4 },   // position of the key
    scale: { x: 3.8, y: 0.2, z: 8 },    // scale of the key
    sound: 'sounds/whiteKeys/c4.mp3',   // path to sound file
    pitch: -12                          // number of semitones to pitch shift the sound file
  },
 */

export default {
  keys: {
    white: [
      { // C3
        position: { x: 2, y: 0.11, z: 4 },
        scale: { x: 3.8, y: 0.2, z: 8 },
        sound: 'sounds/whiteKeys/c4.mp3',
        pitch: -12
      },
      { // D3
        position: { x: 6, y: 0.11, z: 4 },
        scale: { x: 3.8, y: 0.2, z: 8 },
        sound: 'sounds/whiteKeys/c4.mp3',
        pitch: -10
      },
      { // E3
        position: { x: 10, y: 0.11, z: 4 },
        scale: { x: 3.8, y: 0.2, z: 8 },
        sound: 'sounds/whiteKeys/c4.mp3',
        pitch: -8
      },
      { // F3
        position: { x: 14, y: 0.11, z: 4 },
        scale: { x: 3.8, y: 0.2, z: 8 },
        sound: 'sounds/whiteKeys/c4.mp3',
        pitch: -7
      },
      { // G3
        position: { x: 18, y: 0.11, z: 4 },
        scale: { x: 3.8, y: 0.2, z: 8 },
        sound: 'sounds/whiteKeys/c4.mp3',
        pitch: -5
      },
      { // A3
        position: { x: 22, y: 0.11, z: 4 },
        scale: { x: 3.8, y: 0.2, z: 8 },
        sound: 'sounds/whiteKeys/c4.mp3',
        pitch: -3
      },
      { // B3
        position: { x: 26, y: 0.11, z: 4 },
        scale: { x: 3.8, y: 0.2, z: 8 },
        sound: 'sounds/whiteKeys/c4.mp3',
        pitch: -1
      },
      { // C4
        position: { x: 30, y: 0.11, z: 4 },
        scale: { x: 3.8, y: 0.2, z: 8 },
        sound: 'sounds/whiteKeys/c4.mp3',
        pitch: 0
      },

    ],
    black: [
      { // C#3
        position: { x: 4, y: 0.11, z: 12 },
        scale: { x: 3.8, y: 0.2, z: 8 },
        sound: 'sounds/blackKeys/aSharp3.mp3',
        pitch: -9
      },
      { // D#3
        position: { x: 8, y: 0.11, z: 12 },
        scale: { x: 3.8, y: 0.2, z: 8 },
        sound: 'sounds/blackKeys/aSharp3.mp3',
        pitch: -7
      },
      { // F#3
        position: { x: 16, y: 0.11, z: 12 },
        scale: { x: 3.8, y: 0.2, z: 8 },
        sound: 'sounds/blackKeys/aSharp3.mp3',
        pitch: -4
      },
      { // G#3
        position: { x: 20, y: 0.11, z: 12 },
        scale: { x: 3.8, y: 0.2, z: 8 },
        sound: 'sounds/blackKeys/aSharp3.mp3',
        pitch: -2
      },
      { // A#3
        position: { x: 24, y: 0.11, z: 12 },
        scale: { x: 3.8, y: 0.2, z: 8 },
        sound: 'sounds/blackKeys/aSharp3.mp3',
        pitch: 0
      },

    ]
  }
}
