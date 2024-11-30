import GroupsMembers, {
  GroupsMembersCreationT,
} from "#db/models/GroupsMembers.js";

export default {
  createMembership: (query: GroupsMembersCreationT) =>
    GroupsMembers.create(query),
};
