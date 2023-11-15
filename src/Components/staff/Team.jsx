import StaffCard from './StaffCard.jsx';
import '../../css/Team.css';

const Team = ({ people }) => {
  return (
    <div className="team-container">
      {/* TODO: what is section???? */}
      {/* <h1>{section}</h1> */}
      <div className="team-people-container">
        {people.map((item) => {
          return <StaffCard name={item.name} role={item.role} />;
        })}
      </div>
    </div>
  );
};

export default Team;
