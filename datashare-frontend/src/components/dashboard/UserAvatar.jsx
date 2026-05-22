export default function UserAvatar({ name }) {
  const initial = name?.trim()?.charAt(0)?.toUpperCase() ?? "?";

  return (
    <div
      aria-hidden="true"
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-ds-peach text-sm font-semibold text-ds-salmon"
    >
      {initial}
    </div>
  );
}
