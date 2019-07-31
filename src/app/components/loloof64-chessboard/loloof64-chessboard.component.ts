import {
  Component, OnInit, OnDestroy, Renderer2, ElementRef, Input, Output, ViewChild,
  OnChanges, SimpleChanges, EventEmitter
} from '@angular/core';
import { Subscription } from 'rxjs';
import { Loloof64ChessLogicService, ChessCell } from '../../services/loloof64-chess-logic.service';
import { ModalController, ToastController } from '@ionic/angular';
import { Loloof64ChessEngineCommunicationService } from '../../services/loloof64-chess-engine-communication.service';
import { Loloof64ChessPromotionPage } from '../../pages/loloof64-chess-promotion/loloof64-chess-promotion.page';
import { PlayerType } from './PlayerType';

@Component({
  selector: 'loloof64-chessboard',
  templateUrl: './loloof64-chessboard.component.html',
  styleUrls: ['./loloof64-chessboard.component.scss'],
  providers: [Loloof64ChessLogicService],
})
export class Loloof64ChessboardComponent implements OnInit, OnChanges, OnDestroy {

  @Input() size = 200.0;
  @Input() reversed = false;

  @Output() public gotReady: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('root') root: ElementRef;
  @ViewChild('click_zone') clickZone: ElementRef;
  @ViewChild('dndPiece') dndPiece: ElementRef;
  @ViewChild('horizontalGuide') horizontalGuide: ElementRef;
  @ViewChild('verticalGuide') verticalGuide: ElementRef;

  private dndHighlightedCell: ChessCell = null;
  private dndHoveringCell: ChessCell = null;
  private gameInProgress = false;
  private onEngineLayerMessageSubscription: Subscription;
  private engineIsReady = false;

  private whitePlayerType: PlayerType;
  private blackPlayerType: PlayerType;
  private computerIsThinking = false;

  allFilesCoordinates: string [] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  allRanksCoordinates: string [] = ['1', '2', '3', '4', '5', '6', '7', '8'];

  /**
   * 1st dimension => rank : always from 1 to 8
   * 2nd dimension => file : always from A to H
   */
  piecesValues: string [][];

  constructor(
    private renderer: Renderer2,
    private chessService: Loloof64ChessLogicService,
    private modalController: ModalController,
    private toastController: ToastController,
    private engineCommunicationLayer: Loloof64ChessEngineCommunicationService,
  ) { }

  ngOnInit() {
    this.updateRenderSize();
    this.piecesValues = this.piecesValuesFromPosition();
    this.onEngineLayerMessageSubscription = this.engineCommunicationLayer.
      onMessage$.subscribe(event => this.messageReceivedFromEngine(event));
  }

  ngOnDestroy() {
    this.onEngineLayerMessageSubscription.unsubscribe();
  }

  ngOnChanges(changes: SimpleChanges) {
    const sizeChange = changes.size;
    if (sizeChange !== undefined) {
      this.updateRenderSize();
    }
  }

  private updateRenderSize = () => {
    this.renderer.setStyle(this.root.nativeElement, 'width', this.size + 'px');
    this.renderer.setStyle(this.root.nativeElement, 'height', this.size + 'px');

    this.renderer.setStyle(this.clickZone.nativeElement, 'width', this.size + 'px');
    this.renderer.setStyle(this.clickZone.nativeElement, 'height', this.size + 'px');
  }

  fileCoordinate = (file: number): string => {
    return this.allFilesCoordinates[this.reversed ? 7 - file : file];
  }

  rankCoordinate = (rank: number): string => {
    return this.allRanksCoordinates[this.reversed ? rank : 7 - rank];
  }

  imageDefinedFor = (file: number, rank: number): boolean => {
    return this.piecesValues !== undefined && this.piecesValues[rank][file] !== undefined;
  }

  pieceSize = (): number => {
    return this.size * 0.1;
  }

  coordinateFontSize = (): number => {
    return this.size * 0.04;
  }

  turnClass = (): string => {
    const currentPosition = this.chessService.getCurrentPosition();
    const blackToPlay = currentPosition.split(' ')[1].charAt(0) === 'b';
    return blackToPlay ? 'turn-black' : 'turn-white';
  }

  private piecesValuesFromPosition = (): string[][] => {
    const currentPosition = this.chessService.getCurrentPosition();
    let boardValues = currentPosition.split(' ')[0].split('/').reverse();

    let result = [];

    for (let rank = 0; rank < 8; rank++) {
      let line = [];

      let file = 0;
      let charPosition = 0;

      while (file < 8) {
        const currentValue = boardValues[rank][charPosition];
        const valueAsDigit = currentValue.charCodeAt(0) - '0'.charCodeAt(0);
        const isCorrectDigitValue = valueAsDigit >= 0 && valueAsDigit <= 9;

        if (isCorrectDigitValue) {
          // clearing as many cells as valueAsDigit requires
          for (let i = 0; i < valueAsDigit; i++) {
            line.push(undefined);
            file++;
          }
        } else {
          line.push(currentValue);
          file++;
        }

        charPosition++;
      }

      result.push(line);
    }

    return result;
  }

