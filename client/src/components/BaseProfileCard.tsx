import WSButton from "./WSButton";
import '../css/baseprofilecard.css';

interface BaseProfileCardProps {
  id: number;
  name: string;
  level: string
  type: string;
  image: string;
  subjects: string[];
  children?: React.ReactNode;
}

const BaseProfileCard: React.FC<BaseProfileCardProps> = ({
  name,
  level,
  type,
  image,
  subjects,
  children,
}) => {

  if (type === "Request") {
    return (
      <div className="box" style={{ backgroundColor: "#f5f5f5", borderRadius: "12px" }}>
        <div className="columns is-mobile is-vcentered">
          <div className="column is-narrow">
            <figure className="image is-64x64">
              <img
                src={image}
                alt={name}
              />
            </figure>
          </div>

          <div className="column">
            <p className="has-text-weight-semibold is-size-5 has-text-black">
              {name}
            </p>
            <p className="is-size-6 has-text-grey-dark">
              <span className="icon is-small mr-1">
                <i className="codicon codicon-mortar-board" />
              </span>
              {level}
            </p>
          </div>

          <div className="column has-text-right">
            {children}
          </div>
        </div>

        <div className="columns is-mobile mt-3">
          <div className="column is-rounded">
            <WSButton
              label="Weiger"
              size="normal"
              fullWidth
            />
          </div>
          <div className="column">
            <WSButton
              label="Accepteer"
              size="normal"
              fullWidth
            />
          </div>
        </div>
      </div>
    )
  }
  return (
    <div className="box" style={{ background: "#f5f5f5", borderRadius: "12px" }}>
      <div className="columns is-vcentered is-mobile is-multiline">

        <div className="column is-narrow">
          <figure className="image is-64x64">
            <img src={image} alt={name} />
          </figure>
        </div>

        <div className="column">
          <p className="has-text-black has-text-weight-semibold">
            {name}
          </p>

          <div className="tags mt-2">
            {subjects.map(subject => (
              <span
                key={subject}
                className="tag has-text-black has-background-white"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>

        {children && (
          <div className="column is-12-mobile is-narrow-tablet">
            <div className="is-fullwidth-mobile">
              {children}
            </div>
          </div>
        )}
      </div>
    </div>
  );

};

export default BaseProfileCard;