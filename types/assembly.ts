export type Role = 'founder' | 'organizer' | 'member';

export type AssemblyUser = {
  username: string;
  name: string;
  role: Role;
};