  getFile = (col: number) => {
    return this.reversed ? 7 - col : col;
  }

  getRank = (row: number) => {
    return this.reversed ? row : 7 - row;
  }

  getPieceValue = (col: number, row: number) => {
    return this.piecesValues[this.getRank(row)][this.getFile(col)];
  }

  isDndHighlighted = (col: number, row: number) => {
    if (this.dndHighlightedCell === null) { return false; }
    if (this.dndHighlightedCell.file !== this.getFile(col)) { return false; }
    if (this.dndHighlightedCell.rank !== this.getRank(row)) { return false; }
    return true;
  }

  isDndHoveringCell = (col: number, row: number) => {
    if (this.dndHoveringCell === null) { return false; }
    if (this.dndHoveringCell.file !== this.getFile(col)) { return false; }
    if (this.dndHoveringCell.rank !== this.getRank(row)) { return false; }
    return true;
  }

  dragStart = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if ( ! this.gameInProgress ) { return; }
    if (this.computerIsThinking) { return; }

    const boardRawCoordinates = this.touchEventToBoardRawCoordinate(event);
    const coordinatesInBoard = boardRawCoordinates !== undefined &&
      boardRawCoordinates.col >= 0 && boardRawCoordinates.col <= 7 &&
      boardRawCoordinates.row >= 0 && boardRawCoordinates.row <= 7;


