import { ParticipantPopulated } from './type';

export function userIsConversationParticipant(
  participants: Array<ParticipantPopulated>,
  userId: string
): boolean {
  return !!participants.find(participant => participant.user.id === userId);
}
