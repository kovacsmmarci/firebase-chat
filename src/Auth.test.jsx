// src/Auth.test.jsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";

// ---- MOCK FIREBASE SDKS USED IN src/firebase.js ---- //

// firebase/app: initializeApp
vi.mock("firebase/app", () => ({
  __esModule: true,
  initializeApp: vi.fn(() => ({})), // fake app object
}));

// firebase/auth: everything used in firebase.js and Auth.jsx
vi.mock("firebase/auth", () => {
  const signInWithPopup = vi.fn();
  const createUserWithEmailAndPassword = vi.fn();
  const signInWithEmailAndPassword = vi.fn();
  const updateProfile = vi.fn();
  const getAuth = vi.fn(() => ({})); // fake auth instance
  const GoogleAuthProvider = vi.fn();

  return {
    __esModule: true,
    signInWithPopup,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile,
    getAuth,
    GoogleAuthProvider,
  };
});

// firebase/firestore: getFirestore
vi.mock("firebase/firestore", () => ({
  __esModule: true,
  getFirestore: vi.fn(() => ({})),
}));

// firebase/database: getDatabase
vi.mock("firebase/database", () => ({
  __esModule: true,
  getDatabase: vi.fn(() => ({})),
}));

// firebase/storage: getStorage
vi.mock("firebase/storage", () => ({
  __esModule: true,
  getStorage: vi.fn(() => ({})),
}));

// ---- IMPORT AFTER MOCKS ---- //

import Auth from "./components/Auth.jsx";
import { signInWithPopup } from "firebase/auth";

describe("Auth component", () => {
  test("renders login UI with title and Google button", () => {
    render(<Auth />);

    // Title and subtitle
    expect(screen.getByText(/chat app/i)).toBeInTheDocument();
    expect(
      screen.getByText(/sign in to start chatting/i)
    ).toBeInTheDocument();

    // Google button via data-testid
    const googleButton = screen.getByTestId("google-login-button");
    expect(googleButton).toBeInTheDocument();

    // Accessible name comes from aria-label="Sign in with Google"
    expect(googleButton).toHaveAccessibleName(/sign in with google/i);

    // You *can* also assert on the visible text if you want:
    expect(googleButton).toHaveTextContent(/continue with google/i);
  });

  test("calls Firebase Google sign-in when Google button is clicked", () => {
    render(<Auth />);

    const googleButton = screen.getByTestId("google-login-button");
    fireEvent.click(googleButton);

    expect(signInWithPopup).toHaveBeenCalledTimes(1);
  });
});
