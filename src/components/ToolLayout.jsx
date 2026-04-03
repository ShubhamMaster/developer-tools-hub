export default function ToolLayout({ left, right }) {
  return (
    <div className="grid h-full min-w-0 grid-cols-1 items-stretch gap-4 md:gap-4 xl:gap-5 lg:grid-cols-2">
      <div className="min-w-0 min-h-0">{left}</div>
      <div className="min-w-0 min-h-0">{right}</div>
    </div>
  );
}
