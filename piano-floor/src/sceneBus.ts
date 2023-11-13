import { MessageBus } from "@dcl/sdk/message-bus"
import { getUserId } from "./userData"
import { BlackPianoKey, WhitePianoKey, blackKeys, whiteKeys } from "./pianoKey"
import { onPlayerDisconnectedObservable } from "@dcl/sdk/observables"
import { executeTask } from "@dcl/sdk/ecs"

export const sceneMessageBus = new MessageBus()

export async function requestKeyStates() {
    console.log('requesting key states')
    const userId = await getUserId()
    sceneMessageBus.emit('requestKeyStates', { userId })
}

export async function sendKeyStates() {
    const userId = await getUserId()
    sceneMessageBus.emit('sendKeyStates', { whiteKeyStates: whiteKeys, blackKeyStates: blackKeys, userId })
}

export function setUpEvents() {
    sceneMessageBus.on('sendKeyStates', async (e) => {
        console.log(`received key states from ${e.userId}`, e)
        if (!e.whiteKeyStates || !e.blackKeyStates) return;
        e.whiteKeyStates.forEach((key: WhitePianoKey, index: number) => {
            if (key.playersPressing.length > 0) {
                whiteKeys[index].playersPressing = key.playersPressing;
                whiteKeys[index].play()
            }
        })
        e.blackKeyStates.forEach((key: BlackPianoKey, index: number) => {
            if (key.playersPressing.length > 0) {
                blackKeys[index].playersPressing = key.playersPressing;
                blackKeys[index].play()
            }
        })
    })

    sceneMessageBus.on('requestKeyStates', (e) => {
        console.log(e.userId, 'requested key states')
        executeTask(async () => {
            let userId = await getUserId();
            if (e.userId !== userId) {
                sendKeyStates();
            } else {
                console.log('requested key states from self')
            }
        })
    })

    onPlayerDisconnectedObservable.add((e) => {
        console.log('player disconnected', e.userId)
        whiteKeys.forEach((key: WhitePianoKey, index: number) => {
            if (key.playersPressing.includes(e.userId)) {
                whiteKeys[index].playersPressing = whiteKeys[index].playersPressing.filter((playerId: string) => playerId !== e.userId)
            }
            if (key.playersPressing.length === 0) {
                whiteKeys[index].end()
            }
        })
        blackKeys.forEach((key: BlackPianoKey, index: number) => {
            if (key.playersPressing.includes(e.userId)) {
                blackKeys[index].playersPressing = blackKeys[index].playersPressing.filter((playerId: string) => playerId !== e.userId)
            }
            if (key.playersPressing.length === 0) {
                blackKeys[index].end()
            }
        })
    })

    sceneMessageBus.on('noteOn', async (e) => {
        if (e.isBlackKey) {
            const blackKey = blackKeys[e.note]
            if (blackKey) {
                blackKey.play(e.userId)
            }
        } else {
            const whiteKey = whiteKeys[e.note]
            if (whiteKey) {
                whiteKey.play(e.userId)
            }
        }
    })

    sceneMessageBus.on('noteOff', (e) => {

        if (e.isBlackKey) {
            const blackKey = blackKeys[e.note]
            if (blackKey) {
                blackKey.end(e.userId)
            }
        } else {
            const whiteKey = whiteKeys[e.note]
            if (whiteKey) {
                whiteKey.end(e.userId)
            }
        }
    })
}