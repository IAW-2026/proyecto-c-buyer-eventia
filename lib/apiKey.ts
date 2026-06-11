//funcion para validar api key recibida
export function validarApiKey(request: Request, expectedKey: string | undefined): boolean {
  if (!expectedKey) return false;
  const apiKeyRecibida = request.headers.get('x-api-key');
  return apiKeyRecibida === expectedKey;
}