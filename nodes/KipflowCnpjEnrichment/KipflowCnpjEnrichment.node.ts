import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
} from 'n8n-workflow';

export class KipflowCnpjEnrichment implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Kipflow',
    name: 'kipflowCnpjEnrichment',
    icon: 'file:kipflow-logo.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["cnpj"] || $parameter["domain"]}}',
    description: 'Enrich Brazilian company data using CNPJ or domain with Kipflow',
    defaults: {
      name: 'Kipflow',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'kipflowApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'CNPJ',
        name: 'cnpj',
        type: 'string',
        default: '',
        placeholder: '12.345.678/0001-90 or 12345678000190',
        description: 'Brazilian company CNPJ (with or without formatting). You must provide at least a CNPJ or a domain.',
      },
      {
        displayName: 'Domínio',
        name: 'domain',
        type: 'string',
        default: '',
        placeholder: 'empresa.com.br',
        description: 'Website domain of the company. You must provide at least a CNPJ or a domain.',
      },
      {
        displayName: 'Selecione os datasets',
        name: 'datasetsNotice',
        type: 'notice',
        default: '',
      },
      {
        displayName: 'Datasets',
        name: 'datasets',
        type: 'multiOptions',
        default: ['basic'],
        options: [
          { name: 'Básico', value: 'basic' },
          { name: 'Completo', value: 'complete' },
          { name: 'Endereço', value: 'address' },
          { name: 'Presença Online', value: 'online_presence' },
          { name: 'Sócios', value: 'partners' },
        ],
        description:
          'Marque apenas o que precisa. O custo final é a soma dos datasets selecionados por execução.',
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const cnpj = (this.getNodeParameter('cnpj', i, '') as string).trim();
        const domain = (this.getNodeParameter('domain', i, '') as string).trim();

        if (!cnpj && !domain) {
          throw new NodeOperationError(
            this.getNode(),
            'Você precisa informar pelo menos um CNPJ ou um domínio.',
            { itemIndex: i },
          );
        }

        const datasets = this.getNodeParameter('datasets', i, ['basic']) as string[];
        const credentials = await this.getCredentials('kipflowApi');

        const qs: Record<string, string> = {
          datasets: datasets.join(','),
        };

        if (cnpj) {
          qs.cnpj = cnpj.replace(/\D/g, '');
        }
        if (domain) {
          qs.domain = domain;
        }

        const response = await this.helpers.httpRequest({
          method: 'GET',
          url: 'https://api.kipflow.io/companies/v1/search',
          qs,
          headers: {
            'X-API-Key': credentials.apiKey as string,
          },
          json: true,
        });

        if (!response.success) {
          throw new Error(response.error?.message || 'API returned success: false');
        }

        returnData.push({
          json: response,
          pairedItem: { item: i },
        });
      } catch (error) {
        if (this.continueOnFail()) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error';
          returnData.push({
            json: { error: errorMessage },
            pairedItem: { item: i },
          });
          continue;
        }
        throw error;
      }
    }

    return [returnData];
  }
}
