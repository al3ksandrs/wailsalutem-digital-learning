import WSButton from "./WSButton";
import BaseProfileCard from "./BaseProfileCard";

interface ConnectionProps {
  id: number;
  name: string;
  image: string;
  subjects: string[];
}

const Connection: React.FC<ConnectionProps> = ({
  name,
  image,
  subjects,
}) => {
  return (
    <BaseProfileCard name={name} image={image} subjects={subjects} level={""} type={""} id={0}>
      <WSButton label="Info" size="normal" />
      <WSButton label="Contact" size="normal" />
    </BaseProfileCard>
  );
};

export default Connection;