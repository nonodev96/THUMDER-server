export namespace UtilsEEDD {
  class MyMap<K, V> {
    private map: Map<K, V> = new Map<K, V>();

    get size() {
      return this.map.size;
    }

    public get(key: K): V | undefined {
      return this.map.get(key);
    }

    public set(key: K, value: V) {
      return this.map.set(key, value);
    }

    public has(key: K): boolean {
      return this.map.has(key);
    }

    public delete(key: K): boolean {
      return this.map.delete(key);
    }

    public entries(): IterableIterator<[K, V]> {
      return this.map.entries();
    }

    public values(): IterableIterator<V> {
      return this.map.values();
    }

    public keys(): IterableIterator<K> {
      return this.map.keys();
    }

    public clear(): void {
      return this.map.clear();
    }

    public findValue(operator: (_value: any) => boolean): K | null {
      const iterator = this.map[Symbol.iterator]();
      for (const [key, value] of iterator) {
        if (operator(value)) {
          return key;
        }
      }
      return null;
    }

    public getKey(targetValue: V): K | null {
      const iterator = this.map[Symbol.iterator]();
      for (const [key, value] of iterator) {
        if (value === targetValue)
          return key;
      }
      return null;
    }
  }
}