    if (coordinatesInBoard) {
      const pieceValue = this.piecesValues[this.getRank(boardRawCoordinates.row)][this.getFile(boardRawCoordinates.col)];
      const isLegalPieceValue = 'PNBRQKpnbrqk'.split('').includes(pieceValue);

      if ( ! isLegalPieceValue ) { return; }

      const isWhitePiece = pieceValue.charCodeAt(0) >= 'A'.charCodeAt(0) &&
        pieceValue.charCodeAt(0) <= 'Z'.charCodeAt(0);
      const pieceOfOurs = this.chessService.isWhiteTurn() === isWhitePiece;
      if (! pieceOfOurs) { return; }

      this.dndHighlightedCell = {
        file: this.getFile(boardRawCoordinates.col),
        rank: this.getRank(boardRawCoordinates.row)
      };

      this.dndHoveringCell = {
        file: this.getFile(boardRawCoordinates.col),
        rank: this.getRank(boardRawCoordinates.row)
      };
    }
    
  }

  dragEnd = async (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    const dragAndDropStarted =
      ![null, undefined].includes(this.dndHighlightedCell) &&
      ![null, undefined].includes(this.dndHoveringCell);

    if (! dragAndDropStarted) { return; }

    if (this.isPromotionMove()) {
      const modal = await this.modalController.create({
        component: Loloof64ChessPromotionPage,
        componentProps: {
          whiteTurn: this.chessService.isWhiteTurn(),
          callback: this.validatePromotion,
        }
      });
      modal.present();
      return;
    }

    const legalMove = await this.chessService.checkAndDoMove(this.dndHighlightedCell, this.dndHoveringCell);
    if (legalMove) {
      this.commitHumanMove();
    }

    this.dndHighlightedCell = null;
    this.dndHoveringCell = null;
  }


  dragMove = (event: any) => {
    event.preventDefault();
    event.stopPropagation();

    if (!this.dndHasStarted()) {
      return;
    }

    const clickZoneLocation = this.clickZone.nativeElement.getBoundingClientRect();
    const touch = event.touches[0];
    const cellSize = this.size / 9.0;

    const col = Math.floor((touch.clientX - clickZoneLocation.left - cellSize * 0.5) / cellSize);
    const row = Math.floor((touch.clientY - clickZoneLocation.top - cellSize * 0.5) / cellSize);

    const goingOutOfBoard = col < 0 || col > 7 || row < 0 || row > 7;
    if (goingOutOfBoard) {
      // cancelling the DnD
      this.dndHighlightedCell = null;
      this.dndHoveringCell = null;
      return;
    }

    this.dndHoveringCell = {
      file: this.getFile(col),
      rank: this.getRank(row)
    };

    if (this.dndPiece !== null) {
      const left = cellSize * (0.5 + col);
      const top = cellSize * (0.5 + row);

      this.renderer.setStyle(this.dndPiece.nativeElement, 'left', left + 'px');
      this.renderer.setStyle(this.dndPiece.nativeElement, 'top', top + 'px');
      this.renderer.setStyle(this.dndPiece.nativeElement, 'width', cellSize + 'px');
      this.renderer.setStyle(this.dndPiece.nativeElement, 'height', cellSize + 'px');
    }

    if (this.horizontalGuide != null) {
      const left = cellSize * 0.5;
      const top = cellSize * (row + 0.75);
      const width = cellSize * 8;
      const height = cellSize * 0.5;

      this.renderer.setStyle(this.horizontalGuide.nativeElement, 'left', left + 'px');
      this.renderer.setStyle(this.horizontalGuide.nativeElement, 'top', top + 'px');
      this.renderer.setStyle(this.horizontalGuide.nativeElement, 'width', width + 'px');
      this.renderer.setStyle(this.horizontalGuide.nativeElement, 'height', height + 'px');
    }

    if (this.verticalGuide != null) {
      const left = cellSize * (col + 0.75);
      const top = cellSize * 0.5;
      const width = cellSize * 0.5;
      const height = cellSize * 8;

      this.renderer.setStyle(this.verticalGuide.nativeElement, 'left', left + 'px');
      this.renderer.setStyle(this.verticalGuide.nativeElement, 'top', top + 'px');
      this.renderer.setStyle(this.verticalGuide.nativeElement, 'width', width + 'px');
      this.renderer.setStyle(this.verticalGuide.nativeElement, 'height', height + 'px');
    }
  }

  validatePromotion = async (value: string) => {
    this.modalController.dismiss();
    const legalMove = await this.chessService.checkAndDoMoveWithPromotion(
      this.dndHighlightedCell,
      this.dndHoveringCell,
      value,
    );
    if (legalMove) {
      this.commitHumanMove();
    }

    this.dndHighlightedCell = null;
    this.dndHoveringCell = null;
  }

  dndHasStarted = () => {
    return ![null, undefined].includes(this.dndHighlightedCell);
  }

  dndPieceImageSrc = () => {
    const dndPieceValue = this.piecesValues[this.dndHighlightedCell.rank][this.dndHighlightedCell.file];
    return this.getPieceRawPath(dndPieceValue);
  }

  startNewGame = (white: PlayerType, black: PlayerType, startPosition: string) => {
    this.whitePlayerType = white;
    this.blackPlayerType = black;
    if (startPosition) {
      this.chessService.newGame(startPosition);
    } else {
      this.chessService.newGame();
    }
    this.piecesValues = this.piecesValuesFromPosition();
    this.engineCommunicationLayer.postMessage('ucinewgame');
    this.engineCommunicationLayer.postMessage(
      `position ${startPosition !== undefined ? 'fen ' + startPosition : 'startpos'}`
    );

    this.askComputerMoveIfAppropriate();
    this.gameInProgress = true;
  }

  askComputerMoveIfAppropriate = () => {
    const whiteToPlay = this.chessService.isWhiteTurn();
    const computerToPlay = (whiteToPlay && this.whitePlayerType === PlayerType.Computer) ||
      (!whiteToPlay && this.blackPlayerType === PlayerType.Computer);

    if (! computerToPlay) { return; }

    this.computerIsThinking = true;

    const currentPosition = this.chessService.getCurrentPosition();
    this.engineCommunicationLayer.postMessage(
      `position fen ${currentPosition}`
    );
    this.engineCommunicationLayer.postMessage(
      'go depth 12'
    );
  }

  private touchEventToBoardRawCoordinate = (event: any) => {
    const cellSize = (this.size / 9.0);
    const halfCellSize = cellSize / 2.0;

    const eventTouch = event.touches[0];

    const clickBounds = this.clickZone.nativeElement.getBoundingClientRect();

    const col = Math.floor((eventTouch.clientX - clickBounds.left - halfCellSize) / cellSize);
    const row = Math.floor((eventTouch.clientY - clickBounds.top - halfCellSize) / cellSize);

    return {col, row};
  }

  mustShowPiece = (row: number, col: number): boolean => {
    const pieceValue = this.piecesValues[this.getRank(row)][this.getFile(col)];
    const hasNoPiece = pieceValue === undefined;
    if (hasNoPiece) {
      return false;
    }

    const dndStarted = this.dndHighlightedCell !== null;
    if (dndStarted) {
      return this.getRank(row) !== this.dndHighlightedCell.rank ||
        this.getFile(col) !== this.dndHighlightedCell.file;
    } else {
      return true;
    }
  }

  getCellImagesSize = () => {
    return this.size / 9.0;
  }

  getCellImageLeft = (col: number) => {
    const cellSize = this.size / 9.0;
    return cellSize * (0.5 + col);
  }

  getCellImageTop = (row: number) => {
    const cellSize = this.size / 9.0;
    return cellSize * (0.5 + row);
  }

  getPiecePath = (row: number, col: number) => {
    const pieceValue = this.piecesValues[this.getRank(row)][this.getFile(col)];
    return this.getPieceRawPath(pieceValue);
  }

  private commitHumanMove = async () => {
    this.piecesValues = this.piecesValuesFromPosition();
    this.checkAndUpdateGameFinishedStatus();

    if (! this.gameInProgress) { return; }

    this.askComputerMoveIfAppropriate();
  }

  private checkAndUpdateGameFinishedStatus = async () => {
    let gameFinishedMessage;
    if (this.chessService.isCheckmate()) {
      const playerSide = this.chessService.isWhiteTurn() ?
        'Blacks' : 'Whites';
      gameFinishedMessage = `The ${playerSide} win`;
    } else if (this.chessService.isStalemate()) {
      gameFinishedMessage = 'Stalemate';
    } else if (this.chessService.isThreeFoldRepetition()) {
      gameFinishedMessage = 'Draw by three fold repetition';
    } else if (this.chessService.isDrawByMissingMaterial()) {
      gameFinishedMessage = 'Draw by missing material';
    } else if (this.chessService.isDrawByFiftyMovesRule()) {
      gameFinishedMessage = 'Draw by fifty moves rule';
    }

    if (gameFinishedMessage !== undefined) {
      this.gameInProgress = false;
      const toast = await this.toastController.create({
        message: gameFinishedMessage,
        duration: 800,
      });
      toast.present();
    }
  }

  private commitComputerMove = async (from: string, to: string) => {

    await this.chessService.checkAndDoMove(
      this.algebraicToChessCell(from),
      this.algebraicToChessCell(to)
    );

    this.piecesValues = this.piecesValuesFromPosition();
    this.checkAndUpdateGameFinishedStatus();
    this.computerIsThinking = false;
  }

  private commitComputerMoveWithPromotion = async (from: string, to: string, promotion: string) => {
    await this.chessService.checkAndDoMoveWithPromotion(
      this.algebraicToChessCell(from),
      this.algebraicToChessCell(to),
      promotion
    );

    this.piecesValues = this.piecesValuesFromPosition();
    this.checkAndUpdateGameFinishedStatus();
    this.computerIsThinking = false;
  }

  private algebraicToChessCell = (coords: string): ChessCell => {
    const file = coords.charCodeAt(0) - 'a'.charCodeAt(0);
    const rank = coords.charCodeAt(1) - '1'.charCodeAt(0);

    return {
      file, rank
    } as ChessCell;
  }

  private getPieceRawPath = (value: string): string => {
    let rawImageName;
    switch (value) {
      case 'P': rawImageName = 'Chess_plt45.svg'; break;
      case 'N': rawImageName = 'Chess_nlt45.svg'; break;
      case 'B': rawImageName = 'Chess_blt45.svg'; break;
      case 'R': rawImageName = 'Chess_rlt45.svg'; break;
      case 'Q': rawImageName = 'Chess_qlt45.svg'; break;
      case 'K': rawImageName = 'Chess_klt45.svg'; break;

      case 'p': rawImageName = 'Chess_pdt45.svg'; break;
      case 'n': rawImageName = 'Chess_ndt45.svg'; break;
      case 'b': rawImageName = 'Chess_bdt45.svg'; break;
      case 'r': rawImageName = 'Chess_rdt45.svg'; break;
      case 'q': rawImageName = 'Chess_qdt45.svg'; break;
      case 'k': rawImageName = 'Chess_kdt45.svg'; break;
      default: return undefined;
    }

    return `/assets/vectors/${rawImageName}`;
  }

  private isPromotionMove = () => {
    if ([null, undefined].includes(this.dndHighlightedCell)) { return false; }
    if ([null, undefined].includes(this.dndHoveringCell)) { return false; }

    const isWhiteToPlay = this.chessService.isWhiteTurn();
    return (isWhiteToPlay && (this.dndHoveringCell.rank === 7) ||
      (!isWhiteToPlay && (this.dndHoveringCell.rank === 0)));
  }

  private messageReceivedFromEngine = (message: string) => {
    if ('uciok' === message && ! this.engineIsReady) {
      this.engineCommunicationLayer.postMessage('isready');
    } else if ( 'readyok' === message ) {
      this.gotReady.emit();
      this.engineIsReady = true;
    } else {
      const match = message.match(/^bestmove ([a-h][1-8])([a-h][1-8])([qrbn])?/);
      if (match) {
        const from = match[1];
        const to = match[2];
        const promotion = match[3];

        if (promotion) {
          this.commitComputerMoveWithPromotion(from, to, promotion);
        } else {
          this.commitComputerMove(from, to);
        }
      }
    }
  }

}
