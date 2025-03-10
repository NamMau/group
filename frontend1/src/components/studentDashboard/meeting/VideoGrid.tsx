import VideoCard from "@/components/studentDashboard/meeting/VideoCard";

const VideoGrid = () => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <VideoCard name="User 1" />
      <VideoCard name="User 2" />
    </div>
  );
};

export default VideoGrid;
