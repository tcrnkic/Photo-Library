import { useState, useEffect, useRef } from "react"
import InfoModal from "./InfoModal";
function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  const prevPageButton = useRef();
  const searchInput = useRef();

  const accessKey = import.meta.env.VITE_REACT_APP_UNSPLASH_API_KEY || process.env.REACT_APP_UNSPLASH_API_KEY;
  const apiUrl = 'https://api.unsplash.com/search/photos';

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(
          `${apiUrl}?client_id=${accessKey}&query=${encodeURIComponent(searchTerm)}&page=${page}&per_page=24`
        );
        const data = await response.json();

    
        if (Array.isArray(data.results)) {
          setPhotos(data.results);
        } else {
          console.error('Invalid response format:', data);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    console.log(photos);
    console.log('Search Term:', searchTerm);
    console.log('API URL:', `${apiUrl}?client_id=${accessKey}&query=${encodeURIComponent(searchTerm)}&page=${page}&per_page=24`);


  const buttonElement = prevPageButton.current;

  if (searchTerm) {
    fetchPhotos();
  }

  }, [searchTerm, page]);



  const handleSearchChange = () => {
    setSearchTerm(searchInput.current.value);
    setPage(1);
  };
  const nextPage = () => {
    setPage(page + 1);
    prevPageButton.current.classList.add("bg-blue-700");
    prevPageButton.current.classList.remove("bg-gray-400");
  };
  const prevPage = () => {
    if(page>2){
    setPage(page-1);
  
    }else if(page==2){
      setPage(page-1);
      prevPageButton.current.classList.add("bg-gray-400");
      prevPageButton.current.classList.remove("bg-blue-700");
    }else{
      setPage(1);
    }
  };
  const handleDownload = async (photo) => {
    try {
      const response = await fetch(photo.urls.full);  // or photo.links.download if provided
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${photo.id}_${photo.user.username}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  const handleInfoClick = (photo) => {
    setSelectedPhoto(photo);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
  };

  const photoBoxes = photos.map((photo) => (
    <div className=" overflow-hidden  h-[355px] bg-gray-100 rounded-md  ">
      <img
        key={photo.id}
        src={photo.urls.regular}
        alt={photo.alt_description}
        className="x w-full h-[250px] object-cover"
      />

     <div className="flex flex-col items-between ps-3  w-full py-2 ">
       <div className="flex items-center gap-2 py-3">
         <img src={photo.user.profile_image.small} alt="profile picture" className="rounded-full" />
           <a href={photo.user.links.html} target="/blank" name="Unsplash User" className="text-sm hover:text-blue-400 ease-in">By {photo.user.name}</a>
       </div>
        <div className="flex justify-between items-center">
          <button className="text-white text-sm px-3 py-1 rounded-lg cursor-pointer bg-blue-500" onClick={() => handleDownload(photo)}>
            Download
          </button>
          <span className="px-2 me-1 mb-2 md:block hidden cursor-pointer  rounded-full" onClick={() => handleInfoClick(photo)}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
</svg>
            </span>
        </div>
     </div>

    </div>
   ))


  return (
    <div className="px-8 font-body mx-auto container pb-20 ">

          <div className="py-6 flex flex-col flex-nowrap items-center">
              <h1 className="text-2xl md:text-4xl font-bold py-2 text-center">Photo Library For You!</h1>
              <p className="text-lg md:text-xl py-3 text-center">Search for any stock images that you could possibly need!</p>
               <p className="text-center text-xs font-semibold">Powered by Unsplash</p>
                <form className="my-2">
                 
                    <label className="bg-gray-300 p-5 rounded-lg flex mx-2 flex-wrap items-center justify-center">
                      Search for:
                      <input
                        ref={searchInput}
                        type="text" 
                        className="px-3 py-2 m-2 bg-gray-100 rounded-lg"
                      />
                      <button className="p-2 rounded-xl px-4 text-white border-1 border-blue-900 text-sm bg-blue-700" type="button" onClick={handleSearchChange}>Search</button>
                    </label>
                 
                </form>
                {photos.length>2 && 
                <div className="flex px-4 py-2 ">
                  <button type="button" ref={prevPageButton} className="text-xl text-white px-2 rounded-md bg-gray-400" onClick={prevPage}>{'<'}</button>
                  <p className="text-3xl px-4">{page}</p>
                  <button type="button" className="text-xl text-white px-2 rounded-md bg-blue-700" onClick={nextPage}>{'>'}</button>
                </div>}
                <InfoModal download={handleDownload} isOpen={modalOpen} onClose={closeModal} photoInfo={selectedPhoto} />
          </div>


      <div className="grid  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
         {photos.length>2 && photoBoxes}
     
      </div>
        {photos.length<1 && 
          <div className="flex justify-center items-center w-full">
              <div role="status" class="space-y-2.5 animate-pulse max-w-lg">
                  <div class="flex items-center w-full">
                      <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32"></div>
                      <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                      <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                  </div>
                  <div class="flex items-center w-full max-w-[480px]">
                      <div class="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                              <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                      <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                  </div>
                  <div class="flex items-center w-full max-w-[400px]">
                      <div class="h-2.5 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                      <div class="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
                      <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                  </div>
                  <div class="flex items-center w-full max-w-[480px]">
                      <div class="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                              <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                      <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                  </div>
                  <div class="flex items-center w-full max-w-[440px]">
                      <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-32"></div>
                      <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-24"></div>
                      <div class="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-full"></div>
                  </div>
                  <div class="flex items-center w-full max-w-[360px]">
                      <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                      <div class="h-2.5 ms-2 bg-gray-200 rounded-full dark:bg-gray-700 w-80"></div>
                      <div class="h-2.5 ms-2 bg-gray-300 rounded-full dark:bg-gray-600 w-full"></div>
                  </div>
                  <span class="sr-only">Loading...</span>
              </div>
            </div>
        }
    </div>
  );
};
export default App
