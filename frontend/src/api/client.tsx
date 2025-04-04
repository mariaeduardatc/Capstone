const BASE_API_URL = 'https://capstone-production-8946.up.railway.app'

class APIClient {

  constructor(private readonly base_url: string = 'https://capstone-production-8946.up.railway.app') {
    this.base_url = BASE_API_URL;
  }

  public async request(options?: any) {
    const { route, method, query, headers, body } = options;

    let queryString = '';
    if (query) {
      const queryParams = (new URLSearchParams(query)).toString();
      queryString = (queryParams !== '') ? `?${queryParams}` : '';
    }

    console.log(`${this.base_url}${route}${queryString}`);

    const response = await fetch(`${this.base_url}${route}${queryString}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : null,
      credentials: 'include',
    });
    console.log(response.body);
    const data = await response.json();
    return {
      ok: response.ok,
      status: response.status,
      body: (response.status != 204) ? data : null,
    };
  }

  public async get(route: string, query: string, options: any) {
    return this.request({method: 'GET', route, query, ...options});
  }

  public async post(route: string, body: any, options: any) {
    return this.request({method: 'POST', route, body, ...options});
  }

}

export default APIClient;
