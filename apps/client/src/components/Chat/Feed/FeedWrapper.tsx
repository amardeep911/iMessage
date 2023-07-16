import { Session } from 'next-auth';

interface FeedWrapperProps {
  session: Session;
}

export const FeedWrapper: React.FC<FeedWrapperProps> = ({ session }) => {
  return <div>FeedWrapper</div>;
};
