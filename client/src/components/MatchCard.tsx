import WSButton from "./WSButton";

export type MatchCardType =
    | 'match'
    | 'connection'

interface MatchCardProps {
    name: string;
    type: MatchCardType;
    image: string;
    subjects: string[];
}

const MatchCard: React.FC<MatchCardProps> = ({
    name,
    type = 'match',
    image,
    subjects,
}) => {

    // Match
    if (type === 'match') {
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
                                    <span key={subject} className="tag has-text-black has-background-white">
                                        {subject}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    <WSButton
                        label="Zie profiel"
                        size="normal"
                    />
                </div>
            </div>
        );
    }

    if (type === 'connection') {
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
                                    <span key={subject} className="tag has-text-black has-background-white">
                                        {subject}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    < div className="level-right">
                        <WSButton
                            label="Info"
                            size="normal"
                        />
                        <WSButton
                            label="Contact"
                            size="normal"
                        />
                    </div>

                </div>
            </div>
        )
    }
};

export default MatchCard;
