export default function Loading() {
  return (
    <div className="min-h-screen bg-[#DCD7C9] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#A2785C] mx-auto mb-4"></div>
        <p className="text-[#3F4F44]">Loading...</p>
      </div>
    </div>
  );
}
