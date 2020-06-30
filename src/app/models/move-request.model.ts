import { GameState } from './game-state.model';

export class MoveRequest {
    boardFen: string;
    isRealTime: boolean;
    incrementSeconds: number;
    remainingSeconds: number;
}