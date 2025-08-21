import axios from 'axios';

const n8nApi = axios.create({
  baseURL: process.env.NEXT_PUBLIC_N8N_API_URL,
  headers: {
    'X-N8N-API-KEY': process.env.N8N_API_KEY,
    'Content-Type': 'application/json',
  },
});

if (process.env.N8N_BASIC_AUTH_USER && process.env.N8N_BASIC_AUTH_PASSWORD) {
  n8nApi.defaults.auth = {
    username: process.env.N8N_BASIC_AUTH_USER,
    password: process.env.N8N_BASIC_AUTH_PASSWORD,
  };
}

export interface Workflow {
  id?: string;
  name: string;
  active: boolean;
  nodes: Array<any>;
  connections: object;
  settings?: object;
  staticData?: object;
  tags?: Array<string>;
}

export interface WorkflowExecution {
  id: string;
  finished: boolean;
  mode: string;
  retryOf?: string;
  retrySuccessId?: string;
  startedAt: string;
  stoppedAt?: string;
  workflowData: Workflow;
}

export const workflowApi = {
  // Get all workflows
  async getWorkflows(): Promise<Workflow[]> {
    const response = await n8nApi.get('/workflows');
    return response.data.data;
  },

  // Get single workflow
  async getWorkflow(id: string): Promise<Workflow> {
    const response = await n8nApi.get(`/workflows/${id}`);
    return response.data;
  },

  // Create workflow
  async createWorkflow(workflow: Partial<Workflow>): Promise<Workflow> {
    const response = await n8nApi.post('/workflows', workflow);
    return response.data;
  },

  // Update workflow
  async updateWorkflow(id: string, workflow: Partial<Workflow>): Promise<Workflow> {
    const response = await n8nApi.patch(`/workflows/${id}`, workflow);
    return response.data;
  },

  // Delete workflow
  async deleteWorkflow(id: string): Promise<void> {
    await n8nApi.delete(`/workflows/${id}`);
  },

  // Activate/Deactivate workflow
  async toggleWorkflow(id: string, active: boolean): Promise<Workflow> {
    const response = await n8nApi.patch(`/workflows/${id}`, { active });
    return response.data;
  },

  // Execute workflow
  async executeWorkflow(id: string, data?: object): Promise<WorkflowExecution> {
    const response = await n8nApi.post(`/workflows/${id}/execute`, data);
    return response.data;
  },

  // Get workflow executions
  async getExecutions(workflowId?: string): Promise<WorkflowExecution[]> {
    const params = workflowId ? { workflowId } : {};
    const response = await n8nApi.get('/executions', { params });
    return response.data.data;
  },

  // Get execution details
  async getExecution(id: string): Promise<WorkflowExecution> {
    const response = await n8nApi.get(`/executions/${id}`);
    return response.data;
  },
};

export const nodeApi = {
  // Get all node types
  async getNodeTypes(): Promise<any[]> {
    const response = await n8nApi.get('/node-types');
    return response.data;
  },

  // Get credentials
  async getCredentials(): Promise<any[]> {
    const response = await n8nApi.get('/credentials');
    return response.data.data;
  },
};

export default n8nApi;