import { useState } from 'react';
import { Searchbar } from './Searchbar/Searchbar';
import { fetchImages, countTotalPages } from './services/imagesApi';
import { ImageGallery } from './ImageGallery/ImageGallery';
import { imagesMapper } from './utils/mapper';
import { Loader } from './Loader/Loader';
import { Button } from './Button/Button';
import { Modal } from './Modal/Modal';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import s from './App.module.css';
import { useEffect } from 'react';

export const App = () => {
  const [images, setImages] = useState([]);
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentImage, setCurrentImage] = useState(null);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const getImage = async () => {
      setIsLoading(true);

      const imagesArray = await fetchImages(query, page);
      const filtredImages = imagesMapper(imagesArray);
      if (imagesArray.length === 0) {
        setIsLoading(false);
        return notifyAboutError();
      }

      setImages(prevImages => [...prevImages, ...filtredImages]);
      setTotalPages(countTotalPages);
    };

    if (page === totalPages) {
      notifyAboutLastPage();
      setTotalPages(0);
    }

    setIsLoading(false);

    if (query) {
      getImage();
    }
  }, [query, page, totalPages]);

  const handleFormSubmit = query => {
    if (setQuery !== query) {
      setPage(1);
      setQuery(query);
      setImages([]);
    }
  };

  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
    scrollImages();
  };

  const openModal = data => {
    setCurrentImage(data);
  };

  const closeModal = () => {
    setCurrentImage(null);
  };

  const scrollImages = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: 'smooth',
    });
  };

  const notifyAboutError = () => {
    toast.error('Sorry, but there are no matching results.', {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  const notifyAboutLastPage = () => {
    toast.info("We're sorry, but you've reached the end of search results.", {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: 'light',
    });
  };

  return (
    <div className={s.App}>
      <Searchbar onSubmit={handleFormSubmit} />
      <ImageGallery images={images} openModal={openModal} />
      {isLoading && <Loader />}
      {images.length > 0 && !isLoading && totalPages > page && (
        <Button loadMore={loadMore} />
      )}
      {currentImage && (
        <Modal
          closeModal={closeModal}
          query={query}
          largeImage={currentImage}
        />
      )}
      <ToastContainer />
    </div>
  );
};
