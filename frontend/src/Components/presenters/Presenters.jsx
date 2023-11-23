import "../../css/Presenters.css";
import PresenterCard from "./PresenterCard";

export default function Presenters({ presenters }) {
  return (
    <div>
      {!presenters ? (
        <h1 style={{ height: "1000px" }}>loading</h1>
      ) : (
        <div className="presenters-container">
            {
                presenters.map(item => {
                    return (
                        <PresenterCard
                        name={item.name}
                        desc={item.workplace}
                        photo={item.pic}
                        logo={item.workplace_logo}
                        />
                    )
                })
            }
        </div>
      )}
    </div>
  );
}
