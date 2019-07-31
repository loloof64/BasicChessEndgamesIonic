import {
  Component, OnInit, Renderer2, ElementRef, Input, ViewChild,
  OnChanges, SimpleChanges,
} from '@angular/core';
import { Loloof64ChessLogicService, ChessCell } from '../../services/loloof64-chess-logic.service';
import { ModalController, ToastController } from '@ionic/angular';
import { Loloof64ChessPromotionPage } from '../../pages/loloof64-chess-promotion/loloof64-chess-promotion.page';

@Component({
  selector: 'loloof64-chessboard',
  templateUrl: './loloof64-chessboard.component.html',
  styleUrls: ['./loloof64-chessboard.component.scss'],
  providers: [Loloof64ChessLogicService],
})
export class Loloof64ChessboardComponent implements OnInit, OnChanges {

  @Input() size = 200.0;
  @Input() reversed = false;

  @ViewChild('root') root: ElementRef;
  @ViewChild('click_zone') clickZone: ElementRef;
  @ViewChild('dndPiece') dndPiece: ElementRef;
  @ViewChild('horizontalGuide') horizontalGuide: ElementRef;
  @ViewChild('verticalGuide') verticalGuide: ElementRef;

  private dndHighlightedCell: ChessCell = null;
  private dndHoveringCell: ChessCell = null;
  private gameInProgress = false;

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
  ) { }

  ngOnInit() {
    this.chessService.newGame();
    this.updateRenderSize();
    this.piecesValues = this.piecesValuesFromPosition();
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

    const boardRawCoordinates = this.touchEventToBoardRawCoordinate(event);
    const coordinatesInBoard = boardRawCoordinates !== undefined &&
      boardRawCoordinates.col >= 0 && boardRawCoordinates.col <= 7 &&
      boardRawCoordinates.row >= 0 && boardRawCoordinates.row <= 7;


    if (coordinatesInBoard) {
      const pieceValue = this.piecesValues[this.getRank(boardRawCoordinates.row)][this.getFile(boardRawCoordinates.col)];
      const isLegalPieceValue = 'PNBRQKpnbrqk'.split('').includes(pieceValue);

      if ( ! isLegalPieceValue ) {
        return;
      }

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

    const legalMove = this.chessService.checkAndDoMove(this.dndHighlightedCell, this.dndHoveringCell);
    if (legalMove) {
      this.commitMove();
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

  validatePromotion = (value: string) => {
    this.modalController.dismiss();
    const legalMove = this.chessService.checkAndDoMoveWithPromotion(
      this.dndHighlightedCell,
      this.dndHoveringCell,
      value,
    );
    if (legalMove) {
      this.commitMove();
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

  private commitMove = async () => {
    this.piecesValues = this.piecesValuesFromPosition();

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

}
