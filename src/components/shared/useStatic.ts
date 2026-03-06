"use client";

import { useSyncExternalStore } from "react";

class StaticStore {
    private states = new Map<string, any>();
    private listeners = new Set<() => void>();

    subscribe(callback: () => void) {
        this.listeners.add(callback);
        return () => this.listeners.delete(callback);
    }

    getSnapshot(key: string, initialValue?: any) {
        if (!this.states.has(key)) {
            this.states.set(key, initialValue ?? null);
        }
        return this.states.get(key);
    }

    updateState(key: string, value: any) {
        if (typeof value === "function") {
            const currentState = this.states.get(key);
            value = value(currentState);
        }
        this.states.set(key, value);
        this.emit();
    }

    private emit() {
        this.listeners.forEach((cb) => cb());
    }
}

const store = new StaticStore();

export function useStatic<T>(key: string, initialValue?: T): [T, (value: T | ((prevState: T) => T)) => void] {
    const openItemsSnapshot = useSyncExternalStore(
        store.subscribe.bind(store),
        store.getSnapshot.bind(store, key, initialValue),
        store.getSnapshot.bind(store, key, initialValue)
    );

    const setState = (value: T | ((prevState: T) => T)) => {
        store.updateState(key, value);
    };

    return [openItemsSnapshot, setState];
}