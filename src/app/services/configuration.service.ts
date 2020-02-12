import { Injectable } from '@angular/core';
import { BucketVariables } from '@app/models/BucketVariables';
import { Observable } from 'rxjs';

const { IframeMessageProxy } = require('iframe-message-proxy');

@Injectable()
export class ConfigurationService {
  sendMessage(_action: string, _content: number) {
    IframeMessageProxy.sendMessage({
      action: _action,
      content: _content
    });
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
    return bucket.response as BucketVariables;
  }
}
