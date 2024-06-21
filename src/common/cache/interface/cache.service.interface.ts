export interface ICacheService {
  get(key: string): Promise<string>;
  remove(key: string): Promise<void>;
  set(key: string, value: string): Promise<void>;
}
