
const InfoModal = ({download, isOpen, onClose, photoInfo }) => {
    if (!isOpen) return null;
    console.log(photoInfo);
    return (
        <div className=" fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div className="relative bg-white p-8 rounded-md flex">
          <span className="close text-white absolute top-2 right-2 text-2xl cursor-pointer bg-red-500 rounded-full px-2" onClick={onClose}>
            X
          </span>
          <img
        key={photoInfo.id}
        src={photoInfo.urls.regular}
        alt={photoInfo.alt_description}
        className="x w-[320px] h-[250px] object-cover"
      />
          <div className="ps-8">
          <div className="flex items-center gap-2 py-3">
         <img src={photoInfo.user.profile_image.small} alt="profile picture" className="rounded-full" />
           <a href={photoInfo.user.links.html} target="/blank" name="Unsplash User" className="text-sm hover:text-blue-400 ease-in">By {photoInfo.user.name}</a>
       </div>
            <p className="text-sm text-gray-500 ">{photoInfo.created_at.slice(0,10)}</p>
            <h2 className="text-2xl font-bold mb-4">{photoInfo.title}</h2>
            <p className="text-gray-700">{photoInfo.description ? photoInfo.description : "No description available."}</p>
          </div>
          <button className="text-white text-sm px-3 absolute bottom-8 right-5 py-1 rounded-lg cursor-pointer bg-blue-500" onClick={() => download(photoInfo)}>
            Download
          </button>
        </div>
      </div>
    );
  };
  
  export default InfoModal;