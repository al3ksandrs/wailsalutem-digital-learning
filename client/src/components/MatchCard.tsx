import WSButton from "./WSButton";
import BaseProfileCard from "./BaseProfileCard";

interface MatchCardProps {
  name: string;
  image: string;
  subjects: string[];
}

const MatchCard: React.FC<MatchCardProps> = ({
  name,
  image,
  subjects,
}) => {
  return (
    <BaseProfileCard name={name} image={image} subjects={subjects} level={""} type={""} id={0}>
      <WSButton label="Zie profiel" size="normal" />
    </BaseProfileCard>
  );
};

export default MatchCard;