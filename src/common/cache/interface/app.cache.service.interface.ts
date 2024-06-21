export interface IAppCacheService {
  getOrSet<T>(
    key: string,
    fetchData: () => Promise<T>,
    bustCache: boolean,
  ): Promise<T | null>;
}
