const VideoCardSkeleton = () => {
  return (
    <div className="animate-pulse">
      <div className="w-full h-40 bg-gray-300 rounded-lg"></div>

      <div className="flex mt-3 gap-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full"></div>

        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-300 rounded w-3/4"></div>
          <div className="h-3 bg-gray-300 rounded w-1/2"></div>
          <div className="h-3 bg-gray-300 rounded w-1/3"></div>
        </div>
      </div>
    </div>
  );
};

export default VideoCardSkeleton;