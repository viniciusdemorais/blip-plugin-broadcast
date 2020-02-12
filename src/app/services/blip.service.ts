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
    const application = await IframeMessageProxy.sendMessage({
      action: 'getApplication'
    });
    return application;
  }

  async getTemplates() {
    const templates = await IframeMessageProxy.sendMessage({
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
    return templates;
  }

  async getAccount() {
    const account = await IframeMessageProxy.sendMessage({
      action: 'sendCommand',
      content: {
        destination: 'BlipService',
        command: {
          method: 'get',
          uri: '/account'
        }
      }
    });
    return account;
  }
}
