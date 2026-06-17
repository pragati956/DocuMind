export default function SearchSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading search results"
      className="space-y-4"
    >
      {[1, 2, 3, 4].map((item) => (
        <div
          key={item}
          className="
          h-32
          rounded-2xl
          bg-[#111827]
          animate-pulse
          "
        />
      ))}
    </div>
  );
}