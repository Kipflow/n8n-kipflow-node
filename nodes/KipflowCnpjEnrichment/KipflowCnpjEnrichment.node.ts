import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
} from 'n8n-workflow';
const DATASET_PRICES: Record<string, number> = {
  basic: 0.02,
  complete: 0.24,
  address: 0.07,
  online_presence: 0.12,
  partners: 0.08,
};

function formatBRL(value: number): string {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
}

export class KipflowCnpjEnrichment implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Kipflow',
    name: 'kipflowCnpjEnrichment',
    icon: 'file:kipflow-logo.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["cnpj"]}}',
    description: 'Enrich Brazilian company data using CNPJ with Kipflow',
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
        required: true,
        placeholder: '12.345.678/0001-90 or 12345678000190',
        description: 'Brazilian company CNPJ (with or without formatting)',
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
          { name: `Básico — ${formatBRL(DATASET_PRICES.basic)}`, value: 'basic' },
          { name: `Completo — ${formatBRL(DATASET_PRICES.complete)}`, value: 'complete' },
          { name: `Endereço — ${formatBRL(DATASET_PRICES.address)}`, value: 'address' },
          {
            name: `Presença Online — ${formatBRL(DATASET_PRICES.online_presence)}`,
            value: 'online_presence',
          },
          { name: `Sócios — ${formatBRL(DATASET_PRICES.partners)}`, value: 'partners' },
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
        const cnpj = this.getNodeParameter('cnpj', i) as string;
        const cleanCnpj = cnpj.replace(/\D/g, '');
        const datasets = this.getNodeParameter('datasets', i, ['basic']) as string[];

        const credentials = await this.getCredentials('kipflowApi');

        const response = await this.helpers.httpRequest({
          method: 'GET',
          url: 'https://api.kipflow.io/companies/v1/search',
          qs: {
            cnpj: cleanCnpj,
            datasets: datasets.join(','),
          },
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
