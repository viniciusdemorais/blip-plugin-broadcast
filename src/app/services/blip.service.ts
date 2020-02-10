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

  async storeBucket(variable: any, resources: {}) {
    const bucket = await IframeMessageProxy.sendMessage({
      action: 'sendCommand',
      content: {
        destination: 'MessagingHubService',
        command: {
          method: 'set',
          uri: '/buckets/' + variable,
          type: 'application/x-my-type+json',
          resource: resources
        }
      }
    });

    return bucket;
  }

  async getBucket(variable: any) {
    const bucket = await IframeMessageProxy.sendMessage({
      action: 'sendCommand',
      content: {
        destination: 'MessagingHubService',
        command: {
          method: 'get',
          uri: '/buckets/' + variable
        }
      }
    });

    return bucket;
  }
}
