import { Link } from 'react-router-dom';
import PlaceholderArt from './PlaceholderArt';

export default function ArtworkCard({ to, title, subtitle, artPath }) {
  return (
    <Link to={to} className="artwork-card">
      {artPath ? (
        <img
          src={`/api/media/images/${artPath}`}
          alt={title}
          className="artwork-card__img"
        />
      ) : (
        <PlaceholderArt
          name={title}
          className="artwork-card__img"
          style={{ borderRadius: 'var(--radius)', border: '1.5px solid var(--line)' }}
        />
      )}
      <div className="artwork-card__info">
        <div className="artwork-card__title">{title}</div>
        {subtitle && <div className="artwork-card__sub">{subtitle}</div>}
      </div>
      <style>{`
        .artwork-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          text-decoration: none;
          color: inherit;
        }
        .artwork-card__img {
          width: 100%;
          aspect-ratio: 1/1;
          object-fit: cover;
          border-radius: var(--radius);
          border: 1.5px solid var(--line);
        }
        .artwork-card__info {
          padding: 0 2px;
        }
        .artwork-card__title {
          font-size: 0.8125rem;
          font-weight: 600;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .artwork-card__sub {
          font-size: 0.6875rem;
          color: var(--mute);
        }
      `}</style>
    </Link>
  );
}
