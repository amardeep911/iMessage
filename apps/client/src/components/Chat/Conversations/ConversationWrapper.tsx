import { Session } from 'next-auth';
import React from 'react';

interface ConversationWrapperProps {
  session: Session;
}

export const ConversationWrapper: React.FC<ConversationWrapperProps> = ({
  session,
}) => {
  return <div>ConversationWrapper</div>;
};
