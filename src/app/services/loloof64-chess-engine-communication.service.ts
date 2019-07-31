import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

declare var WebAssembly: any;
declare var Stockfish: any;

@Injectable({
  providedIn: 'root'
})
export class Loloof64ChessEngineCommunicationService {

  private stockfish: any;
  private stockfishLoaded = false;

  private onMessage: Subject<string>;
  public onMessage$: Observable<string>;

  constructor() {
    this.onMessage = new Subject<string>();
    this.onMessage$ = this.onMessage.asObservable();
    if (this.wasmThreadsSupported()) {
      console.log('stockfish.wasm');
      this.initStockfishWasm();
    } else {
        console.log('stockfish.js');
        this.initStockfishJs();
    }
  }

  postMessage = (message: string) => {
    if (this.stockfish) {
      this.stockfish.postMessage(message);
    } else {
      console.error('Stockfish not ready yet !');
    }
  }

  private wasmThreadsSupported() {
    // WebAssembly 1.0
    var source = Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00);
    if (typeof WebAssembly !== 'object' || !WebAssembly.validate(source)) return false;

    // SharedArrayBuffer
    if (typeof SharedArrayBuffer !== 'function') return false;

    // Atomics
    if (typeof Atomics !== 'object') return false;

    // Shared memory
    var mem = new WebAssembly.Memory({ shared: true, initial: 8, maximum: 16 });
    if (!(mem.buffer instanceof SharedArrayBuffer)) return false;

    // Growable shared memory
    /* try {
      mem.grow(8);
    } catch (e) {
      return false;
    } */

    // Structured cloning
    try {
        // You have to make sure nobody cares about this message!
        window.postMessage(new WebAssembly.Module(source), '*');
    } catch (e) {
        return false;
    }

    return true;
  }


  private initStockfishJs = () => {
    const wasmSupported = typeof WebAssembly === 'object' &&
      WebAssembly.validate(Uint8Array.of(0x0, 0x61, 0x73, 0x6d, 0x01, 0x00, 0x00, 0x00));
    this.stockfish = new Worker(wasmSupported ?
      '/assets/stockfish-js/stockfish.wasm.js' : '/assets/stockfish-js/stockfish.js');
    this.stockfish.addEventListener('message', (event) => {
      this.onMessage.next(event.data);
    });
    this.stockfish.postMessage('uci');
  }

  private initStockfishWasm = () => {
      this.loadScript('/assets/stockfish-wasm/stockfish.js').then(() => {
        this.stockfish = Stockfish();
        this.stockfish.addMessageListener((message) => {
          this.onMessage.next(message);
        });
        this.stockfish.postMessage('uci');
    });
  }

  private loadScript = (path: string) => {
    return new Promise((resolve, reject) => {
      // resolve if already loaded
      if (this.stockfishLoaded) {
          resolve();
      } else {
          // load script
          const script = document.createElement('script');
          script.type = 'text/javascript';
          script.async = true;
          script.src = path;
          script.onload = () => {
              this.stockfishLoaded = true;
              resolve();
          };
          script.onerror = (error: any) => reject(error);
          document.getElementsByTagName('head')[0].appendChild(script);
      }
    });
  }

}
