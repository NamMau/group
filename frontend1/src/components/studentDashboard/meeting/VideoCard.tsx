interface VideoCardProps {
    name: string;
  }
  
  const VideoCard = ({ name }: VideoCardProps) => {
    return (
      <div className="w-60 h-36 bg-gray-700 flex flex-col items-center justify-center rounded-lg">
        <div className="w-16 h-16 bg-gray-500 rounded-full mb-2"></div>
        <p className="text-sm text-gray-300">{name}</p>
      </div>
    );
  };
  
  export default VideoCard;
  