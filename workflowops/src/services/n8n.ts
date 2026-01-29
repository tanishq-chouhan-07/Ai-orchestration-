type N8nRequestOptions = {
  method?: string;
  body?: unknown;
};

function buildBaseUrl(instanceUrl: string) {
  const normalized = instanceUrl.replace(/\/+$/, "");
  return normalized.endsWith("/api/v1") ? normalized : `${normalized}/api/v1`;
}

async function n8nRequest<T>(
  instanceUrl: string,
  apiKey: string,
  path: string,
  options: N8nRequestOptions = {}
): Promise<T> {
  const url = `${buildBaseUrl(instanceUrl)}${path}`;
  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      "X-N8N-API-KEY": apiKey,
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`n8n request failed: ${response.status} ${text}`);
  }

  return (await response.json()) as T;
}

export function fetchWorkflows(instanceUrl: string, apiKey: string) {
  return n8nRequest<unknown[]>(instanceUrl, apiKey, "/workflows");
}

export function fetchWorkflowById(instanceUrl: string, apiKey: string, id: string) {
  return n8nRequest<unknown>(instanceUrl, apiKey, `/workflows/${id}`);
}

export function updateWorkflow(instanceUrl: string, apiKey: string, id: string, payload: unknown) {
  return n8nRequest<unknown>(instanceUrl, apiKey, `/workflows/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export function activateWorkflow(instanceUrl: string, apiKey: string, id: string) {
  return n8nRequest<unknown>(instanceUrl, apiKey, `/workflows/${id}/activate`, {
    method: "POST",
  });
}

export function deactivateWorkflow(instanceUrl: string, apiKey: string, id: string) {
  return n8nRequest<unknown>(instanceUrl, apiKey, `/workflows/${id}/deactivate`, {
    method: "POST",
  });
}

export function fetchExecutions(
  instanceUrl: string,
  apiKey: string,
  query: Record<string, string | number | undefined>
) {
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null) params.set(key, String(value));
  });
  const suffix = params.toString() ? `?${params.toString()}` : "";
  return n8nRequest<unknown[]>(instanceUrl, apiKey, `/executions${suffix}`);
}

export function fetchExecutionById(instanceUrl: string, apiKey: string, id: string) {
  return n8nRequest<unknown>(instanceUrl, apiKey, `/executions/${id}`);
}

export function retryExecution(instanceUrl: string, apiKey: string, id: string) {
  return n8nRequest<unknown>(instanceUrl, apiKey, `/executions/${id}/retry`, {
    method: "POST",
  });
}

export function deleteExecution(instanceUrl: string, apiKey: string, id: string) {
  return n8nRequest<unknown>(instanceUrl, apiKey, `/executions/${id}`, {
    method: "DELETE",
  });
}
