"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userIsConversationParticipant = void 0;
function userIsConversationParticipant(participants, userId) {
    return !!participants.find(participant => participant.user.id === userId);
}
exports.userIsConversationParticipant = userIsConversationParticipant;
