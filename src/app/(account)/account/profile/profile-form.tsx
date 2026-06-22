"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export type ProfileFormValues = {
  full_name: string;
  email: string;
  phone: string;
  marketing_consent: boolean;
};

export function ProfileForm({
  userId,
  initial,
}: {
  userId: string;
  initial: ProfileFormValues;
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [values, setValues] = useState<ProfileFormValues>(initial);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    setSaved(false);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        full_name: values.full_name.trim() || null,
        phone: values.phone.trim() || null,
        marketing_consent: values.marketing_consent,
      })
      .eq("id", userId);

    setSaving(false);
    if (updateError) {
      setError(updateError.message);
      return;
    }
    setSaved(true);
    setEditing(false);
    router.refresh();
  }

  if (!editing) {
    return (
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-[1.25rem]">Profile</h2>
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setSaved(false);
            }}
            className="fo-btn-secondary !min-h-0 !px-4 !py-2 text-[0.85rem]"
          >
            Edit
          </button>
        </div>
        {saved && (
          <p className="mt-3 rounded-control bg-fo-success/10 px-4 py-2 text-[0.85rem] font-bold text-fo-success">
            Profile updated.
          </p>
        )}
        <dl className="mt-4 grid grid-cols-1 gap-x-4 gap-y-2 text-[0.95rem] sm:grid-cols-[160px_1fr]">
          <dt className="text-fo-muted">Full name</dt>
          <dd className="font-bold">{values.full_name || "—"}</dd>
          <dt className="text-fo-muted">Email</dt>
          <dd className="font-bold">{values.email || "—"}</dd>
          <dt className="text-fo-muted">Phone</dt>
          <dd className="font-bold">{values.phone || "—"}</dd>
          <dt className="text-fo-muted">Marketing emails</dt>
          <dd className="font-bold">
            {values.marketing_consent ? "Subscribed" : "Not subscribed"}
          </dd>
        </dl>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-[1.25rem]">Edit profile</h2>

      {error && (
        <p className="mt-3 rounded-control border border-fo-error/30 bg-fo-error/10 px-4 py-2 text-[0.85rem] text-fo-error">
          {error}
        </p>
      )}

      <div className="mt-4 space-y-4">
        <div>
          <label htmlFor="full_name" className="block text-[0.9rem] font-bold">
            Full name
          </label>
          <input
            id="full_name"
            type="text"
            value={values.full_name}
            onChange={(e) =>
              setValues((v) => ({ ...v, full_name: e.target.value }))
            }
            className="mt-1.5 w-full rounded-control border border-fo-line bg-white px-4 py-2.5 text-[0.95rem] focus:border-fo-green-900 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-[0.9rem] font-bold">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={values.email}
            disabled
            className="mt-1.5 w-full rounded-control border border-fo-line bg-fo-cream-50 px-4 py-2.5 text-[0.95rem] text-fo-muted"
          />
          <p className="mt-1 text-[0.78rem] text-fo-muted">
            Email is tied to your sign-in and can&apos;t be changed here.
          </p>
        </div>

        <div>
          <label htmlFor="phone" className="block text-[0.9rem] font-bold">
            Phone
          </label>
          <input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={(e) => setValues((v) => ({ ...v, phone: e.target.value }))}
            placeholder="+91 ..."
            className="mt-1.5 w-full rounded-control border border-fo-line bg-white px-4 py-2.5 text-[0.95rem] focus:border-fo-green-900 focus:outline-none"
          />
        </div>

        <label className="flex items-center gap-2.5 text-[0.92rem]">
          <input
            type="checkbox"
            checked={values.marketing_consent}
            onChange={(e) =>
              setValues((v) => ({ ...v, marketing_consent: e.target.checked }))
            }
            className="h-4 w-4 accent-fo-green-900"
          />
          Send me occasional emails about new products and offers
        </label>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="fo-btn-primary !min-h-0 !px-5 !py-2.5 text-[0.9rem] disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => {
            setValues(initial);
            setEditing(false);
            setError(null);
          }}
          className="fo-btn-secondary !min-h-0 !px-5 !py-2.5 text-[0.9rem]"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
