import {
  IAuthenticateGeneric,
  ICredentialTestRequest,
  ICredentialType,
  INodeProperties,
} from 'n8n-workflow';

export class DrivaSearchApi implements ICredentialType {
  name = 'drivaSearchApi';
  displayName = 'Kipflow API';
  documentationUrl = 'https://docs.kipflow.io';
  properties: INodeProperties[] = [
    {
      displayName: 'API Key',
      name: 'apiKey',
      type: 'string',
      typeOptions: {
        password: true,
      },
      default: '',
      required: true,
      description: 'API Key for Kipflow enrichment service',
    },
  ];
  authenticate: IAuthenticateGeneric = {
    type: 'generic',
    properties: {
      headers: {
        'X-API-Key': '={{$credentials.apiKey}}',
      },
    },
  };
  test: ICredentialTestRequest = {
    request: {
      baseURL: 'https://api.kipflow.io',
      url: '/health/authenticated',
      method: 'GET',
    },
  };
}
