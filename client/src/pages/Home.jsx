import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ArtworkCard from '../components/ArtworkCard';
import TrackRow from '../components/TrackRow';
import { getLatestAlbums, getPopularTracks, getBands } from '../api/mock';

export default function Home() {
  const [albums, setAlbums] = useState([]);
  const [tracks, setTracks] = useState([]);
  const [bands, setBands] = useState([]);

  useEffect(() => {
    getLatestAlbums(6).then(setAlbums);
    getPopularTracks(6).then(setTracks);
    getBands().then(setBands);
  }, []);

  return (
    <div className="container">
      {/* Hero */}
      <div className="home-hero">
        <h1 className="home-hero__title">
          <span className="hand">JDTunez</span>
        </h1>
        <p className="home-hero__sub">Original music, streaming free.</p>
      </div>

      {/* Bands */}
      <div className="section-title">
        <span>Bands</span>
        <Link to="/bands" className="see-all mono">all &rarr;</Link>
      </div>
      <div className="home-bands">
        {bands.map((band) => (
          <ArtworkCard
            key={band.id}
            to={`/bands/${band.id}`}
            title={band.name}
            artPath={band.art_path}
          />
        ))}
      </div>

      {/* Latest Albums - horizontal carousel */}
      <div className="section-title">
        <span>Latest Albums</span>
      </div>
      <div className="album-carousel">
        {albums.map((album) => (
          <ArtworkCard
            key={album.id}
            to={`/albums/${album.id}`}
            title={album.title}
            subtitle={album.band_name}
            artPath={album.art_path}
          />
        ))}
      </div>

      {/* Popular Tracks */}
      <div className="section-title">
        <span>Popular Tracks</span>
      </div>
      <div className="track-grid">
        {tracks.map((track) => (
          <div key={track.id} className="track-grid__item">
            <TrackRow track={track} trackList={tracks} showAlbum />
          </div>
        ))}
      </div>

      <style>{`
        .home-hero {
          text-align: center;
          padding: 3rem 0 1rem;
        }
        .home-hero__title {
          font-size: 3rem;
          margin: 0;
        }
        .home-hero__sub {
          color: var(--mute);
          font-size: 0.9375rem;
          margin-top: 0.25rem;
        }
        .home-bands {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
          gap: 16px;
        }
        .album-carousel {
          display: grid;
          grid-auto-flow: column;
          grid-auto-columns: 42%;
          gap: 12px;
          overflow-x: auto;
          scroll-snap-type: x mandatory;
          padding-bottom: 8px;
          scrollbar-width: thin;
        }
        .album-carousel > * {
          scroll-snap-align: start;
        }
        @media (min-width: 640px) {
          .album-carousel {
            grid-auto-columns: 28%;
          }
        }
        @media (min-width: 1024px) {
          .album-carousel {
            display: grid;
            grid-auto-flow: unset;
            grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
            overflow: visible;
          }
        }
        .track-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 0;
        }
        @media (min-width: 768px) {
          .track-grid {
            grid-template-columns: 1fr 1fr;
            gap: 0 16px;
          }
        }
      `}</style>
    </div>
  );
}
