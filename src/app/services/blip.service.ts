import { Injectable } from '@angular/core';

const { IframeMessageProxy } = require('iframe-message-proxy');

@Injectable()
export class BlipService {
  sendMessage(_action: string, _content: number) {
    IframeMessageProxy.sendMessage({
      action: _action,
      content: _content
    });
  }

  async getApplication() {
    var application = await IframeMessageProxy.sendMessage({
      action: 'getApplication'
    });
    return application;
  }

  async getTemplates() {
    var templates = await IframeMessageProxy.sendMessage({
      action: 'sendCommand',
      content: {
        destination: 'MessagingHubService',
        command: {
          to: 'postmaster@wa.gw.msging.net',
          method: 'get',
          uri: '/message-templates?status=APPROVED'
        }
      }
    });
    debugger;
    return templates;
  }
}
