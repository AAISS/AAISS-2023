import '../../css/PresenterCard.css';
import Image from '../image/Image.jsx';
// import IMG from '../../assets/Brain.png'
import URL from '../../providers/APIProvider/URL.js';
export default function PresenterCard({ name, photo, link, desc }) {
  return (
    <div className="presenter-card">
      <Image
        src={`${URL.baseURL}${photo}`}
        style={{
          width: '300px',
          height: '300px',
          borderRadius: '50%',
        }}
      />
      <a href={link} className="presenter-card-name">
        <h1>{name}</h1>
      </a>
      <p>{desc}</p>
    </div>
  );
}
