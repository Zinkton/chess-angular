export class MoveRequest {
    boardFen: string;
    isRealTime: boolean;
    incrementSeconds: number;
    remainingSeconds: number;
    isCasual: boolean;
    depth: number;
}