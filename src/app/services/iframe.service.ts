import { Injectable } from '@angular/core';

const { IframeMessageProxy } = require('iframe-message-proxy');

@Injectable()
export class IframeService {
  constructor() {
    IframeMessageProxy.listen();
  }

  sendMessage(_action: string, _content: number) {
    IframeMessageProxy.sendMessage({
      action: _action,
      content: _content
    });
  }

  startLoading() {
    IframeMessageProxy.sendMessage({ action: 'startLoading' });
  }

  stopLoading() {
    IframeMessageProxy.sendMessage({ action: 'stopLoading' });
  }

  setHeight(height: any) {
    IframeMessageProxy.sendMessage({ action: 'heightChange', content: height });
  }

  showToast(toast: any) {
    IframeMessageProxy.sendMessage({ action: 'toast', content: toast });
  }

  async withLoading() {
    this.startLoading();
    try {
      return await this.showToast('Carregado');
    } finally {
      this.stopLoading();
    }
  }
}
