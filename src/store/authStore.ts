"use client";

import { useSyncExternalStore } from "react";

const STORAGE_KEY = "beatza:is-authenticated";

type Listener = () => void;

let isAuthenticated = false;
const listeners = new Set<Listener>();

function readPersistedAuthState(): boolean {
	if (typeof window === "undefined") return false;
	return window.localStorage.getItem(STORAGE_KEY) === "true";
}

if (typeof window !== "undefined") {
	isAuthenticated = readPersistedAuthState();
}

function emitChange() {
	listeners.forEach((listener) => listener());
}

function setAuthenticated(nextValue: boolean) {
	if (isAuthenticated === nextValue) return;

	isAuthenticated = nextValue;

	if (typeof window !== "undefined") {
		window.localStorage.setItem(STORAGE_KEY, String(nextValue));
	}

	emitChange();
}

function getSnapshot() {
	return isAuthenticated;
}

function getServerSnapshot() {
	return false;
}

function subscribe(listener: Listener) {
	listeners.add(listener);

	if (typeof window === "undefined") {
		return () => listeners.delete(listener);
	}

	const onStorage = (event: StorageEvent) => {
		if (event.key !== STORAGE_KEY) return;
		const nextValue = event.newValue === "true";
		if (nextValue === isAuthenticated) return;
		isAuthenticated = nextValue;
		emitChange();
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
	const authenticated = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	return {
		isAuthenticated: authenticated,
		setAuthenticated,
	};
}
