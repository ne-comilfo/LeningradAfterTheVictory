"use client";
import dynamic from 'next/dynamic';
const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });
import styles from './CustomVideoPlayer.module.css';

const CustomVideoPlayer = ({ url, poster }) => {
  return (
    <div className={styles.videoWrapper}>
      <ReactPlayer
        url={url}
        width="100%"
        height="100%"
        controls
        light={poster || false} // Управляем воспроизведением через проп
        playing={true}
        config={{
          file: {
            attributes: {
              poster, // Постер для локальных видео
              controlsList: "nodownload" // Блокировка скачивания
            }
          }
        }}
      />
    </div>
  );
};

export default CustomVideoPlayer;