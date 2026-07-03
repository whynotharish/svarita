"use client";

import { useState, useRef, useEffect } from "react";
import { LogOut, User as UserIcon } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function AuthButton() {
  const { user, loading, signInWithGoogle, signOutUser } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  if (loading) {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-surface-elevated" />;
  }

  if (!user) {
    return (
      <button
        onClick={() => signInWithGoogle().catch(() => {})}
        className="flex items-center gap-2 rounded-full bg-accent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-accent-hover"
      >
        <UserIcon size={15} />
        Sign in
      </button>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 rounded-full border border-border bg-surface py-1 pl-1 pr-3 text-sm text-ink transition-colors hover:border-accent"
      >
        {user.photoURL ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.photoURL} alt="" className="h-7 w-7 rounded-full" referrerPolicy="no-referrer" />
        ) : (
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-soft text-accent">
            <UserIcon size={14} />
          </div>
        )}
        <span className="max-w-[100px] truncate">{user.displayName?.split(" ")[0] || "Account"}</span>
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-50 w-48 overflow-hidden rounded-xl border border-border bg-surface shadow-xl">
          <div className="border-b border-border px-4 py-3">
            <p className="truncate text-sm font-medium text-ink">{user.displayName}</p>
            <p className="truncate text-xs text-muted">{user.email}</p>
          </div>
          <button
            onClick={() => {
              setOpen(false);
              signOutUser();
            }}
            className="flex w-full items-center gap-2 px-4 py-3 text-sm text-ink transition-colors hover:bg-surface-elevated"
          >
            <LogOut size={14} /> Log out
          </button>
        </div>
      )}
    </div>
  );
}
