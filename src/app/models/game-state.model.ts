export class GameState {
    public turnHistory: Array<string>;
    public whitePlayerRemainingSeconds: number;
    public blackPlayerRemainingSeconds: number;
    public timeIncrement: number;
    public whiteLostMaterialList: Array<string>;
    public blackLostMaterialList: Array<string>;
    public board: Array<string>;
    public isWhiteKingCastleAllowed: boolean;
    public isWhiteQueenCastleAllowed: boolean;
    public isBlackKingCastleAllowed: boolean;
    public isBlackQueenCastleAllowed: boolean;
    public isWhiteToMove: boolean;
    public isGameOver: boolean;
}