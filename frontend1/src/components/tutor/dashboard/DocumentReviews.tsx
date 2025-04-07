const documentReviews = [
    { class: 'Information', reviews: 10 },
    { class: 'CSS', reviews: 20 },
    { class: 'Javascript', reviews: 20 },
    { class: 'Python', reviews: 20 },
    { class: 'Bootstrap', reviews: 20 },
    { class: 'React', reviews: 20 },
  ];
  
  const DocumentReviews = () => {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md">
        <h2 className="text-lg font-semibold mb-2">Document Reviews</h2>
        <div className="space-y-2">
          {documentReviews.map((item, index) => (
            <div key={index}>
              <p className="text-sm font-medium">{item.class}</p>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-500 h-2.5 rounded-full"
                  style={{ width: `${(item.reviews / 20) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default DocumentReviews;
  