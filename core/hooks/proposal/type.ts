type FetchResultLoading = {
  isLoading: true;
  data: null;
  error: null;
};
type FetchResultError = {
  isLoading: false;
  data: null;
  error: Error;
};
type FetchResultData<T> = {
  isLoading: false;
  data: T | null | undefined;
  error: null;
};

export type FetchResult<T> =
  | FetchResultLoading
  | FetchResultError
  | FetchResultData<T>;
