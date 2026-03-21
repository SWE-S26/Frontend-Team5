"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "beatza:is-authenticated";

type Listener = () => void;

let isAuthenticated = false;
let hasHydrated = false;
const listeners = new Set<Listener>();

type AuthSnapshot = {
	isAuthenticated: boolean;
	hasHydrated: boolean;
};

const serverSnapshot: AuthSnapshot = {
	isAuthenticated: false,
	hasHydrated: false,
};

let snapshot: AuthSnapshot = serverSnapshot;

function readPersistedAuthState(): boolean {
	if (typeof window === "undefined") return false;
	return window.localStorage.getItem(STORAGE_KEY) === "true";
}

function emitChange() {
	listeners.forEach((listener) => listener());
}

function syncSnapshot() {
	const nextSnapshot: AuthSnapshot = {
		isAuthenticated,
		hasHydrated,
	};

	if (
		snapshot.isAuthenticated === nextSnapshot.isAuthenticated &&
		snapshot.hasHydrated === nextSnapshot.hasHydrated
	) {
		return false;
	}

	snapshot = nextSnapshot;
	return true;
}

function hydrateFromStorage() {
	if (typeof window === "undefined") return;

	const nextValue = readPersistedAuthState();
	const authChanged = isAuthenticated !== nextValue;
	const hydrationChanged = !hasHydrated;

	isAuthenticated = nextValue;
	hasHydrated = true;

	if (syncSnapshot() && (authChanged || hydrationChanged)) {
		emitChange();
	}
}

function setAuthenticated(nextValue: boolean) {
	if (isAuthenticated === nextValue) return;

	isAuthenticated = nextValue;
	hasHydrated = true;

	if (typeof window !== "undefined") {
		window.localStorage.setItem(STORAGE_KEY, String(nextValue));
	}

	if (syncSnapshot()) {
		emitChange();
	}
}

function getSnapshot() {
	return snapshot;
}

function getServerSnapshot() {
	return serverSnapshot;
}

function subscribe(listener: Listener) {
	listeners.add(listener);

	if (typeof window === "undefined") {
		return () => listeners.delete(listener);
	}

	hydrateFromStorage();

	const onStorage = (event: StorageEvent) => {
		if (event.key !== STORAGE_KEY) return;
		const nextValue = event.newValue === "true";
		if (nextValue === isAuthenticated) return;
		isAuthenticated = nextValue;
		hasHydrated = true;
		if (syncSnapshot()) {
			emitChange();
		}
	};

	window.addEventListener("storage", onStorage);

	return () => {
		listeners.delete(listener);
		window.removeEventListener("storage", onStorage);
	};
}

export const authStore = {
	getAuthenticated: () => getSnapshot(),
	setAuthenticated,
};

export function useAuthStore() {
	const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	return {
		isAuthenticated: snapshot.isAuthenticated,
		hasHydrated: snapshot.hasHydrated,
		setAuthenticated,
	};
}
