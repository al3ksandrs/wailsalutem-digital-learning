interface BaseProfileCardProps {
  name: string;
  image: string;
  subjects: string[];
  children?: React.ReactNode;
}

const BaseProfileCard: React.FC<BaseProfileCardProps> = ({
  name,
  image,
  subjects,
  children,
}) => {
  return (
    <div className="box" style={{ background: "#f5f5f5" }}>
      <div className="level is-mobile">
        <div className="level-left">
          <figure className="image is-64x64 mr-4">
            <img src={image} alt={name} />
          </figure>

          <div>
            <p className="has-text-black">{name}</p>

            <div className="tags mt-2">
              {subjects.map((subject) => (
                <span
                  key={subject}
                  className="tag has-text-black has-background-white"
                >
                  {subject}
                </span>
              ))}
            </div>
          </div>
        </div>

        {children && <div className="level-right">{children}</div>}
      </div>
    </div>
  );
};

export default BaseProfileCard;
