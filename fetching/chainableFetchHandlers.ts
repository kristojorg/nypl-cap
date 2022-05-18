

/**
 * Chainable handlers
 */
/**
 * Fetch doesn't reject if it receives a response from the server,
 * only if the actual fetch fails due to network failure or permission failure like
 * CORS issues. We catch and rethrow a wrapped error in those cases to give more info.
 */
 export const handleFetchError =
 (input: RequestInfo) => async (reason: unknown) => {
   const url = typeof input === "string" ? input : input.url;
   if (reason instanceof Error) {
     // wrap other errors returned by fetch in a FetchError class and re-throw
     throw new Error(`OPDS ERROR: Network error while fetching ${url}. ${reason.message}`);
   } else {
     // otherwise throw a generic error
     throw new Error(
      `OPDS ERROR: Unknown network error while fetching ${url}: ${reason}`
     );
   }
 };

export const handleCMError =
  (input: RequestInfo) => async (response: Response) => {
    const url = typeof input === "string" ? input : input.url;
    if (!response.ok) {
      const json = await response.json();
      throw new Error(`Server Error at URL (${url}): ${json.title}: ${json.detail}`);
    }
    return response;
  };

export const text = async (response: Response) => await response.text();
export const json = async (response: Response) => await response.json();

export const handleParsingError =
  (input: RequestInfo) => async (reason: unknown) => {
    const url = typeof input === "string" ? input : input.url;
    const e =
      reason instanceof Error
        ? reason
        : new Error(`Unknown error parsing ${url}: ${reason}`);

    throw e;
  };
