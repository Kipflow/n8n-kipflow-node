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
    subtitle:
      '={{{"companies":"Empresas","people":"Pessoas (CPF)","social":"Social (LinkedIn)","contacts":"Contatos","intelligence":"Inteligência","perdcomp":"PER-DCOMP","geolocation":"Geolocalização","labor":"Trabalhista","vehicles":"Veículos"}[$parameter["resource"]] || "Kipflow"}}',
    description: 'Consulte dados empresariais, CPF, LinkedIn, contatos e mais com a API Kipflow',
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
      // ============================================================
      //                    Resource Selector
      // ============================================================
      {
        displayName: 'API',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          { name: 'Empresas (CNPJ)', value: 'companies' },
          { name: 'Pessoas (CPF)', value: 'people' },
          { name: 'Social (LinkedIn)', value: 'social' },
          { name: 'Contatos', value: 'contacts' },
          { name: 'Inteligência', value: 'intelligence' },
          { name: 'PER-DCOMP', value: 'perdcomp' },
          { name: 'Geolocalização', value: 'geolocation' },
          { name: 'Trabalhista', value: 'labor' },
          { name: 'Veículos', value: 'vehicles' },
        ],
        default: 'companies',
        description: 'Selecione a API que deseja consultar',
      },

      // ============================================================
      //                    Operations
      // ============================================================

      // --- Companies ---
      {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['companies'] } },
        options: [
          {
            name: 'Buscar por CNPJ ou Domínio',
            value: 'searchByCnpj',
            description: 'GET /companies/v1/search',
          },
          {
            name: 'Buscar com Filtros',
            value: 'searchWithFilters',
            description: 'POST /companies/v1/search',
          },
        ],
        default: 'searchByCnpj',
      },
      // --- People ---
      {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['people'] } },
        options: [
          {
            name: 'Buscar por CPF',
            value: 'searchByCpf',
            description: 'GET /people/v1/search',
          },
        ],
        default: 'searchByCpf',
      },
      // --- Social ---
      {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['social'] } },
        options: [
          {
            name: 'Buscar Empresa no LinkedIn',
            value: 'searchCompany',
            description: 'GET /social/v1/companies/search',
          },
          {
            name: 'Buscar Pessoa no LinkedIn',
            value: 'searchPerson',
            description: 'GET /social/v1/people/search',
          },
          {
            name: 'Buscar Pessoas com Filtros',
            value: 'searchPeopleWithFilters',
            description: 'POST /social/v1/people/search',
          },
        ],
        default: 'searchCompany',
      },
      // --- Contacts ---
      {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['contacts'] } },
        options: [
          {
            name: 'Buscar Telefones',
            value: 'searchPhones',
            description: 'GET /contacts/v1/phones',
          },
          {
            name: 'Gerar Emails',
            value: 'generateEmails',
            description: 'GET /contacts/v1/emails',
          },
        ],
        default: 'searchPhones',
      },
      // --- Intelligence ---
      {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['intelligence'] } },
        options: [
          {
            name: 'Classificar Atividade (CNAE)',
            value: 'classifyActivity',
            description: 'GET /intelligence/v1/activity-classifier',
          },
        ],
        default: 'classifyActivity',
      },
      // --- PER-DCOMP ---
      {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['perdcomp'] } },
        options: [
          {
            name: 'Buscar Declarações',
            value: 'searchDeclarations',
            description: 'GET /perdcomp/v1/search',
          },
        ],
        default: 'searchDeclarations',
      },
      // --- Geolocation ---
      {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['geolocation'] } },
        options: [
          {
            name: 'Buscar Lugares por CNPJ',
            value: 'searchPlaces',
            description: 'GET /geo/v1/places',
          },
        ],
        default: 'searchPlaces',
      },
      // --- Labor ---
      {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['labor'] } },
        options: [
          {
            name: 'Consultar PAT',
            value: 'searchPat',
            description: 'GET /labor/v1/pat',
          },
        ],
        default: 'searchPat',
      },
      // --- Vehicles ---
      {
        displayName: 'Operação',
        name: 'operation',
        type: 'options',
        noDataExpression: true,
        displayOptions: { show: { resource: ['vehicles'] } },
        options: [
          {
            name: 'Consultar Frota por CNPJ',
            value: 'searchFleet',
            description: 'GET /vehicles/v1/fleet',
          },
          {
            name: 'Consultar Veículo por Placa ou ID',
            value: 'searchVehicle',
            description: 'GET /vehicles/v1/search',
          },
          {
            name: 'Consultar Tacógrafos por CNPJ',
            value: 'searchTachographFleet',
            description: 'GET /vehicles/v1/tachograph/fleet',
          },
          {
            name: 'Consultar Tacógrafo por Placa',
            value: 'searchTachograph',
            description: 'GET /vehicles/v1/tachograph',
          },
          {
            name: 'Consultar Múltiplos Veículos',
            value: 'searchBatch',
            description: 'POST /vehicles/v1/search/batch',
          },
        ],
        default: 'searchFleet',
      },

      // ============================================================
      //              Parameters: Empresas - Buscar por CNPJ/Domínio
      // ============================================================
      {
        displayName: 'CNPJ',
        name: 'cnpj',
        type: 'string',
        default: '',
        placeholder: '12.345.678/0001-90 ou 12345678000190',
        description:
          'CNPJ da empresa (com ou sem formatação). Informe pelo menos CNPJ ou domínio.',
        displayOptions: {
          show: { resource: ['companies'], operation: ['searchByCnpj'] },
        },
      },
      {
        displayName: 'Domínio',
        name: 'domain',
        type: 'string',
        default: '',
        placeholder: 'empresa.com.br',
        description: 'Domínio do site da empresa. Informe pelo menos CNPJ ou domínio.',
        displayOptions: {
          show: { resource: ['companies'], operation: ['searchByCnpj'] },
        },
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
          { name: 'Dívida Ativa', value: 'debts' },
        ],
        description: 'Selecione os dados que deseja consultar',
        displayOptions: {
          show: { resource: ['companies'], operation: ['searchByCnpj'] },
        },
      },

      // ============================================================
      //              Parameters: Empresas - Buscar com Filtros
      // ============================================================
      {
        displayName: 'Filtros (JSON)',
        name: 'companyFilters',
        type: 'json',
        default:
          '{\n  "$and": [\n    { "situacao_cadastral": "ATIVA" },\n    { "uf": "SP" }\n  ]\n}',
        description: 'Filtros no formato MongoDB query ($and, $or, $not, $gt, $lt, $in)',
        displayOptions: {
          show: { resource: ['companies'], operation: ['searchWithFilters'] },
        },
      },
      {
        displayName: 'Datasets',
        name: 'companyFilterDatasets',
        type: 'multiOptions',
        default: ['basic'],
        options: [
          { name: 'Básico', value: 'basic' },
          { name: 'Completo', value: 'complete' },
          { name: 'Endereço', value: 'address' },
          { name: 'Presença Online', value: 'online_presence' },
          { name: 'Sócios', value: 'partners' },
          { name: 'Dívida Ativa', value: 'debts' },
        ],
        description: 'Selecione os dados que deseja consultar',
        displayOptions: {
          show: { resource: ['companies'], operation: ['searchWithFilters'] },
        },
      },
      {
        displayName: 'Página',
        name: 'companyPage',
        type: 'number',
        default: 0,
        description: 'Número da página (começa em 0)',
        displayOptions: {
          show: { resource: ['companies'], operation: ['searchWithFilters'] },
        },
      },
      {
        displayName: 'Resultados por Página',
        name: 'companySize',
        type: 'number',
        default: 5,
        typeOptions: { minValue: 1, maxValue: 50 },
        description: 'Quantidade de resultados por página (máximo 50)',
        displayOptions: {
          show: { resource: ['companies'], operation: ['searchWithFilters'] },
        },
      },

      // ============================================================
      //              Parameters: Pessoas - Buscar por CPF
      // ============================================================
      {
        displayName: 'CPF',
        name: 'cpf',
        type: 'string',
        default: '',
        required: true,
        placeholder: '12345678901',
        description: 'CPF da pessoa (apenas números)',
        displayOptions: {
          show: { resource: ['people'], operation: ['searchByCpf'] },
        },
      },
      {
        displayName: 'Datasets',
        name: 'peopleDatasets',
        type: 'multiOptions',
        default: ['basic'],
        options: [
          { name: 'Básico', value: 'basic' },
          { name: 'Situação Cadastral', value: 'registration_status' },
        ],
        description: 'Selecione os dados que deseja consultar',
        displayOptions: {
          show: { resource: ['people'], operation: ['searchByCpf'] },
        },
      },

      // ============================================================
      //              Parameters: Social - Buscar Empresa no LinkedIn
      // ============================================================
      {
        displayName: 'ID Público da Empresa',
        name: 'companyPublicId',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'driva-tech',
        description: 'ID público da empresa no LinkedIn (ex: driva-tech)',
        displayOptions: {
          show: { resource: ['social'], operation: ['searchCompany'] },
        },
      },

      // ============================================================
      //              Parameters: Social - Buscar Pessoa no LinkedIn
      // ============================================================
      {
        displayName: 'ID Público do Perfil',
        name: 'profilePublicId',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'joao-silva-12345',
        description: 'ID público do perfil no LinkedIn',
        displayOptions: {
          show: { resource: ['social'], operation: ['searchPerson'] },
        },
      },

      // ============================================================
      //              Parameters: Social - Buscar Pessoas com Filtros
      // ============================================================
      {
        displayName: 'Filtros de Pessoas (JSON)',
        name: 'peopleFilters',
        type: 'json',
        default:
          '{\n  "$and": [\n    { "current_job_title": "Desenvolvedor" }\n  ]\n}',
        description: 'Filtros para busca de pessoas ($and, $or, $in)',
        displayOptions: {
          show: { resource: ['social'], operation: ['searchPeopleWithFilters'] },
        },
      },
      {
        displayName: 'Filtros de Empresas (JSON)',
        name: 'companiesFilter',
        type: 'json',
        default: '',
        description:
          'Filtros opcionais de empresa (company_public_id, sector, city, etc.)',
        displayOptions: {
          show: { resource: ['social'], operation: ['searchPeopleWithFilters'] },
        },
      },
      {
        displayName: 'Página',
        name: 'socialPeoplePage',
        type: 'number',
        default: 0,
        description: 'Número da página (começa em 0)',
        displayOptions: {
          show: { resource: ['social'], operation: ['searchPeopleWithFilters'] },
        },
      },
      {
        displayName: 'Resultados por Página',
        name: 'socialPeopleSize',
        type: 'number',
        default: 5,
        typeOptions: { minValue: 1, maxValue: 50 },
        description: 'Quantidade de resultados por página (máximo 50)',
        displayOptions: {
          show: { resource: ['social'], operation: ['searchPeopleWithFilters'] },
        },
      },

      // ============================================================
      //              Parameters: Contatos - Buscar Telefones
      // ============================================================
      {
        displayName: 'CNPJ',
        name: 'contactsCnpj',
        type: 'string',
        default: '',
        placeholder: '12.345.678/0001-90',
        description: 'CNPJ da empresa. Informe pelo menos CNPJ ou domínio.',
        displayOptions: {
          show: { resource: ['contacts'], operation: ['searchPhones'] },
        },
      },
      {
        displayName: 'Domínio',
        name: 'contactsDomain',
        type: 'string',
        default: '',
        placeholder: 'empresa.com.br',
        description: 'Domínio da empresa. Informe pelo menos CNPJ ou domínio.',
        displayOptions: {
          show: { resource: ['contacts'], operation: ['searchPhones'] },
        },
      },
      {
        displayName: 'Limite de Telefones',
        name: 'phoneLimit',
        type: 'number',
        default: 10,
        required: true,
        typeOptions: { minValue: 1, maxValue: 50 },
        description: 'Quantidade máxima de telefones retornados (1-50)',
        displayOptions: {
          show: { resource: ['contacts'], operation: ['searchPhones'] },
        },
      },
      {
        displayName: 'Excluir Telefones de Contador',
        name: 'excludeContador',
        type: 'boolean',
        default: false,
        description: 'Whether to exclude phones belonging to accountants',
        displayOptions: {
          show: { resource: ['contacts'], operation: ['searchPhones'] },
        },
      },
      {
        displayName: 'Apenas WhatsApp',
        name: 'onlyWhatsapp',
        type: 'boolean',
        default: false,
        description: 'Whether to return only phones with WhatsApp',
        displayOptions: {
          show: { resource: ['contacts'], operation: ['searchPhones'] },
        },
      },
      {
        displayName: 'Tipo de Telefone',
        name: 'phoneType',
        type: 'options',
        default: '',
        options: [
          { name: 'Todos', value: '' },
          { name: 'Fixo', value: 'FIXO' },
          { name: 'Móvel', value: 'MOVEL' },
        ],
        description: 'Filtrar por tipo de telefone',
        displayOptions: {
          show: { resource: ['contacts'], operation: ['searchPhones'] },
        },
      },

      // ============================================================
      //              Parameters: Contatos - Gerar Emails
      // ============================================================
      {
        displayName: 'CNPJ',
        name: 'emailsCnpj',
        type: 'string',
        default: '',
        placeholder: '12.345.678/0001-90',
        description: 'CNPJ da empresa. Informe pelo menos CNPJ ou domínio.',
        displayOptions: {
          show: { resource: ['contacts'], operation: ['generateEmails'] },
        },
      },
      {
        displayName: 'Domínio',
        name: 'emailsDomain',
        type: 'string',
        default: '',
        placeholder: 'empresa.com.br',
        description: 'Domínio da empresa. Informe pelo menos CNPJ ou domínio.',
        displayOptions: {
          show: { resource: ['contacts'], operation: ['generateEmails'] },
        },
      },
      {
        displayName: 'Limite de Emails',
        name: 'emailLimit',
        type: 'number',
        default: 10,
        required: true,
        typeOptions: { minValue: 1, maxValue: 50 },
        description: 'Quantidade máxima de perfis LinkedIn para gerar emails (1-50)',
        displayOptions: {
          show: { resource: ['contacts'], operation: ['generateEmails'] },
        },
      },

      // ============================================================
      //              Parameters: Inteligência - Classificar CNAE
      // ============================================================
      {
        displayName: 'CNPJ',
        name: 'intelligenceCnpj',
        type: 'string',
        default: '',
        placeholder: '12.345.678/0001-90',
        description: 'CNPJ da empresa. Informe pelo menos CNPJ ou domínio.',
        displayOptions: {
          show: { resource: ['intelligence'], operation: ['classifyActivity'] },
        },
      },
      {
        displayName: 'Domínio',
        name: 'intelligenceDomain',
        type: 'string',
        default: '',
        placeholder: 'empresa.com.br',
        description: 'Domínio da empresa. Informe pelo menos CNPJ ou domínio.',
        displayOptions: {
          show: { resource: ['intelligence'], operation: ['classifyActivity'] },
        },
      },

      // ============================================================
      //              Parameters: PER-DCOMP
      // ============================================================
      {
        displayName: 'CNPJ',
        name: 'perdcompCnpj',
        type: 'string',
        default: '',
        required: true,
        placeholder: '12.345.678/0001-90',
        description: 'CNPJ da empresa',
        displayOptions: {
          show: { resource: ['perdcomp'], operation: ['searchDeclarations'] },
        },
      },

      // ============================================================
      //              Parameters: Geolocalização
      // ============================================================
      {
        displayName: 'CNPJ',
        name: 'geoCnpj',
        type: 'string',
        default: '',
        required: true,
        placeholder: '12.345.678/0001-90',
        description: 'CNPJ da empresa',
        displayOptions: {
          show: { resource: ['geolocation'], operation: ['searchPlaces'] },
        },
      },

      // ============================================================
      //              Parameters: Trabalhista
      // ============================================================
      {
        displayName: 'CNPJ',
        name: 'laborCnpj',
        type: 'string',
        default: '',
        required: true,
        placeholder: '12.345.678/0001-90',
        description: 'CNPJ da empresa',
        displayOptions: {
          show: { resource: ['labor'], operation: ['searchPat'] },
        },
      },

      // ============================================================
      //              Parameters: Veículos - Frota
      // ============================================================
      {
        displayName: 'CNPJ',
        name: 'fleetCnpj',
        type: 'string',
        default: '',
        required: true,
        placeholder: '12.345.678/0001-90',
        description: 'CNPJ da empresa',
        displayOptions: {
          show: { resource: ['vehicles'], operation: ['searchFleet'] },
        },
      },
      {
        displayName: 'Quantidade de Veículos Detalhados',
        name: 'fleetSize',
        type: 'number',
        default: 0,
        typeOptions: { minValue: 0 },
        description:
          'Número de veículos com dados detalhados (custo adicional por veículo). 0 = apenas resumo da frota.',
        displayOptions: {
          show: { resource: ['vehicles'], operation: ['searchFleet'] },
        },
      },

      // ============================================================
      //              Parameters: Veículos - Buscar por Placa/ID
      // ============================================================
      {
        displayName: 'Placa',
        name: 'vehiclePlate',
        type: 'string',
        default: '',
        placeholder: 'ABC1234 ou ABC1D23',
        description:
          'Placa do veículo (formato antigo ou Mercosul). Informe placa ou ID.',
        displayOptions: {
          show: { resource: ['vehicles'], operation: ['searchVehicle'] },
        },
      },
      {
        displayName: 'ID do Veículo',
        name: 'vehicleId',
        type: 'string',
        default: '',
        placeholder: 'vhc_0ab2c3...',
        description: 'ID do veículo obtido na consulta de frota. Informe placa ou ID.',
        displayOptions: {
          show: { resource: ['vehicles'], operation: ['searchVehicle'] },
        },
      },

      // ============================================================
      //              Parameters: Veículos - Tacógrafos por CNPJ
      // ============================================================
      {
        displayName: 'CNPJ',
        name: 'tachographFleetCnpj',
        type: 'string',
        default: '',
        required: true,
        placeholder: '12.345.678/0001-90',
        description: 'CNPJ da empresa',
        displayOptions: {
          show: { resource: ['vehicles'], operation: ['searchTachographFleet'] },
        },
      },

      // ============================================================
      //              Parameters: Veículos - Tacógrafo por Placa
      // ============================================================
      {
        displayName: 'Identificador',
        name: 'tachographIdentifier',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'ABC1234 ou vhc_0ab2c3...',
        description: 'Placa do veículo ou ID da frota',
        displayOptions: {
          show: { resource: ['vehicles'], operation: ['searchTachograph'] },
        },
      },

      // ============================================================
      //              Parameters: Veículos - Consulta em Lote
      // ============================================================
      {
        displayName: 'Identificadores',
        name: 'batchIdentifiers',
        type: 'string',
        default: '',
        required: true,
        placeholder: 'ABC1234, DEF5678, vhc_0ab2c3...',
        description: 'Lista de placas ou IDs separados por vírgula (máximo 50)',
        displayOptions: {
          show: { resource: ['vehicles'], operation: ['searchBatch'] },
        },
      },
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const resource = this.getNodeParameter('resource', i, 'companies') as string;
        const operation = this.getNodeParameter('operation', i, '') as string;
        const credentials = await this.getCredentials('kipflowApi');
        const apiKey = credentials.apiKey as string;

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let response: any;

        // =============================================================
        //  Empresas
        // =============================================================
        if (resource === 'companies') {
          if (operation === 'searchByCnpj' || !operation) {
            const cnpj = (this.getNodeParameter('cnpj', i, '') as string).trim();
            const domain = (this.getNodeParameter('domain', i, '') as string).trim();
            if (!cnpj && !domain) {
              throw new NodeOperationError(
                this.getNode(),
                'Informe pelo menos um CNPJ ou domínio.',
                { itemIndex: i },
              );
            }
            const datasets = this.getNodeParameter('datasets', i, ['basic']) as string[];
            const qs: Record<string, string> = { datasets: datasets.join(',') };
            if (cnpj) qs.cnpj = cnpj.replace(/\D/g, '');
            if (domain) qs.domain = domain;

            response = await this.helpers.httpRequest({
              method: 'GET',
              url: 'https://api.kipflow.io/companies/v1/search',
              qs,
              headers: { 'X-API-Key': apiKey },
              json: true,
            });
          } else if (operation === 'searchWithFilters') {
            const filtersRaw = this.getNodeParameter('companyFilters', i, '{}') as string;
            const datasets = this.getNodeParameter(
              'companyFilterDatasets',
              i,
              ['basic'],
            ) as string[];
            const page = this.getNodeParameter('companyPage', i, 0) as number;
            const size = this.getNodeParameter('companySize', i, 5) as number;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let filter: any;
            try {
              filter = typeof filtersRaw === 'string' ? JSON.parse(filtersRaw) : filtersRaw;
            } catch {
              throw new NodeOperationError(this.getNode(), 'JSON de filtros inválido.', {
                itemIndex: i,
              });
            }

            response = await this.helpers.httpRequest({
              method: 'POST',
              url: 'https://api.kipflow.io/companies/v1/search',
              headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
              body: { $filter: filter, $page: page, $size: size, datasets },
              json: true,
            });
          }
        }

        // =============================================================
        //  Pessoas (CPF)
        // =============================================================
        else if (resource === 'people') {
          const cpf = (this.getNodeParameter('cpf', i, '') as string)
            .trim()
            .replace(/\D/g, '');
          if (!cpf) {
            throw new NodeOperationError(this.getNode(), 'Informe o CPF.', {
              itemIndex: i,
            });
          }
          const datasets = this.getNodeParameter('peopleDatasets', i, ['basic']) as string[];
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: 'https://api.kipflow.io/people/v1/search',
            qs: { cpf, datasets: datasets.join(',') },
            headers: { 'X-API-Key': apiKey },
            json: true,
          });
        }

        // =============================================================
        //  Social (LinkedIn)
        // =============================================================
        else if (resource === 'social') {
          if (operation === 'searchCompany') {
            const companyPublicId = (
              this.getNodeParameter('companyPublicId', i, '') as string
            ).trim();
            if (!companyPublicId) {
              throw new NodeOperationError(
                this.getNode(),
                'Informe o ID público da empresa no LinkedIn.',
                { itemIndex: i },
              );
            }
            response = await this.helpers.httpRequest({
              method: 'GET',
              url: 'https://api.kipflow.io/social/v1/companies/search',
              qs: { company_public_id: companyPublicId },
              headers: { 'X-API-Key': apiKey },
              json: true,
            });
          } else if (operation === 'searchPerson') {
            const profilePublicId = (
              this.getNodeParameter('profilePublicId', i, '') as string
            ).trim();
            if (!profilePublicId) {
              throw new NodeOperationError(
                this.getNode(),
                'Informe o ID público do perfil no LinkedIn.',
                { itemIndex: i },
              );
            }
            response = await this.helpers.httpRequest({
              method: 'GET',
              url: 'https://api.kipflow.io/social/v1/people/search',
              qs: { profile_public_id: profilePublicId },
              headers: { 'X-API-Key': apiKey },
              json: true,
            });
          } else if (operation === 'searchPeopleWithFilters') {
            const filtersRaw = this.getNodeParameter('peopleFilters', i, '{}') as string;
            const companiesFilterRaw = this.getNodeParameter(
              'companiesFilter',
              i,
              '',
            ) as string;
            const page = this.getNodeParameter('socialPeoplePage', i, 0) as number;
            const size = this.getNodeParameter('socialPeopleSize', i, 5) as number;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            let filter: any;
            try {
              filter = typeof filtersRaw === 'string' ? JSON.parse(filtersRaw) : filtersRaw;
            } catch {
              throw new NodeOperationError(
                this.getNode(),
                'JSON de filtros de pessoas inválido.',
                { itemIndex: i },
              );
            }

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const body: any = { $filter: filter, $page: page, $size: size };

            if (companiesFilterRaw) {
              try {
                body.$companies_filter =
                  typeof companiesFilterRaw === 'string'
                    ? JSON.parse(companiesFilterRaw)
                    : companiesFilterRaw;
              } catch {
                throw new NodeOperationError(
                  this.getNode(),
                  'JSON de filtros de empresas inválido.',
                  { itemIndex: i },
                );
              }
            }

            response = await this.helpers.httpRequest({
              method: 'POST',
              url: 'https://api.kipflow.io/social/v1/people/search',
              headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
              body,
              json: true,
            });
          }
        }

        // =============================================================
        //  Contatos
        // =============================================================
        else if (resource === 'contacts') {
          if (operation === 'searchPhones') {
            const cnpj = (this.getNodeParameter('contactsCnpj', i, '') as string).trim();
            const domain = (
              this.getNodeParameter('contactsDomain', i, '') as string
            ).trim();
            if (!cnpj && !domain) {
              throw new NodeOperationError(
                this.getNode(),
                'Informe pelo menos CNPJ ou domínio.',
                { itemIndex: i },
              );
            }
            const phoneLimit = this.getNodeParameter('phoneLimit', i, 10) as number;
            const excludeContador = this.getNodeParameter(
              'excludeContador',
              i,
              false,
            ) as boolean;
            const onlyWhatsapp = this.getNodeParameter(
              'onlyWhatsapp',
              i,
              false,
            ) as boolean;
            const phoneType = this.getNodeParameter('phoneType', i, '') as string;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const qs: Record<string, any> = { phone_limit: phoneLimit };
            if (cnpj) qs.cnpj = cnpj.replace(/\D/g, '');
            if (domain) qs.domain = domain;
            if (excludeContador) qs.exclude_contador = true;
            if (onlyWhatsapp) qs.only_whatsapp = true;
            if (phoneType) qs.tipo = phoneType;

            response = await this.helpers.httpRequest({
              method: 'GET',
              url: 'https://api.kipflow.io/contacts/v1/phones',
              qs,
              headers: { 'X-API-Key': apiKey },
              json: true,
            });
          } else if (operation === 'generateEmails') {
            const cnpj = (this.getNodeParameter('emailsCnpj', i, '') as string).trim();
            const domain = (this.getNodeParameter('emailsDomain', i, '') as string).trim();
            if (!cnpj && !domain) {
              throw new NodeOperationError(
                this.getNode(),
                'Informe pelo menos CNPJ ou domínio.',
                { itemIndex: i },
              );
            }
            const emailLimit = this.getNodeParameter('emailLimit', i, 10) as number;

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const qs: Record<string, any> = { email_limit: emailLimit };
            if (cnpj) qs.cnpj = cnpj.replace(/\D/g, '');
            if (domain) qs.domain = domain;

            response = await this.helpers.httpRequest({
              method: 'GET',
              url: 'https://api.kipflow.io/contacts/v1/emails',
              qs,
              headers: { 'X-API-Key': apiKey },
              json: true,
            });
          }
        }

        // =============================================================
        //  Inteligência
        // =============================================================
        else if (resource === 'intelligence') {
          const cnpj = (
            this.getNodeParameter('intelligenceCnpj', i, '') as string
          ).trim();
          const domain = (
            this.getNodeParameter('intelligenceDomain', i, '') as string
          ).trim();
          if (!cnpj && !domain) {
            throw new NodeOperationError(
              this.getNode(),
              'Informe pelo menos CNPJ ou domínio.',
              { itemIndex: i },
            );
          }
          const qs: Record<string, string> = {};
          if (cnpj) qs.cnpj = cnpj.replace(/\D/g, '');
          if (domain) qs.domain = domain;

          response = await this.helpers.httpRequest({
            method: 'GET',
            url: 'https://api.kipflow.io/intelligence/v1/activity-classifier',
            qs,
            headers: { 'X-API-Key': apiKey },
            json: true,
          });
        }

        // =============================================================
        //  PER-DCOMP
        // =============================================================
        else if (resource === 'perdcomp') {
          const cnpj = (
            this.getNodeParameter('perdcompCnpj', i, '') as string
          ).trim();
          if (!cnpj) {
            throw new NodeOperationError(this.getNode(), 'Informe o CNPJ.', {
              itemIndex: i,
            });
          }
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: 'https://api.kipflow.io/perdcomp/v1/search',
            qs: { cnpj: cnpj.replace(/\D/g, '') },
            headers: { 'X-API-Key': apiKey },
            json: true,
          });
        }

        // =============================================================
        //  Geolocalização
        // =============================================================
        else if (resource === 'geolocation') {
          const cnpj = (this.getNodeParameter('geoCnpj', i, '') as string).trim();
          if (!cnpj) {
            throw new NodeOperationError(this.getNode(), 'Informe o CNPJ.', {
              itemIndex: i,
            });
          }
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: 'https://api.kipflow.io/geo/v1/places',
            qs: { cnpj: cnpj.replace(/\D/g, '') },
            headers: { 'X-API-Key': apiKey },
            json: true,
          });
        }

        // =============================================================
        //  Trabalhista
        // =============================================================
        else if (resource === 'labor') {
          const cnpj = (this.getNodeParameter('laborCnpj', i, '') as string).trim();
          if (!cnpj) {
            throw new NodeOperationError(this.getNode(), 'Informe o CNPJ.', {
              itemIndex: i,
            });
          }
          response = await this.helpers.httpRequest({
            method: 'GET',
            url: 'https://api.kipflow.io/labor/v1/pat',
            qs: { cnpj: cnpj.replace(/\D/g, '') },
            headers: { 'X-API-Key': apiKey },
            json: true,
          });
        }

        // =============================================================
        //  Veículos
        // =============================================================
        else if (resource === 'vehicles') {
          if (operation === 'searchFleet') {
            const cnpj = (this.getNodeParameter('fleetCnpj', i, '') as string).trim();
            if (!cnpj) {
              throw new NodeOperationError(this.getNode(), 'Informe o CNPJ.', {
                itemIndex: i,
              });
            }
            const size = this.getNodeParameter('fleetSize', i, 0) as number;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const qs: Record<string, any> = { cnpj: cnpj.replace(/\D/g, '') };
            if (size > 0) qs.size = size;

            response = await this.helpers.httpRequest({
              method: 'GET',
              url: 'https://api.kipflow.io/vehicles/v1/fleet',
              qs,
              headers: { 'X-API-Key': apiKey },
              json: true,
            });
          } else if (operation === 'searchVehicle') {
            const plate = (
              this.getNodeParameter('vehiclePlate', i, '') as string
            ).trim();
            const vehicleId = (
              this.getNodeParameter('vehicleId', i, '') as string
            ).trim();
            if (!plate && !vehicleId) {
              throw new NodeOperationError(
                this.getNode(),
                'Informe pelo menos a placa ou o ID do veículo.',
                { itemIndex: i },
              );
            }
            const qs: Record<string, string> = {};
            if (plate) qs.plate = plate;
            if (vehicleId) qs.id = vehicleId;

            response = await this.helpers.httpRequest({
              method: 'GET',
              url: 'https://api.kipflow.io/vehicles/v1/search',
              qs,
              headers: { 'X-API-Key': apiKey },
              json: true,
            });
          } else if (operation === 'searchTachographFleet') {
            const cnpj = (
              this.getNodeParameter('tachographFleetCnpj', i, '') as string
            ).trim();
            if (!cnpj) {
              throw new NodeOperationError(this.getNode(), 'Informe o CNPJ.', {
                itemIndex: i,
              });
            }
            response = await this.helpers.httpRequest({
              method: 'GET',
              url: 'https://api.kipflow.io/vehicles/v1/tachograph/fleet',
              qs: { cnpj: cnpj.replace(/\D/g, '') },
              headers: { 'X-API-Key': apiKey },
              json: true,
            });
          } else if (operation === 'searchTachograph') {
            const identifier = (
              this.getNodeParameter('tachographIdentifier', i, '') as string
            ).trim();
            if (!identifier) {
              throw new NodeOperationError(
                this.getNode(),
                'Informe o identificador (placa ou ID).',
                { itemIndex: i },
              );
            }
            response = await this.helpers.httpRequest({
              method: 'GET',
              url: 'https://api.kipflow.io/vehicles/v1/tachograph',
              qs: { identifier },
              headers: { 'X-API-Key': apiKey },
              json: true,
            });
          } else if (operation === 'searchBatch') {
            const identifiersRaw = (
              this.getNodeParameter('batchIdentifiers', i, '') as string
            ).trim();
            if (!identifiersRaw) {
              throw new NodeOperationError(
                this.getNode(),
                'Informe os identificadores (placas ou IDs).',
                { itemIndex: i },
              );
            }
            const identifiers = identifiersRaw
              .split(',')
              .map((id: string) => id.trim())
              .filter(Boolean);

            response = await this.helpers.httpRequest({
              method: 'POST',
              url: 'https://api.kipflow.io/vehicles/v1/search/batch',
              headers: { 'X-API-Key': apiKey, 'Content-Type': 'application/json' },
              body: { identifiers },
              json: true,
            });
          }
        }

        // Check for API error response
        if (response && response.success === false && response.error) {
          throw new Error(response.error?.message || 'API returned success: false');
        }

        returnData.push({
          json: response || {},
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
